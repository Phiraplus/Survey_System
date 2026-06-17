import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConfigProvider } from './contexts/ConfigContext';
import App from './App';
import './index.css';
import './lib/i18n';
import 'flag-icons/css/flag-icons.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <ConfigProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </ToastProvider>
  </React.StrictMode>
);
