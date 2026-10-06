import { useState, useEffect } from 'react';
import { useTranslation } from '../services/i18n';
import { motion } from 'framer-motion';
import { springs } from '../motion/tokens';
import './StickyStepper.css';

export default function StickyStepper({ currentStep = 1, stepTitle = '' }) {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  const steps = [
    { step: 1, label: t('stepper_step1'), percent: 25 },
    { step: 2, label: t('stepper_step2'), percent: 50 },
    { step: 3, label: t('stepper_step3'), percent: 75 },
    { step: 4, label: t('stepper_step4'), percent: 100 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 140);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const current = steps.find(s => s.step === currentStep) || steps[0];
  const displayTitle = stepTitle || (
    currentStep === 1 ? t('step_scene') :
    currentStep === 2 ? t('step_outfit') :
    currentStep === 3 ? t('step_custom') :
    t('step_preview')
  );

  return (
    <div className={`sticky-stepper-container ${isScrolled ? 'sticky-stepper-container--collapsed' : ''}`}>
      {!isScrolled ? (
        <div className="stepper-expanded animate-fade-in">
          <div className="stepper-header-row">
            <span className="stepper-current-badge">
              {t('step_prefix')} {currentStep} {t('step_of')} 4 • {displayTitle}
            </span>
            <span className="stepper-percent">{current.percent}%</span>
          </div>

          <div className="stepper-bar-track">
            <motion.div
              className="stepper-bar-progress"
              initial={{ width: 0 }}
              animate={{ width: `${current.percent}%` }}
              transition={springs.liquid}
            />
          </div>

          <div className="stepper-steps-row">
            {steps.map((s) => (
              <span
                key={s.step}
                className={`step-label ${s.step === currentStep ? 'step-label--active' : ''}`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="stepper-collapsed-pill animate-fade-in">
          <div className="collapsed-info">
            <span>✨</span>
            <span>{t('step_prefix')} {currentStep}/4 · {displayTitle}</span>
          </div>
          <div className="collapsed-progress-ring">
            <div
              className="collapsed-progress-fill"
              style={{ width: `${current.percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
