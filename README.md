# 📝 Satisfaction Survey System - Setup & Deployment Guide

A self-contained, high-performance, and beautifully polished **Satisfaction Survey & Feedback Management System**. Built using **React**, **Vite**, **TypeScript**, and **Firebase** (Firestore & Auth), with qualitative feedback summaries powered by **Gemini AI**.

This guide provides a step-by-step walkthrough for cloning the repository, installing dependencies, running in offline demo mode, connecting to a live Firebase cloud database, seeding initial questions, and deploying to hosting.

---

## 📁 Directory Structure
```text
survey-standalone/
├── package.json              # Dependency & scripts definition (Vite 8, React 19, Firebase)
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite bundler config
├── index.html                # Entry HTML file
├── firestore.rules           # Firestore security rules
├── firebase.json             # Firebase configuration mapping (includes Hosting & rewrites)
├── seed-survey.js            # Node script for database seeding using Firebase Admin SDK
├── README.md                 # This setup and deployment guide
└── src/
    ├── main.tsx              # React application entry point
    ├── App.tsx               # Header, views routing, language selectors
    ├── App.css               # Navigation bar & layout styles
    ├── index.css             # Main design tokens, colors, & typography rules
    ├── types/
    │   └── index.ts          # TypeScript domain type safety declarations
    ├── contexts/
    │   ├── AuthContext.tsx   # Authentications context supporting Firebase and LocalStorage fallbacks
    │   ├── ToastContext.tsx  # Dynamic floating system alerts (Toast Context)
    │   └── ConfigContext.tsx # Loads custom branding config & allowed languages dynamically
    ├── lib/
    │   ├── firebase.ts       # Initializes Web SDK Firebase client
    │   ├── sanitizer.ts      # Sanitizes input strings against XSS (Cross-Site Scripting)
    │   └── i18n.ts           # Configures i18next translations (EN, TH, ZH, ES, AR, RU, FR)
    ├── services/
    │   ├── surveyService.ts  # Handles survey submissions & config CRUD operations
    │   └── geminiService.ts  # Runs qualitative analytics using Gemini API
    └── features/
        ├── General/          # Attendee survey questionnaire form UI
        └── admin/            # Administrator settings and reports dashboard
```

---

## 🛠️ Step 1: Local Setup & Offline Demo Mode
This project is designed to **work immediately after cloning**, even before setting up a Firebase project. In this mode, all survey configurations and submissions are stored locally in the browser's `localStorage`.

### 1.1 Clone the Project
Open your Terminal or Command Prompt and run the following command to clone the code:
```cmd
git clone <YOUR_REPOSITORY_URL>
cd Survey_System
```

### 1.2 Install Dependencies
Install the required node modules:
```cmd
npm install
```

