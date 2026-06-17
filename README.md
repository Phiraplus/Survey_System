# Standalone Satisfaction Survey System

A self-contained, high-performance, and beautifully polished **Satisfaction Survey & Feedback Management System** extracted from the FBINAA Asia Pacific Conference codebase. Built using **React**, **Vite**, **TypeScript**, and **Firebase** (Firestore & Auth), with qualitative feedback summaries powered by **Gemini AI**.

This project contains everything needed to run both the frontend survey questionnaire and the administrative configuration/reporting dashboard.

---

## 🌟 Key Features

*   **Premium Interactive Form**: Smooth animations, dynamic progress bars, and custom star rating sliders.
*   **Multilingual Support**: Realtime i18n support supporting multiple languages (defaulting to English and Thai).
*   **Survey Configuration Manager**: Drag-and-drop questions to reorder, add custom questions, or edit translations.
*   **Satisfaction Reports Dashboard**: Global score index charts, performance metric bars, and a delegate response explorer.
*   **Export to CSV**: Download complete survey results in raw CSV format with one click.
*   **Gemini AI Feedback Summary**: Summarize long attendee feedback qualitative text, highlight strengths/weaknesses, and generate actionable recommendations using AI.
*   **Dual Storage Engine (Firestore & LocalStorage)**: Works immediately out-of-the-box in mock mode without setting up Firebase, automatically persisting data in `localStorage`.

---

## 📁 Directory Structure

```
survey-standalone/
├── package.json              # App dependencies (Vite 8, React 19, Firebase client)
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite bundler config
├── index.html                # Main html entry
├── firestore.rules           # Secure rules for config/survey documents
├── firebase.json             # Firebase project configuration mapping rules
├── seed-survey.js            # Node script using Firebase Admin to seed questions
├── README.md                 # Setup & running guidelines
└── src/
    ├── main.tsx              # React app mount bootstrap
    ├── App.tsx               # Header, view layout, language selector
    ├── App.css               # Navigation bar & layout styling
    ├── index.css             # Main design tokens and colors
    ├── types/
    │   └── index.ts          # Type safety declarations
    ├── contexts/
    │   ├── AuthContext.tsx   # Tracks user authentication & handles mock mode
    │   └── ToastContext.tsx  # Dynamic floating alerts
    ├── lib/
    │   ├── firebase.ts       # Initializes Firebase Web Client
    │   ├── sanitizer.ts      # Strip HTML script tags to avoid XSS injections
    │   └── i18n.ts           # Bundles default translations
    ├── services/
    │   ├── surveyService.ts  # Fetches config & logs survey submissions
    │   └── geminiService.ts  # Runs qualitative analytics using Gemini API
    └── features/             # Component directories
        ├── General/          # Attendee survey questionnaire form
        └── admin/            # Administrator configuration & metrics
```

---

## 🚀 Getting Started

### 1. Installation
Install the project dependencies:
```cmd
npm install
```

### 2. Run Locally in Demo Mode (No Setup Required)
You can run and test the survey immediately. The application includes a top **Demo Controls** bar that lets you toggle mock profiles:
```cmd
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
*   Click **Mock: Attendee Form** to fill out the questionnaire.
*   Click **Mock: Admin Panel** to enter the reporting metrics, export CSV reports, customize questions, or run the AI feedback summarization.

---

## 🛡️ Configuring Live Firebase Services

To transition the application from Demo Mode to a live cloud database:

### 1. Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2.  Enable **Cloud Firestore** database. Choose **Start in production mode** and pick your location.
3.  Enable **Authentication**. Under **Sign-in method**, enable **Email/Password**.

### 2. Configure Environment Variables
1.  Register a **Web App** in your Firebase project.
2.  Copy your Web App Config credentials.
3.  Create a file named `.env` in the root of the `survey-standalone` folder (using `.env.example` as a template) and add your keys:
    ```env
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    VITE_FIREBASE_APP_ID=your-app-id
    ```

### 3. Deploy Security Rules
Use the [Firebase CLI](https://firebase.google.com/docs/cli) to deploy the database rules:
```cmd
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore
```
*(Alternatively, copy the contents of `firestore.rules` and paste them directly into the **Rules** tab of Cloud Firestore in the Firebase Console).*

### 4. Seed Default Questions (Firestore Admin SDK)
The system stores customizable survey questions in Firestore. To seed the default set:
1.  Go to **Firebase Console -> Project Settings -> Service Accounts**.
2.  Click **Generate new private key** to download the credentials JSON file.
3.  Place the downloaded JSON file in the root of the `survey-standalone` folder and rename it to **`service-account.json`**.
4.  Run the database seeding script:
    ```cmd
    npm run seed
    ```
5.  *(Optional)* Once completed, you can safely delete the `service-account.json` key to prevent accidental leakage.

### 5. Gemini AI Qualitative summaries
To enable the **Summarize with AI** feature:
1.  Deploy the official Firebase extension **"Multimodal Tasks with Gemini API"** (specifically named `ext-firestore-genai-generate`).
2.  Alternatively, update `src/services/geminiService.ts` to call a direct serverless function/backend connecting to your preferred LLM provider.

---

## 📝 Available Scripts

*   `npm run dev`: Starts the local development server at port 3000.
*   `npm run build`: Compiles TypeScript and packages the Vite production build.
*   `npm run preview`: Launches a local server to preview the built production bundle.
*   `npm run seed`: Executes the database seeding CLI using the Admin key.
