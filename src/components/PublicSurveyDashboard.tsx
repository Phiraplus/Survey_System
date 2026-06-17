import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SatisfactionSurvey } from '../features/General/SatisfactionSurvey';

/**
 * PublicSurveyDashboard acts as the primary wrapper for the public survey form.
 */
export function PublicSurveyDashboard() {
  const { i18n } = useTranslation();

  // Force language switch if needed or allow toggle
  useEffect(() => {
    // Default to browser locale detection (i18n handles this), 
    // but force English fallback if language is unsupported.
  }, [i18n]);

  return (
    <div className="container animate-fade-in" style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '900px' }}>
      <div style={{ background: 'transparent' }}>
        <SatisfactionSurvey isPublic={true} />
      </div>
    </div>
  );
}