### 1.3 Start Local Development Server
Launch the development server:
```cmd
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

*   **Demo Controls Bar:** In the local development environment (when Firebase is not configured), you will see a top controls bar:
    *   Click **Mock: Attendee Form** to fill out and submit the questionnaire as an attendee.
    *   Click **Mock: Admin Panel** to review reports, export results, or test question configurations without password checks.

---

## 🛡️ Step 2: Connecting a Live Firebase Project
To transition from local mock storage to a live production database:

### 2.1 Create a Firebase Project
1.  Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2.  Set a name for your project (e.g., `my-survey-app`) and complete the creation steps.
3.  **Enable Cloud Firestore:**
    *   Click **Firestore Database** in the left sidebar.
    *   Click **Create Database**.
    *   Select **Start in production mode** -> pick your nearest cloud location (e.g., `asia-southeast1` for Southeast Asia) -> click Save/Done.
4.  **Enable Authentication:**
    *   Click **Authentication** in the left sidebar.
    *   Click **Get Started**.
    *   Under the **Sign-in method** tab, choose **Email/Password**.
    *   Toggle **Enable** and click **Save**.

### 2.2 Configure Local Environment Variables
1.  Register a **Web App** in your Firebase Project home dashboard by clicking the `< />` icon.
2.  Set an app nickname (e.g., `Survey Web App`) and click Register.
3.  Copy the credentials shown in the `firebaseConfig` object:
    ```javascript
    const firebaseConfig = {
      apiKey: "AIzaSy...",
      authDomain: "my-survey-app.firebaseapp.com",
      projectId: "my-survey-app",
      storageBucket: "my-survey-app.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:12345:web:abcd"
    };
    ```
4.  Create a file named **`.env`** in the root of the project folder (at the same level as `package.json`).
5.  Add your credentials to the `.env` file (you can copy `.env.example` as a template):
    ```env
    VITE_FIREBASE_API_KEY=AIzaSy...
    VITE_FIREBASE_AUTH_DOMAIN=my-survey-app.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=my-survey-app
    VITE_FIREBASE_STORAGE_BUCKET=my-survey-app.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
    VITE_FIREBASE_APP_ID=1:12345:web:abcd
    VITE_USE_EMULATORS=false
    ```

### 2.3 Deploy Firestore Security Rules
To restrict read/write access and protect configuration documents:
1.  Open the Firebase Console, navigate to **Firestore Database** -> **Rules** tab.
2.  Copy all the rules written in the `firestore.rules` file in your project.
3.  Paste them into the online console editor and click **Publish**.

---

## ⚡ Step 3: Seeding Default Questions (Database Seeding)
Since the survey renders questions dynamically fetched from the database, you must seed the initial set of questions into Firestore:

1.  In Firebase Console, click the gear icon next to **Project Overview** -> **Project Settings** -> **Service Accounts** tab.
2.  Select **Firebase Admin SDK** -> click **Generate new private key** button at the bottom.
3.  A `.json` credentials file will download.
4.  Move this file to the root of your project folder and rename it exactly to **`service-account.json`**.
5.  Open your terminal and run the database seeding command:
    ```cmd
    npm run seed
    ```
6.  Once you see the success message, the default questions are created on Firestore.
7.  ⚠️ **Security Warning:** You can now safely delete the `service-account.json` file to prevent exposing admin credentials.

---

## 🚀 Step 4: Accessing the Admin Portal & Configurations
For security and privacy, there are no login or register links displayed on the public landing page.

### 4.1 Hidden Admin Portal Route
*   Navigate to **`http://localhost:3000/admin`** in your browser (or `/admin` / `#/admin` on your production URL).
*   A premium, glassmorphic Admin Auth panel will appear.
*   **Registering the first admin account:**
    *   Click **Create Account**.
    *   Enter your First Name, Last Name, Email, and Password (minimum 6 characters), then click **Register**.
    *   The app creates the account on Firebase Authentication and populates a user document in Firestore with the `'admin'` role, granting access.

### 4.2 Customizing Branding, Headers & Languages
Once logged in, click the **Configuration** tab at the top and select the **⚙️ System Settings** menu to manage system variables:
1.  **Logo Customization:**
    *   Toggle logo visibility on/off.
    *   Change the logo emoji (e.g., 📝, 🎯, 🚔, 👮).
    *   Edit the brand name/logo text.
2.  **Headline Customization:**
    *   Toggle the secondary headline on/off.
    *   Edit the headline text shown in the header (e.g., "Satisfaction Evaluation").
3.  **Allowed Languages:**
    *   The system supports 7 languages (English, Thai, Chinese, Spanish, Arabic, Russian, French).
    *   Tick/untick languages to restrict which options attendees can select in the header bar dropdown.
    *   *Note:* If only one language is selected, the language switcher dropdown hides automatically.
4.  Click **Save Settings**. The configuration is saved to the database and propagates instantly to all visitors in real time.

---

## 📦 Step 5: Hosting Deployment
To deploy the application to live Firebase Hosting:

### 5.1 Initialize Firebase CLI
1.  If you do not have firebase-tools installed, install it globally:
    ```cmd
    npm install -g firebase-tools
    ```
2.  Login to your Firebase account in your terminal:
    ```cmd
    firebase login
    ```
3.  Link your local environment to your project:
    ```cmd
    firebase use --add
    ```
    (Select the Firebase project you created in step 2.1)

### 5.2 Build for Production
Run the build script to compile TypeScript and bundle the files into the `dist` directory:
```cmd
npm run build
```

### 5.3 Deploy to Hosting
Upload the static bundle to Firebase Hosting:
```cmd
firebase deploy --only hosting
```
Once completed, the CLI will output your live Hosting URL (e.g., `https://my-survey-app.web.app`).

---

## 📝 Available Scripts

*   `npm run dev`: Starts the local Vite development server at port 3000.
*   `npm run build`: Compiles TypeScript and builds the production bundle into `/dist`.
*   `npm run preview`: Locally previews the built production bundle.
*   `npm run seed`: Seeds the default survey questions to Firestore using `service-account.json`.
