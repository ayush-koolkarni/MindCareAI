# Elevana AI Setup & Installation Guide

This guide will walk you through setting up the frontend and backend dependencies for **Elevana AI** (AI-based Dynamic Mental Health Monitoring and Distress Prediction System for Victims of Atrocities) from scratch.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
1. **Node.js** (v18.0.0 or higher recommended) – [Download Node.js](https://nodejs.org/)
2. **Python** (v3.10.0 or higher recommended) – [Download Python](https://www.python.org/)
3. **For Native Development Builds (Running on Emulator/Device):**
   * **Android:** 
     * Android Studio & Android SDK installed.
     * JDK (Java Development Kit, v17 recommended) installed.
     * `ANDROID_HOME` environment variable configured.
   * **iOS (macOS only):**
     * Xcode installed.
     * CocoaPods installed (`sudo gem install cocoapods` or via Homebrew).

---

## 🛠️ Step-by-Step Installation

### Step 1: Open Directory
Open your terminal (or Command Prompt / PowerShell on Windows) and navigate to the project directory:
```bash
cd /path/to/ElevanaAI
```

---

### Step 2: Set Up Environment Variables (`.env`)
The app utilizes the Gemini API for multi-lingual conversational AI and trauma support.
1. Create or edit `.env` in the root of the project directory.
2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```
   *Note: If you don't have a Gemini API key, you can get one for free from [Google AI Studio](https://aistudio.google.com/).*

---

### Step 3: Set Up Python Virtual Environment (`venv`)

1. **Create the virtual environment:**
   * **macOS / Linux:**
     ```bash
     python3 -m venv venv
     ```
   * **Windows:**
     ```cmd
     python -m venv venv
     ```

2. **Activate the virtual environment:**
   * **macOS / Linux:**
     ```bash
     source venv/bin/activate
     ```
   * **Windows (Command Prompt):**
     ```cmd
     venv\Scripts\activate
     ```

3. **Install dependencies:**
   ```bash
   pip install flask flask-cors requests
   ```
   *(For full RoBERTa emotion ML models: `pip install torch transformers`)*

---

### Step 4: Install Frontend Node Modules
```bash
npm install
```

---

## 🚀 Running the Application for Demo

### 1. Run the Privacy & Anonymization Service (Backend - Port 5001)
```bash
python offline_privacy.py
```
*(Or `python privacy_service.py` for RoBERTa transformer pipeline)*

### 2. Run the Email, FIR Dispatch & Counselor Service (Port 5000)
```bash
python email_service.py
```

### 3. Run the National/District Analytics Dashboard (Port 5002)
```bash
python dashboard_demo.py
```
View live dashboard: [http://localhost:5002/privacy-dashboard](http://localhost:5002/privacy-dashboard)

### 4. Run the Elevana AI Mobile App (Frontend)
```bash
npm run android
# or
npm run ios
# or
npm start
```
