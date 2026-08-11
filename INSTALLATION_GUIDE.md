# MindCareAI Setup & Installation Guide

This guide will walk you through setting up the frontend and backend dependencies for **MindCareAI** from scratch after extracting the project files.

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

### Step 1: Extract and Open
1. Extract the `MindCareAI.zip` file to a folder of your choice.
2. Open your terminal (or Command Prompt / PowerShell on Windows) and navigate to the extracted directory:
   ```bash
   cd /path/to/extracted/MindCareAI
   ```

---

### Step 2: Set Up Environment Variables (`.env`)
The app requires a Gemini API key for some AI interactions.
1. Create a file named `.env` in the root of the project directory.
2. Add the following line to the file:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```
   *Note: If you don't have a Gemini API key, you can get one for free from [Google AI Studio](https://aistudio.google.com/).*

---

### Step 3: Set Up Python Virtual Environment (`venv`)
We need to recreate the Python virtual environment that was removed.

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
   * **Windows (PowerShell):**
     ```powershell
     venv\Scripts\Activate.ps1
     ```
   *(You should see `(venv)` in your terminal prompt indicating it is active).*

3. **Install dependencies:**
   Choose one of the two modes below:
   
   * **Option A: Offline / Lightweight Mode (Recommended & Quick)**
     If you want to run the offline privacy server without downloading heavy machine learning models (~2GB+):
     ```bash
     pip install flask flask-cors requests
     ```
   * **Option B: Full ML/AI Mode (Requires PyTorch & Transformers)**
     If you want to run the full emotion-detection local ML model:
     ```bash
     pip install -r requirements.txt
     ```
     *(Note: This might take a few minutes as it downloads PyTorch).*

---

### Step 4: Install Frontend Node Modules
Recreate the `node_modules` directory for the React Native/Expo app:

1. In the root directory, run:
   ```bash
   npm install
   ```
   *(This will read `package.json` and install all required JS/TS libraries).*

---

## 🚀 Running the Application

You will need to run the backend Python services and build/run the frontend React Native app in development mode.

### 1. Run the Privacy Service (Backend)
Open a terminal, activate `venv`, and run **one** of these:

* **Offline/Lightweight Privacy Service (Port 5001):**
  ```bash
  python offline_privacy.py
  ```
  *(Uses keyword-based rules; starts instantly).*
  
* **OR Full AI Privacy Service (Port 5001):**
  ```bash
  python privacy_service.py
  ```
  *(Downloads the SamLowe/roberta-base-go_emotions model on first launch).*

### 2. Run the Email Service (Optional - Port 5000)
Open a new terminal, activate `venv`, and run:
```bash
python email_service.py
```
*Note: If you want to use the email functions, open `email_service.py` and replace `GMAIL_USER` and `GMAIL_PASSWORD` with your own Gmail address and App Password.*

### 3. Run the Dashboard Demo (Optional - Port 5002)
Open a new terminal, activate `venv`, and run:
```bash
python dashboard_demo.py
```
Once started, you can view the dashboard by visiting [http://localhost:5002/privacy-dashboard](http://localhost:5002/privacy-dashboard) in your browser.

### 4. Build and Run the Frontend (Dev Mode on Device / Emulator)
To compile the native code and run the app in development mode:

1. **Start your emulator / simulator** or connect your physical device via USB (make sure USB Debugging is enabled for Android).
2. Open a new terminal in the root directory and run the command matching your target platform:
   * **For Android:**
     ```bash
     npm run android
     ```
     *(This runs `expo run:android`, compiling the native Android project and installing it on the device/emulator).*
   * **For iOS (macOS only):**
     ```bash
     npm run ios
     ```
     *(This runs `expo run:ios`, installing CocoaPods dependencies, building the native iOS app, and launching it).*
3. Once the build finishes and the app is installed, the terminal will automatically start the Metro Bundler, and the app will load!
