export type UserRole = 'attendee' | 'admin' | 'superadmin';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string; // ISO Code
  role: UserRole;
}

export interface LocalizedString {
  en: string;
  zh?: string;
  es?: string;
  ar?: string;
  ru?: string;
  fr?: string;
  th?: string;
  [key: string]: string | undefined;
}

export type SupportedLanguage = 'en' | 'zh' | 'es' | 'ar' | 'ru' | 'fr' | 'th';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export interface SurveyQuestion {
  id: string;
  label: LocalizedString;
  emoji: string;
  group: string;
  order: number;
}

export interface SurveyConfig {
  questions: SurveyQuestion[];
  textQuestions?: SurveyQuestion[];
  logoEmoji?: string;
  logoText?: string;
  showLogo?: boolean;
  headerTitle?: string;
  showHeaderTitle?: boolean;
  allowedLanguages?: string[];
  updatedAt: Date;
}

export interface SurveyResponse {
  uid: string;
  name: string;
  email: string;
  country: string;
  ratings: Record<string, number>;
  comments: string;
  suggestions?: string;
  mostInterestingSession?: string;
  improvementAreas?: string;
  futureTopics?: string;
  textAnswers?: Record<string, string>;
  submittedAt: Date;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
