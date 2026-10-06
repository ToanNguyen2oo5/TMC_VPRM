import React, { useEffect, useRef } from 'react';
import { useDeviceTier } from '../../motion/useDeviceTier';
import { motion, AnimatePresence } from 'framer-motion';

export default function SilkOverlay({ isAnimating, pendingTab, onHalfway, onComplete }) {
  const containerRef = useRef(null);
  const tier = useDeviceTier();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!isAnimating || tier === 'low' || prefersReducedMotion) return;

    let reqId;
    let renderer, gl, mesh, program;
    let startTime = performance.now();
    let isHalfwayFired = false;
    let isUnmounted = false;

    import('ogl').then(({ Renderer, Camera, Transform, Plane, Program, Mesh }) => {
      if (isUnmounted) return;

      renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
      gl = renderer.gl;
      if (containerRef.current) {
        containerRef.current.appendChild(gl.canvas);
      }
      gl.clearColor(0, 0, 0, 0);

      const camera = new Camera(gl, { near: 0.1, far: 100 });
      camera.position.z = 1;

      const scene = new Transform();

      const geometry = new Plane(gl, { width: 2, height: 2, widthSegments: 20, heightSegments: 20 });

      const vertex = `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Fabric waving effect
          float wave = sin(pos.x * 3.0 + uTime * 2.0) * 0.1 * sin(uProgress * 3.14159);
          pos.z += wave;

          gl_Position = vec4(pos, 1.0);
        }
      `;

      const fragment = `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uProgress;

        void main() {
          vec3 color1 = vec3(0.79, 0.63, 0.35); // Vàng đồng #C9A15A
          vec3 color2 = vec3(0.9, 0.8, 0.5);    // Vàng nhạt sáng

          float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
          float shine = abs(sin(vUv.x * 10.0 + uTime)) * 0.2;
          
          vec3 finalColor = mix(color1, color2, vUv.y) + shine;

          // Transition logic (sweeping across screen)
          float sweep = uProgress * 2.0; // 0 to 2
          
          // In (0 to 1), cover screen from left to right
          // Out (1 to 2), uncover screen from left to right
          
          float alpha = 1.0;
          if (sweep <= 1.0) {
            if (vUv.x > sweep * 1.5 - 0.25) alpha = smoothstep(sweep * 1.5 - 0.25, sweep * 1.5, vUv.x) * 0.0;
          } else {
            float outSweep = sweep - 1.0;
            if (vUv.x < outSweep * 1.5 - 0.25) alpha = 0.0;
          }

          if (alpha < 0.05) discard;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `;

      program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
        },
        transparent: true,
      });

      mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      }
      window.addEventListener('resize', resize, false);
      resize();

      function cleanupGl() {
        window.removeEventListener('resize', resize);
        if (gl) {
          if (gl.canvas && gl.canvas.parentNode) {
            gl.canvas.parentNode.removeChild(gl.canvas);
          }
          try {
            const ext = gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
          } catch (e) {
            // ignore context loss failure
          }
        }
      }

      function update(t) {
        if (isUnmounted) return;
        reqId = requestAnimationFrame(update);

        const elapsed = t - startTime;
        const totalDuration = 1000; // 1 second total (450ms in, 100ms hold, 450ms out)
        
        program.uniforms.uTime.value = elapsed * 0.001;
        
        let progress = elapsed / totalDuration;
        
        if (progress > 1.0) progress = 1.0;
        
        // Map progress 0-1 to shader uProgress 0-2
        program.uniforms.uProgress.value = progress * 2.0;

        if (progress >= 0.5 && !isHalfwayFired) {
          isHalfwayFired = true;
          if (onHalfway) onHalfway();
        }

        renderer.render({ scene, camera });

        if (progress >= 1.0) {
          cancelAnimationFrame(reqId);
          cleanupGl();
          if (onComplete) onComplete();
        }
      }
      reqId = requestAnimationFrame(update);
    });

    return () => {
      isUnmounted = true;
      if (reqId) cancelAnimationFrame(reqId);
      if (gl) {
        if (gl.canvas && gl.canvas.parentNode) {
          gl.canvas.parentNode.removeChild(gl.canvas);
        }
        try {
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        } catch (e) {}
      }
    };
  }, [isAnimating, tier, prefersReducedMotion]);

  // Fallback for low tier or reduced motion (CSS crossfade/wipe)
  if (tier === 'low' || prefersReducedMotion) {
    return (
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: '#1C1917',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onAnimationComplete={() => {
               if (onHalfway) onHalfway();
               setTimeout(() => {
                 if (onComplete) onComplete();
               }, 100);
            }}
          >
            <div className="spinner" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: isAnimating ? 'auto' : 'none'
      }} 
    />
  );
}
