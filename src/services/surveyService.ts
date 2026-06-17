import { dbAdapter } from './db';
import type { SurveyConfig, SurveyResponse } from '../types';

export const DEFAULT_TEXT_QUESTIONS = [
  { id: 'comments', group: 'Comments', label: { en: 'Overall Experience', th: 'ความคิดเห็นและภาพรวม' }, emoji: '💬', order: 1 },
  { id: 'suggestions', group: 'Comments', label: { en: 'Specific Suggestions', th: 'ข้อเสนอแนะเฉพาะเจาะจง' }, emoji: '💡', order: 2 },
  { id: 'mostInterestingSession', group: 'Comments', label: { en: 'Most Interesting Session/Speaker', th: 'หัวข้อ/วิทยากรที่น่าสนใจที่สุด' }, emoji: '🎤', order: 3 },
  { id: 'improvementAreas', group: 'Comments', label: { en: 'Areas for Improvement', th: 'สิ่งที่ควรปรับปรุง' }, emoji: '🛠️', order: 4 },
  { id: 'futureTopics', group: 'Comments', label: { en: 'Future Topics', th: 'หัวข้อที่สนใจในอนาคต' }, emoji: '🔮', order: 5 }
];

export const getTextAnswer = (survey: SurveyResponse | null | undefined, id: string): string => {
  if (!survey) return '';
  if (survey.textAnswers && survey.textAnswers[id] !== undefined) {
    return survey.textAnswers[id];
  }
  // Fallback to legacy fields
  if (id === 'comments') return survey.comments || '';
  if (id === 'suggestions') return survey.suggestions || '';
  if (id === 'mostInterestingSession') return survey.mostInterestingSession || '';
  if (id === 'improvementAreas') return survey.improvementAreas || '';
  if (id === 'futureTopics') return survey.futureTopics || '';
  return '';
};

export const surveyService = {
  getSurveyConfig: async (): Promise<SurveyConfig | null> => {
    return dbAdapter.getSurveyConfig();
  },

  updateSurveyConfig: async (config: SurveyConfig): Promise<void> => {
    await dbAdapter.updateSurveyConfig(config);
  },

  getUserSurvey: async (uid: string): Promise<SurveyResponse | null> => {
    return dbAdapter.getUserSurvey(uid);
  },

  submitSurvey: async (survey: SurveyResponse): Promise<void> => {
    await dbAdapter.submitSurvey(survey);
  },

  deleteSurvey: async (uid: string): Promise<void> => {
    await dbAdapter.deleteSurvey(uid);
  },

  getAllSurveys: async (): Promise<SurveyResponse[]> => {
    return dbAdapter.getAllSurveys();
  }
};
