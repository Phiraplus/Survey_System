import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { SurveyConfig } from '../types';
import { surveyService } from '../services/surveyService';

interface ConfigContextType {
  config: SurveyConfig | null;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  updateConfig: (newConfig: SurveyConfig) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SurveyConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshConfig = useCallback(async () => {
    try {
      const cfg = await surveyService.getSurveyConfig();
      setConfig(cfg);
    } catch (e) {
      console.error('Failed to load config:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (newConfig: SurveyConfig) => {
    await surveyService.updateSurveyConfig(newConfig);
    setConfig(newConfig);
  }, []);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  return (
    <ConfigContext.Provider value={{ config, loading, refreshConfig, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
