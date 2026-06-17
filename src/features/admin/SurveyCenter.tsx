import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SurveyManager } from './SurveyManager';
import { SurveyResults } from './SurveyResults';

export function SurveyCenter() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'config' | 'reports'>('reports');

  return (
    <div className="survey-center-container animate-fade-in">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">📋 {t('admin.nav.surveyCenter', 'Survey Center')}</h2>
          <p className="admin-page-subtitle">Manage evaluation questions and monitor attendee satisfaction reports.</p>
        </div>
      </div>

      <div className="admin-tab-container">
        <button
          onClick={() => setActiveTab('reports')}
          className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-ghost'} admin-tab-btn`}
        >
          📊 {t('admin.survey.tabReports', 'Satisfaction Reports')}
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`btn ${activeTab === 'config' ? 'btn-primary' : 'btn-ghost'} admin-tab-btn`}
        >
          ⚙️ {t('admin.survey.tabConfig', 'Configuration')}
        </button>
      </div>

      {activeTab === 'reports' ? <SurveyResults /> : <SurveyManager />}
    </div>
  );
}
