# 📝 Polished Satisfaction Survey System - Setup & Deployment Guide

This repository contains a self-contained, high-performance, and beautifully polished **Satisfaction Survey & Feedback Management System**. The application is built using **React 19**, **Vite 8**, **TypeScript**, and styled using custom **Vanilla CSS** with rich aesthetics like glassmorphism and subtle micro-animations. Qualitative feedback is summarized automatically using the **Gemini AI API**.

To support quick setups and simple deployments, this system features a **modular database & authentication adapter layer**. You can toggle the backend storage by modifying a single environment variable (`VITE_DATABASE_TYPE`) to run on:
1. **Offline Local Storage Mode** (zero-configuration, instant browser-only simulation)
2. **Google Cloud Firestore & Firebase Auth**
3. **Supabase PostgreSQL & Supabase Auth**

---

## 📋 Table of Contents
1. [🛠️ Part 1: Quick Start & Local Offline Sandbox](#part-1-quick-start--local-offline-sandbox)
2. [🔥 Part 2: Step-by-Step Firebase Backend Integration](#part-2-step-by-step-firebase-backend-integration)
3. [⚡ Part 3: Step-by-Step Supabase Backend Integration](#part-3-step-by-step-supabase-backend-integration)
4. [🚀 Part 4: Building & Deploying to Live Web Hosting](#part-4-building--deploying-to-live-web-hosting)
5. [🔒 Part 5: Accessing the Admin Console & Customization](#part-5-accessing-the-admin-console--customization)
6. [💡 Part 6: Troubleshooting & Common Pitfalls](#part-6-troubleshooting--common-pitfalls)

---

## 🛠️ Part 1: Quick Start & Local Offline Sandbox

You can clone this repository and run the survey system locally in **less than 2 minutes** without setting up databases or cloud hosting.

### 1.1 Clone the Repository
Open your terminal (Command Prompt, PowerShell, or Bash) and execute:
```cmd
git clone <YOUR_REPOSITORY_URL>
cd Survey_System
```

### 1.2 Install Node Modules
Install all standard dependencies required for compiling the project:
```cmd
npm install
```

### 1.3 Start the Development Server
Launch Vite's hot-reloading development server:
```cmd
npm run dev
```
Once the process starts, you will see output in the terminal:
```text
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```
Hold `Ctrl` and click the link **http://localhost:3000** to open the site in your browser.

* **⚙️ Standalone Demo Controls Bar**: In development mode with `VITE_DATABASE_TYPE=local`, a utility bar appears at the top. 
  * Click **Mock: Attendee Form** to fill and submit survey answers as a participant.
  * Click **Mock: Admin Panel** to bypass passwords and test configurations, customize logo emoji/text, toggle language restrictions, or export data.

---

## 🔥 Part 2: Step-by-Step Firebase Backend Integration

To connect the application to a live Firebase backend:

### 2.1 Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** (or **Create a project**).
3. Enter a project name (e.g., `survey-system-prod`), accept terms, and click **Continue**.
4. Disable or enable Google Analytics according to your preference, then click **Create Project**.
5. Once ready, click **Continue** to load your project home dashboard.

### 2.2 Enable Firebase Email/Password Auth
1. On the left sidebar menu, click **Build** -> **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password** under "Native providers".
4. Enable the first toggle (**Email/Password**) and click **Save**.

### 2.3 Create a Cloud Firestore Database
1. On the left sidebar menu, click **Build** -> **Firestore Database**.
2. Click **Create Database**.
3. Select **Start in production mode** (this locks down read/writes by default) and click **Next**.
4. Choose your database location (e.g., `asia-southeast1` for Thailand/SE Asia, or `us-central1` for USA) and click **Create**.
5. Go to the **Rules** tab at the top of your Firestore Database page.
6. Open your local project folder and copy the entire text within the [firestore.rules](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/firestore.rules) file.
7. Paste these rules into the Firebase console rules editor, replacing what is currently there, and click **Publish**.

### 2.4 Register the Web Application Credentials
1. Navigate back to the **Project Overview** (home icon at top-left).
2. Click the Web icon (**`</>`**) under the project name.
3. Enter an App nickname (e.g., `Survey Web App`) and click **Register app**.
4. Copy the keys inside the `firebaseConfig` block. You will need these for your environment configuration.
5. Create a file named **`.env`** in the root directory of your project folder (same folder as `package.json`).
6. Copy the structure from [.env.example](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/.env.example) and insert your keys:
   ```env
   VITE_DATABASE_TYPE=firestore
   VITE_FIREBASE_API_KEY=AIzaSyA1...
   VITE_FIREBASE_AUTH_DOMAIN=survey-system-prod.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=survey-system-prod
   VITE_FIREBASE_STORAGE_BUCKET=survey-system-prod.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:12345:web:abcd
   VITE_USE_EMULATORS=false
   ```

### 2.5 Seed Initial Survey Questions in Firestore
Because the survey dynamically pulls questions from the database, you must seed the initial question documents.
1. Click the Gear icon (**Project Settings**) in the left sidebar next to "Project Overview".
2. Go to the **Service Accounts** tab.
3. Click **Generate new private key** (ensure "Node.js" is selected).
4. Click **Generate key** in the modal. A `.json` file containing admin credentials will download.
5. Move this downloaded file to the root of your local project folder and rename it exactly to: **`service-account.json`**.
6. In your command prompt, run:
   ```cmd
   npm run seed
   ```
7. Once you see the success message `Seeding completed successfully!`, you can **delete** the `service-account.json` file from your computer for safety.

---

## ⚡ Part 3: Step-by-Step Supabase Backend Integration

To run the system using Supabase (PostgreSQL + Supabase Auth) as an alternative:

### 3.1 Create a Supabase Project
1. Go to the [Supabase Dashboard](https://supabase.com/).
2. Click **New Project** and select your organization.
3. Name your project (e.g. `Survey System`), assign a secure Database Password, choose a server region close to your target users, and click **Create new project**.

### 3.2 Initialize the SQL Schema & Triggers
1. Once your project spins up, click the **SQL Editor** icon (the double greater-than symbol `>_`) on the left sidebar.
2. Click **New query** (or **Blank query**).
3. Open [schema.sql](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/schema.sql) in your local workspace.
4. Copy the entire file content and paste it into the Supabase SQL editor.
5. Click the **Run** button (or press `Cmd/Ctrl + Enter`).
   * This SQL query defines tables (`system_config`, `users`, `surveys`).
   * It creates security triggers that block privilege escalation by verifying the registration passcode before writing roles.
   * It configures **Row-Level Security (RLS)** policies.
   * It seeds initial questionnaire data and sets the default admin registration passcode to `SurveyAdmin2026`.

### 3.3 Configure Environment Variables
1. Click the **Project Settings** (gear icon) on the left sidebar -> go to the **API** tab.
2. Under "Project API keys", copy your **Project URL** and the **Anon Public API Key** (`anon` `public`).
3. Open your local `.env` file in the project folder root and update it:
   ```env
   VITE_DATABASE_TYPE=supabase
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Save the file and restart your local dev server (`npm run dev`). The standalone controls will be hidden, and the database operations will connect directly to Supabase.

---

## 🚀 Part 4: Building & Deploying to Live Web Hosting

Once configured locally, follow these steps to build and host your web application live on **Firebase Hosting** (which is free and supports instant HTTPS distribution).

### 4.1 Install the Firebase CLI
If you do not have the Firebase CLI tools installed on your computer, run:
```cmd
npm install -g firebase-tools
```

### 4.2 Log in to Firebase
Link your terminal to your Google / Firebase account:
```cmd
firebase login
```
* This will open a browser window. Allow access and return to your command prompt.

### 4.3 Link Your Local Directory to Your Firebase Project
Initialize project bindings by running:
```cmd
firebase use --add
```
* Select the Firebase project you created in **Step 2.1** from the list using the arrow keys, then hit Enter.
* Assign an alias (e.g. `production` or `default`) when prompted and hit Enter.

### 4.4 Compile Assets for Production
Compile TypeScript and bundle code into efficient, minified static files:
```cmd
npm run build
```
This generates a production folder named `/dist` containing all minified JS, CSS, and asset files.

### 4.5 Deploy to Live Hosting
Upload your `/dist` folder directly to Firebase Hosting:
```cmd
firebase deploy --only hosting
```
Once the upload finishes, the terminal will output your live Web URL:
```text
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/survey-system-prod/overview
Hosting URL: https://survey-system-prod.web.app
```
Open the Hosting URL link in any browser to see your live, secure, and production-ready application.

---

## 🔒 Part 5: Accessing the Admin Console & Customization

To prevent unauthorized registrations and keep the interface clean, there are **no visible login or register buttons** on the public landing page.

### 5.1 Accessing the Hidden Admin URL
1. Go to your browser and append `/admin` to your website URL:
   * **Local**: `http://localhost:3000/admin`
   * **Production**: `https://your-project-id.web.app/admin` (or if hash routing: `https://your-project-id.web.app/#/admin`)
2. Click **Create Account** to register the first administrator account:
   * Fill in your Name, Email, and Password.
   * Provide the **Admin Passcode** (the default value seeded in your database is `SurveyAdmin2026`).
   * Click **Register**. The backend validates the code and promotes your account to the Admin role.

### 5.2 Dynamic Customizations (System Settings)
Once logged in, navigate to **Configuration** -> **⚙️ System Settings** to customize parameters in real time without writing code:
1. **Logo Customization**:
   * Show or hide the logo.
   * Change the emoji character.
   * Change the brand text.
2. **Title Settings**:
   * Show or hide the main header headline.
   * Customize the header text.
3. **Allowed Languages**:
   * Restrict which translation modes are available to attendees by ticking/unticking options (English, Thai, Chinese, Spanish, Arabic, Russian, French).
   * If only one language is ticked, the language selector dropdown in the header will hide automatically.
4. Click **Save Settings** to persist your configurations immediately.

---

## 💡 Part 6: Troubleshooting & Common Pitfalls

* **Vite Port Collisions**:
  * If port 3000 is taken, Vite may serve on port 3001 or 5173. Double check the terminal printouts when starting `npm run dev`.
* **Registration Fails with "Invalid Admin Registration Passcode"**:
  * **Firestore**: Confirm you uploaded the `admin_passcode` config document into Firestore. Double check that `firestore.rules` has been published.
  * **Supabase**: Verify you ran `schema.sql` completely, which seeds the passcode into the `system_config` table.
* **CORS and Authorized Domains**:
  * If Auth fails in production, ensure your hosting domain (e.g. `your-project-id.web.app`) is added to the "Authorized domains" list under **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized domains**.
