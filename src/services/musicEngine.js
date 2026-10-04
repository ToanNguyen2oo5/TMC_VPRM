// Vietnamese Traditional Instrumental Music Engine
// Features specialized I - IV - V (Chủ âm - Hạ át - Át âm) Pentatonic Harmonic Progression
// with Web Audio API for 100% reliable, zero-latency playback

export const PENTATONIC_TRACKS = [
  {
    id: 'hoa-am-i-iv-v',
    title: 'Hòa Âm Ngũ Cung I – IV – V',
    scaleName: 'Điệu Thức 5 Âm • Chủ Âm – Hạ Át – Át Âm',
    description: 'Bản hòa tấu độc đáo xoay quanh 3 bậc hòa thanh trụ cột (I - IV - V) kết hợp thang âm Ngũ Cung Đại Việt',
    tempo: 76,
    hasChordProgression: true,
    chords: [
      { name: 'I', label: 'Chủ Âm (Tonic)', rootName: 'D', bars: 'Nhịp 1-2', desc: 'Thanh bình, trang trọng, vững chãi' },
      { name: 'IV', label: 'Hạ Át (Subdominant)', rootName: 'G', bars: 'Nhịp 3-4', desc: 'Mở rộng không gian, thanh thoát, bay bổng' },
      { name: 'V', label: 'Át Âm (Dominant)', rootName: 'A', bars: 'Nhịp 5-6', desc: 'Kịch tính, cao trào, tích lũy năng lượng' },
      { name: 'I', label: 'Chủ Âm (Giải kết)', rootName: 'D', bars: 'Nhịp 7-8', desc: 'Giải tỏa trọn vẹn, trở về sự an yên trác tuyệt' }
    ],
    // D Major Pentatonic: D, E, F#, A, B
    scale: [146.83, 220.00, 293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00],
    // 32-step phrase with 4 chord sections (8 steps each: I -> IV -> V -> I)
    chordProgression: [
      // Steps 0-7: Chord I (D)
      { chordIndex: 0, chord: 'I', rootFreq: 73.42, fifthFreq: 110.00, leadScale: [293.66, 369.99, 440.00, 493.88, 587.33], noteIdx: [0, 2, 1, 2, 4, 3, 2, 0] },
      // Steps 8-15: Chord IV (G)
      { chordIndex: 1, chord: 'IV', rootFreq: 98.00, fifthFreq: 146.83, leadScale: [196.00, 246.94, 293.66, 329.63, 392.00], noteIdx: [0, 1, 3, 4, 3, 2, 1, 0] },
      // Steps 16-23: Chord V (A)
      { chordIndex: 2, chord: 'V', rootFreq: 110.00, fifthFreq: 164.81, leadScale: [220.00, 277.18, 329.63, 369.99, 440.00], noteIdx: [0, 2, 4, 3, 4, 3, 2, 1] },
      // Steps 24-31: Chord I Resolution (D)
      { chordIndex: 3, chord: 'I', rootFreq: 73.42, fifthFreq: 110.00, leadScale: [293.66, 369.99, 440.00, 493.88, 587.33], noteIdx: [4, 3, 2, 1, 2, 0, -1, 0] }
    ]
  },
  {
    id: 'nha-nhac',
    title: 'Nhã Nhạc Cung Đình Huế',
    scaleName: 'Điệu Bắc — Kim Tiền Hoàng Cung',
    description: 'Âm hưởng đàn tranh và chuông khánh uy nghiêm chốn hoàng thành',
    tempo: 78,
    scale: [293.66, 329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00],
    motif: [0, 2, 3, 2, 4, 3, 5, 4, 2, 3, 1, 0, 3, 2, 0, -1]
  },
  {
    id: 'sen-vang',
    title: 'Hương Sen Đại Việt',
    scaleName: 'Ngũ Cung Thanh Nhã',
    description: 'Nốt đàn tranh thanh thoát giao hòa làn gió đồng bằng Bắc Bộ',
    tempo: 70,
    scale: [349.23, 392.00, 466.16, 523.25, 587.33, 698.46, 783.99, 932.33],
    motif: [0, 1, 3, 4, 3, 1, 2, 0, 4, 5, 3, 2, 1, 0, 2, 3]
  },
  {
    id: 'sao-truc',
    title: 'Tiếng Trúc Kinh Bắc',
    scaleName: 'Điệu Xuân — Tứ Thân Trẩy Hội',
    description: 'Giai điệu sáo trúc mộc mạc gợi nhắc làng quan họ và nón quai thao',
    tempo: 84,
    scale: [392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50],
    motif: [0, 2, 3, 4, 2, 3, 1, 0, 5, 4, 3, 2, 4, 3, 1, 0]
  },
  {
    id: 'song-nuoc',
    title: 'Sóng Nước Phương Nam',
    scaleName: 'Điệu Nam Oán — Khăn Rằn Miệt Vườn',
    description: 'Âm sắc da diết, mộc mạc của sông nước Cửu Long',
    tempo: 62,
    scale: [261.63, 311.13, 349.23, 392.00, 466.16, 523.25, 622.25, 698.46],
    motif: [0, 1, 3, 2, 4, 3, 1, 0, 2, 4, 5, 3, 1, 0, 3, 2]
  }
];

class TraditionalMusicEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.timerId = null;
    this.step = 0;
    this.activeChordIndex = 0;
    this.volume = 0.55;
    this.masterGain = null;
    this.onStateChangeCallbacks = [];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  subscribe(callback) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  notify() {
    const state = this.getState();
    this.onStateChangeCallbacks.forEach(cb => cb(state));
  }

  getState() {
    const currentTrack = PENTATONIC_TRACKS[this.currentTrackIndex];
    return {
      isPlaying: this.isPlaying,
      currentTrack,
      currentTrackIndex: this.currentTrackIndex,
      tracks: PENTATONIC_TRACKS,
      volume: this.volume,
      step: this.step,
      activeChordIndex: this.activeChordIndex,
      activeChord: currentTrack?.chords ? currentTrack.chords[this.activeChordIndex] : null
    };
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  // Pluck a traditional Dan Tranh (zither) note with harmonics & decay
  playDanTranhNote(freq, time, duration = 1.8, velocity = 0.6) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.008, time);

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(freq * 3, time);

    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.001, time);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.45, time + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.16, time + 0.28);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, time);
    filter.frequency.exponentialRampToValueAtTime(650, time + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    osc3.connect(noteGain);
    noteGain.connect(filter);
    filter.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc3.start(time);

    osc1.stop(time + duration);
    osc2.stop(time + duration);
    osc3.stop(time + duration);
  }

  // Play a resonant harmonic chord bass drone (tiếng trầm đệm âm gốc & bậc 5)
  playBassDrone(freq, time, duration = 3.6, velocity = 0.35) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq * 0.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(velocity * 0.4, time + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(filter);
    filter.connect(this.masterGain);

    osc.start(time);
    sub.start(time);
    osc.stop(time + duration);
    sub.stop(time + duration);
  }

  // Play an arpeggio flourish (rải dây ngũ cung theo hợp âm)
  playArpeggioSweep(scale, time, baseVelocity = 0.3) {
    if (!scale || !scale.length) return;
    scale.slice(0, 4).forEach((freq, idx) => {
      this.playDanTranhNote(freq, time + idx * 0.05, 1.4, baseVelocity * 0.7);
    });
  }

  // Play gentle bamboo flute (Sáo Trúc) breathy tone with subtle vibrato
  playSaoTrucTone(freq, time, duration = 2.2, velocity = 0.28) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Vibrato LFO
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.2, time);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(3.8, time);
    lfo.connect(osc.frequency);

    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.001, time);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.38, time + 0.22);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.22, time + duration * 0.7);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    lfo.start(time);
    osc.start(time);
    lfo.stop(time + duration);
    osc.stop(time + duration);
  }

  // Play temple bell chime / royal gong resonance (Khánh đồng)
  playChime(time) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, time); // D5

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.14, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 4.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 4.2);
  }

  tick() {
    if (!this.isPlaying || !this.ctx) return;

    const track = PENTATONIC_TRACKS[this.currentTrackIndex];
    const now = this.ctx.currentTime;

    // Mode 1: Specialized I - IV - V Chord Progression
    if (track.hasChordProgression && track.chordProgression) {
      const sectionLength = 8;
      const totalSteps = track.chordProgression.length * sectionLength; // 32 steps
      const currentStep = this.step % totalSteps;
      const sectionIdx = Math.floor(currentStep / sectionLength);
      const section = track.chordProgression[sectionIdx];
      const stepInSection = currentStep % sectionLength;

      // Update active chord index for UI visualizer
      if (this.activeChordIndex !== section.chordIndex) {
        this.activeChordIndex = section.chordIndex;
        this.notify();
      }

      // At start of each chord section (every 8 steps): Play Root & 5th Bass Drone and Arpeggio
      if (stepInSection === 0) {
        this.playBassDrone(section.rootFreq, now, 3.8, 0.45);
        this.playBassDrone(section.fifthFreq, now + 0.08, 3.2, 0.32);
        this.playArpeggioSweep(section.leadScale, now + 0.02, 0.45);
        if (sectionIdx === 0 || sectionIdx === 3) {
          this.playChime(now);
        }
      }

      // Melody note for this step
      const noteIdx = section.noteIdx[stepInSection % section.noteIdx.length];
      if (noteIdx >= 0 && noteIdx < section.leadScale.length) {
        const melodyFreq = section.leadScale[noteIdx];
        this.playDanTranhNote(melodyFreq, now, 1.6, 0.58);

        // Harmonize with Sáo Trúc every 2 or 4 steps
        if (stepInSection % 2 === 0) {
          const fluteFreq = section.leadScale[(noteIdx + 2) % section.leadScale.length] * 1.5;
          if (fluteFreq < 1200) {
            this.playSaoTrucTone(fluteFreq, now + 0.04, 1.8, 0.28);
          }
        }
      }
    } else {
      // Mode 2: Standard Pentatonic Melody Loop
      const scale = track.scale;
      const motif = track.motif;
      const noteIdx = motif[this.step % motif.length];

      if (noteIdx >= 0 && noteIdx < scale.length) {
        const freq = scale[noteIdx];
        this.playDanTranhNote(freq, now, 1.8, 0.55);

        if (this.step % 4 === 0) {
          const fluteFreq = scale[(noteIdx + 2) % scale.length];
          this.playSaoTrucTone(fluteFreq, now + 0.05, 2.0, 0.28);
        }

        if (this.step % 16 === 0) {
          this.playChime(now);
        }
      }
    }

    this.step++;
    const intervalMs = (60 / track.tempo) * 500; // 8th note
    this.timerId = setTimeout(() => this.tick(), intervalMs);
  }

  play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.notify();
    this.tick();
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  selectTrack(index) {
    if (index >= 0 && index < PENTATONIC_TRACKS.length) {
      this.currentTrackIndex = index;
      this.step = 0;
      this.activeChordIndex = 0;
      this.notify();
    }
  }

  jumpToChord(chordIndex) {
    if (chordIndex >= 0 && chordIndex <= 3) {
      this.activeChordIndex = chordIndex;
      this.step = chordIndex * 8;
      if (!this.isPlaying) {
        this.play();
      } else {
        this.notify();
      }
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % PENTATONIC_TRACKS.length;
    this.step = 0;
    this.activeChordIndex = 0;
    this.notify();
  }

  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + PENTATONIC_TRACKS.length) % PENTATONIC_TRACKS.length;
    this.step = 0;
    this.activeChordIndex = 0;
    this.notify();
  }
}

export const musicEngine = new TraditionalMusicEngine();
export const TRACK_LIST = PENTATONIC_TRACKS;
