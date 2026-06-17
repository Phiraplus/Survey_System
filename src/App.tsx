import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './contexts/AuthContext';
import { PublicSurveyDashboard } from './components/PublicSurveyDashboard';
import { SurveyCenter } from './features/admin/SurveyCenter';
import { supportedLanguages, languageNames } from './lib/i18n';
import './App.css';

function App() {
  const { i18n } = useTranslation();
  const { isAdmin, enableDemoMode, disableDemoMode, isDemoMode } = useAuth();
  const [currentView, setCurrentView] = useState<'survey' | 'admin'>('survey');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLangDropdownOpen(false);
  };

  const currentLang = i18n.language?.substring(0, 2) || 'en';

  return (
    <div className="app-layout">
      {/* Demo Mode Controller Bar */}
      <div className="demo-bar">
        <span>⚙️ Standalone Demo Controls:</span>
        <button className="demo-btn" onClick={() => enableDemoMode('attendee')}>
          Mock: Attendee Form
        </button>
        <button className="demo-btn" onClick={() => enableDemoMode('admin')}>
          Mock: Admin Panel
        </button>
        {isDemoMode && (
          <button 
            className="demo-btn" 
            style={{ backgroundColor: '#dc2626' }} 
            onClick={disableDemoMode}
          >
            Reset (Use Firebase)
          </button>
        )}
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <span>📝</span>
            <span>Survey System</span>
          </div>

          <nav className="nav-links">
            <button 
              className={`nav-btn ${currentView === 'survey' ? 'active' : ''}`}
              onClick={() => setCurrentView('survey')}
            >
              📋 Survey Form
            </button>
            <button 
              className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentView('admin')}
            >
              📊 Admin Dashboard
            </button>

            {/* Language Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                className="nav-btn" 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                🌐 {languageNames[currentLang]?.name || 'English'}
              </button>
              {langDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  marginTop: '8px',
                  minWidth: '150px',
                  overflow: 'hidden'
                }}>
                  {supportedLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 16px',
                        textAlign: 'left',
                        background: currentLang === lang ? 'var(--bg-tertiary)' : 'transparent',
                        color: 'var(--text-primary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: currentLang === lang ? 'bold' : 'normal'
                      }}
                    >
                      {languageNames[lang].nativeName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="container animate-fade-in" style={{ padding: 'var(--space-6) var(--space-4)' }}>
        {currentView === 'survey' ? (
          <PublicSurveyDashboard />
        ) : (
          <>
            {isAdmin ? (
              <SurveyCenter />
            ) : (
              <div className="card" style={{
                textAlign: 'center',
                padding: 'var(--space-12)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-4)',
                maxWidth: '500px',
                margin: '10vh auto'
              }}>
                <div style={{ fontSize: '4rem' }}>🔒</div>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Admin Access Restricted</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  You must be logged in as an administrator to access the survey dashboard metrics.
                </p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  💡 Tip: Click the <strong>"Mock: Admin Panel"</strong> button in the top bar to inspect this dashboard immediately.
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: 'var(--space-8) 0',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-tertiary)',
        fontSize: 'var(--text-xs)'
      }}>
        <div>&copy; {new Date().getFullYear()} Standalone Survey Module. Built with React & Firebase.</div>
      </footer>
    </div>
  );
}

export default App;
