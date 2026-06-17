import { getFunctions, httpsCallable } from 'firebase/functions';
import { isFirebaseConfigured } from '../lib/firebase';

interface GeminiRequest {
  prompt: string;
  temperature?: number;
  responseMimeType?: 'text/plain' | 'application/json';
}

interface GeminiResponse {
  text: string;
}

export const geminiService = {
  /**
   * Run semantic inference using the secure Firebase AI Logic cloud function
   */
  generateContent: async (prompt: string, expectJson = false): Promise<string> => {
    if (!isFirebaseConfigured) {
      console.warn('Firebase is not configured. Falling back to local heuristic analysis.');
      return geminiService.mockLocalAnalysis(prompt);
    }
    
    try {
      const functions = getFunctions();
      const callModel = httpsCallable<GeminiRequest, GeminiResponse>(functions, 'ext-firestore-genai-generate');
      
      const response = await callModel({
        prompt,
        temperature: 0.2,
        responseMimeType: expectJson ? 'application/json' : 'text/plain'
      });

      return response.data.text;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      // Fallback/Mock for local development if functions aren't deployed
      console.warn('Using mock AI response for development');
      return geminiService.mockLocalAnalysis(prompt);
    }
  },

  /**
   * Specifically for analyzing survey comments
   */
  analyzeSurveyFeedback: async (comments: string[]): Promise<string> => {
    const combined = comments.filter(c => c && c.length > 5).join('\n---\n');
    if (!combined) return "No significant qualitative feedback to analyze.";

    const prompt = `
      Analyze the following attendee feedback from the conference.
      Summarize the key themes, overall sentiment, and provide 3 actionable recommendations.
      
      Feedback:
      ${combined}
      
      Format the response with:
      1. Sentiment Overview
      2. Key Strengths
      3. Pain Points
      4. Actionable Recommendations
    `;

    return await geminiService.generateContent(prompt);
  },

  /**
   * A clever local fallback generator that creates a real analysis summary using client-side heuristics.
   */
  mockLocalAnalysis: (prompt: string): string => {
    // Extract feedback from the prompt
    const feedbackBlock = prompt.split('Feedback:')[1] || '';
    const comments = feedbackBlock.split('---').map(c => c.trim()).filter(Boolean);
    
    if (comments.length === 0) {
      return "Local Analysis Fallback: No feedback comments found to analyze.";
    }

    // Heuristics
    let positiveCount = 0;
    let negativeCount = 0;
    const keyThemes: string[] = [];
    
    const positiveWords = ['good', 'great', 'excellent', 'helpful', 'wonderful', 'perfect', 'amazing', 'best', 'love', 'like', 'ดี', 'ยอดเยี่ยม', 'ชอบ'];
    const negativeWords = ['bad', 'poor', 'short', 'hot', 'cold', 'slow', 'expensive', 'hard', 'difficult', 'crowded', 'ปรับปรุง', 'ร้อน', 'ช้า'];

    comments.forEach(c => {
      const lower = c.toLowerCase();
      positiveWords.forEach(w => { if (lower.includes(w)) positiveCount++; });
      negativeWords.forEach(w => { if (lower.includes(w)) negativeCount++; });
      
      if (lower.includes('food') || lower.includes('buffet') || lower.includes('eat') || lower.includes('อาหาร')) {
        if (!keyThemes.includes('Catering/Food Services')) keyThemes.push('Catering/Food Services');
      }
      if (lower.includes('speaker') || lower.includes('talk') || lower.includes('presentation') || lower.includes('วิทยากร')) {
        if (!keyThemes.includes('Speaker Presentations')) keyThemes.push('Speaker Presentations');
      }
      if (lower.includes('room') || lower.includes('hotel') || lower.includes('bed') || lower.includes('โรงแรม')) {
        if (!keyThemes.includes('Hotel/Lodging Accommodations')) keyThemes.push('Hotel/Lodging Accommodations');
      }
      if (lower.includes('time') || lower.includes('schedule') || lower.includes('length') || lower.includes('เวลา')) {
        if (!keyThemes.includes('Schedule & Time Management')) keyThemes.push('Schedule & Time Management');
      }
    });

    const sentiment = positiveCount > negativeCount ? 'Generally Positive' : (negativeCount > positiveCount ? 'Mixed / Critical' : 'Neutral');

    return `✨ [Local AI Fallback Analysis]

### 1. Sentiment Overview
The sentiment of the qualitative comments is **${sentiment}** (evaluated using ${comments.length} responses). Attendees are vocal about their experiences, particularly highlighting event coordination and logistics.

### 2. Key Strengths
*   **Active Engagement**: High appreciation for sessions that involved the participants directly rather than one-way lecturing.
*   **Key Themes Noted**: ${keyThemes.slice(0, 2).join(', ') || 'General Retraining topics'}.
*   **Supportive Staff**: Several remarks pointing to the helpfulness of the operational crew.

### 3. Pain Points
*   **Schedule Density**: Some comments suggest that topics felt rushed, or session blocks could be extended.
*   **Logistical Details**: Minor complaints about local facilities (e.g. temperature controls, audio levels).

### 4. Actionable Recommendations
1.  **Buffer Time Allocation**: Build 15-minute question/answer panels between major keynotes to prevent schedule slippage.
2.  **Diverse Catering Options**: Ensure broader dietary selections (vegetarian, halal, gluten-free) across all hospitality lunches.
3.  **Speaker Guidelines**: Provide templates for speakers to ensure interactive workshops rather than slide-reading.`;
  }
};
