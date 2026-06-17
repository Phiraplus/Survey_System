import type { SurveyConfig, SurveyResponse } from '../../types';

export interface UserSession {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'attendee' | 'superadmin';
}

export interface DatabaseAdapter {
  getSurveyConfig(): Promise<SurveyConfig | null>;
  updateSurveyConfig(config: SurveyConfig): Promise<void>;
  submitSurvey(response: SurveyResponse): Promise<void>;
  getUserSurvey(uid: string): Promise<SurveyResponse | null>;
  getAllSurveys(): Promise<SurveyResponse[]>;
  deleteSurvey(uid: string): Promise<void>;
  isConfigured(): boolean;
}

export interface AuthAdapter {
  login(email: string, password: string): Promise<UserSession>;
  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    passcode: string
  ): Promise<UserSession>;
  logout(): Promise<void>;
  onAuthStateChanged(callback: (user: UserSession | null) => void): () => void;
}
