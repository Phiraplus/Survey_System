# 📝 Premium Satisfaction Survey System - Setup & Deployment Guide

A fully customizable, highly responsive, and beautifully designed **Satisfaction Survey & Feedback Management System**. Built with **React 19**, **Vite 8**, **TypeScript**, and styled with **Vanilla CSS** following glassmorphic and modern UI design languages. Qualitative feedback is summarized automatically using the **Gemini AI API**.

This project features a **modular database & authentication adapter layer**, enabling you to switch backends seamlessly (between LocalStorage, Firebase Firestore, and Supabase/PostgreSQL) by changing a single environment variable.

---

## 🚀 Quick Start (Zero-Configuration Offline Mode)

This project works out-of-the-box using the browser's `LocalStorage` for state storage, allowing you to run, test, and demonstrate the survey features immediately without setting up external servers or databases.

### 1. Clone the Repository
Open your Terminal or Command Prompt and clone the repository:
```cmd
git clone <YOUR_REPOSITORY_URL>
cd Survey_System
```

### 2. Install Dependencies
Run the install command to get all required Node packages:
```cmd
npm install
```

### 3. Launch Development Server
Start the local Vite dev server:
```cmd
npm run dev
```
* The application will run at **http://localhost:3000** (or another port outputted by Vite).
* **Standalone Demo Controls:** In development mode with `VITE_DATABASE_TYPE=local`, a top-bar control menu will be visible allowing you to click and log in instantly as an Attendee or an Admin to preview and test pages without password checks.

---

## ⚙️ Switch Database & Authentication Backends

You can connect the application to a live database by setting the `VITE_DATABASE_TYPE` environment variable inside your `.env` file (copied from `.env.example`).

Create a file named **`.env`** in the root of the project:
```env
# Options: local | firestore | supabase
VITE_DATABASE_TYPE=local
```

---

## 📦 Option A: Setup Supabase (PostgreSQL) Backend

Supabase is the recommended database for instant, SQL-compliant hosting.

### Step 1: Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a free account.
2. Create a new project (e.g. `Satisfaction Survey System`).
3. Set your project password and choose your regional cluster database host.

### Step 2: Initialize Database Schema & Seeds
1. In your Supabase Dashboard, click **SQL Editor** on the left navigation panel.
2. Click **New query**.
3. Open the file [schema.sql](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/schema.sql) in your local project workspace.
4. Copy the entire content of [schema.sql](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/schema.sql) and paste it into the Supabase SQL editor.
5. Click **Run** at the bottom right.
   * This SQL query creates the `system_config`, `users`, and `surveys` tables.
   * It configures **Row-Level Security (RLS)** policies to safeguard your database.
   * It seeds default survey questions and sets the admin registration passcode to `SurveyAdmin2026`.

### Step 3: Configure Environment Variables
1. In the Supabase Dashboard, click **Project Settings** (gear icon) -> **API**.
2. Copy the **Project URL** and the **Anon Public API Key** (`anon` `public`).
3. Open your local `.env` file and set the variables:
   ```env
   VITE_DATABASE_TYPE=supabase
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Save the file and restart your local dev server (`npm run dev`). The top demo control bar will hide, and the system is now securely integrated with Supabase Auth & PostgreSQL.

---

## 🔥 Option B: Setup Firebase Firestore Backend

Firebase is a fully integrated backend as a service from Google.

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Set a name for your project (e.g., `survey-system`) and complete project setup.
3. Enable **Cloud Firestore**:
   * Navigate to **Firestore Database** on the left menu.
   * Click **Create Database**.
   * Choose **Start in production mode** -> Select your database location -> Click **Done**.
4. Enable **Authentication**:
   * Navigate to **Authentication** on the left menu.
   * Click **Get Started**.
   * Under the **Sign-in method** tab, choose **Email/Password**.
   * Enable the toggle and click **Save**.

### Step 2: Configure Environment Variables
1. Register a **Web App** in the Firebase console homepage by clicking the `< />` icon.
2. Copy the credentials shown in the `firebaseConfig` block.
3. Open your local `.env` file and configure it:
   ```env
   VITE_DATABASE_TYPE=firestore
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_USE_EMULATORS=false
   ```

### Step 3: Deploy Firestore Security Rules
1. Copy the contents of your local `firestore.rules` file.
2. In the Firebase Console, go to **Firestore Database** -> **Rules** tab.
3. Replace the text in the rules editor with your copied rules and click **Publish**.

### Step 4: Seed Default Survey Questions
1. In Firebase Console, click the gear icon next to **Project Overview** -> **Project Settings** -> **Service Accounts**.
2. Select **Firebase Admin SDK** -> click **Generate new private key**.
3. Move the downloaded `.json` credentials file to the root of your project folder and rename it exactly to **`service-account.json`**.
4. Seed your database by running:
   ```cmd
   npm run seed
   ```
5. Once completed, you can safely **delete** `service-account.json` from your local machine.

---

## 🔒 Accessing the Admin Dashboard

To protect dashboard functions, access buttons are not shown on the landing page.

1. Navigate to **`http://localhost:3000/admin`** (or your production URL with `/admin`).
2. To sign up the first administrator:
   * Click **Create Account**.
   * Enter your name, admin email, password, and the **Admin Passcode** (the default seeded value is `SurveyAdmin2026`).
   * Click **Register**. The backend validates the passcode and updates the user profile to the admin role.
3. Click **System Settings** in the dashboard to dynamically change the admin passcode, branding logo, headers, or limit allowed languages.

---

## 🛠️ Verification & Production Build

To verify your project builds successfully for production release:

1. Build the assets bundle:
   ```cmd
   npm run build
   ```
   This compiles TypeScript and outputs production assets into the `/dist` directory.

2. Preview the built website locally:
   ```cmd
   npm run preview
   ```
   Open the port indicated (default `http://localhost:4173`) to confirm the site behaves correctly.

---

## 📁 Key File Overview

* **[App.tsx](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/src/App.tsx)**: Main header, view router, and multilingual translations controller.
* **[types.ts](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/src/services/db/types.ts)**: Interfaces defining the database and authentication abstraction adapters.
* **[MockAdapter.ts](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/src/services/db/MockAdapter.ts)**: LocalStorage database & auth adapter.
* **[SupabaseAdapter.ts](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/src/services/db/SupabaseAdapter.ts)**: Supabase & PostgreSQL database & auth adapter.
* **[FirestoreAdapter.ts](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/src/services/db/FirestoreAdapter.ts)**: Firebase Firestore database & auth adapter.
* **[schema.sql](file:///c:/Users/MIMIR/Desktop/Dev_Project/Survey_System/schema.sql)**: PostgreSQL initialization queries and data seeding script.
