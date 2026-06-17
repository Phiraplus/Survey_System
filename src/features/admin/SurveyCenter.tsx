import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SurveyManager } from './SurveyManager';
import { SurveyResults } from './SurveyResults';

export function SurveyCenter() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'config' | 'reports'>('reports');

  return (
    <div className="animate-fade-in" style={{ padding: 'var(--space-6) 0' }}>
      <div className="admin-page-header" style={{ marginBottom: 'var(--space-4)' }}>
        <div>
          <h2 className="admin-page-title">📋 {t('admin.nav.surveyCenter', 'Survey Center')}</h2>
          <p className="admin-page-subtitle">Manage evaluation questions and monitor attendee satisfaction reports.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 'var(--space-1)', marginBottom: 'var(--space-6)', display: 'inline-flex', gap: '4px', background: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => setActiveTab('reports')}
          className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 20px', fontSize: '13px' }}
        >
          📊 {t('admin.survey.tabReports', 'Satisfaction Reports')}
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`btn ${activeTab === 'config' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '8px 20px', fontSize: '13px' }}
        >
          ⚙️ {t('admin.survey.tabConfig', 'Configuration')}
        </button>
      </div>

      {activeTab === 'reports' ? <SurveyResults /> : <SurveyManager />}
    </div>
  );
}
