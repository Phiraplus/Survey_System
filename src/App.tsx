import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './contexts/AuthContext';
import { useConfig } from './contexts/ConfigContext';
import { PublicSurveyDashboard } from './components/PublicSurveyDashboard';
import { SurveyCenter } from './features/admin/SurveyCenter';
import { AdminAuth } from './features/admin/AdminAuth';
import { supportedLanguages, languageNames } from './lib/i18n';
import './App.css';

function App() {
  const { i18n } = useTranslation();
  const { isAdmin, enableDemoMode, disableDemoMode, isDemoMode, user, logout } = useAuth();
  const { config } = useConfig();
  
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.hash);

  // Monitor location changes for simple routing
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isAdminView = currentPath === '/admin' || currentPath.endsWith('/admin') || currentPath.includes('#/admin');

  // Dynamic config options
  const showLogo = config?.showLogo !== false;
  const logoEmoji = config?.logoEmoji ?? '📝';
  const logoText = config?.logoText ?? 'Survey System';
  const showHeaderTitle = config?.showHeaderTitle !== false;
  const headerTitle = config?.headerTitle ?? 'Satisfaction Evaluation';

  const currentLang = i18n.language?.substring(0, 2) || 'en';
  const allowedLanguages = config?.allowedLanguages && config.allowedLanguages.length > 0
    ? config.allowedLanguages
    : supportedLanguages;

  // Sync language selection with allowedLanguages checklist
  useEffect(() => {
    if (config?.allowedLanguages && config.allowedLanguages.length > 0) {
      if (!config.allowedLanguages.includes(currentLang)) {
        const fallback = config.allowedLanguages.includes('en') ? 'en' : config.allowedLanguages[0];
        i18n.changeLanguage(fallback);
      }
    }
  }, [config, currentLang, i18n]);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLangDropdownOpen(false);
  };

  // Only show demo controls bar in Dev environment when running with LocalStorage mode
  const showDemoBar = import.meta.env.DEV && (import.meta.env.VITE_DATABASE_TYPE || 'local') === 'local';

  return (
    <div className="app-layout">
      {/* Demo Mode Controller Bar (Dev fallback only) */}
      {showDemoBar && (
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
              Reset Session
            </button>
          )}
        </div>
      )}

      {/* Main Header */}
      <header className="header">
        <div className="container header-container">
          
          {/* Logo and Header title */}
          {(showLogo || showHeaderTitle) && (
            <div className="logo logo-container" onClick={() => { window.location.href = '/'; }}>
              {showLogo && <span>{logoEmoji}</span>}
              {showLogo && <span style={{ fontWeight: 800 }}>{logoText}</span>}
              {showLogo && showHeaderTitle && <span className="logo-title-divider">|</span>}
              {showHeaderTitle && (
                <span className="header-subtitle">
                  {headerTitle}
                </span>
              )}
            </div>
          )}

          <nav className="nav-links">
            
            {/* If admin is logged in, show logout button and admin credentials */}
            {isAdmin && user && (
              <div className="admin-user-info">
                <span className="admin-user-email">
                  👤 {user.email}
                </span>
                <button 
                  className="btn btn-sm btn-ghost admin-logout-btn" 
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}

            {/* Language Selector Dropdown (Hidden if only 1 language allowed) */}
            {allowedLanguages.length > 1 && (
              <div className="lang-selector-wrapper">
                <button 
                  className="nav-btn lang-toggle-btn" 
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                >
                  🌐 {languageNames[currentLang]?.name || 'English'}
                </button>
                {langDropdownOpen && (
                  <div className="lang-dropdown-menu">
                    {allowedLanguages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`lang-dropdown-item ${currentLang === lang ? 'active' : ''}`}
                      >
                        {languageNames[lang].nativeName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="container animate-fade-in" style={{ padding: 'var(--space-6) var(--space-4)' }}>
        {isAdminView ? (
          isAdmin ? (
            <SurveyCenter />
          ) : (
            <AdminAuth />
          )
        ) : (
          <PublicSurveyDashboard />
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
