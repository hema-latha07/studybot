# 🎓 StudyBot — AI-Powered Study Helper & Tutor

An intelligent tutoring chatbot built with **Node.js + Express** and **Google Gemini AI** that helps students learn any subject through clear explanations, step-by-step guidance, and interactive Q&A.

## ✨ Features

- 📚 Covers all subjects: Math, Science, History, English, Coding & more
- 💡 Step-by-step explanations with examples
- 🧠 Quiz mode to test knowledge
- 💬 Maintains conversation context
- 📱 Fully responsive UI
- ⚡ Fast responses powered by Gemini 1.5 Flash

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **AI:** Google Gemini 1.5 Flash via `@google/generative-ai`
- **Frontend:** Vanilla HTML/CSS/JS (no frameworks)
- **Hosting:** Render

## 🚀 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/studybot.git
cd studybot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Get a Gemini API Key
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key into your `.env` file

### 5. Start the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Visit `http://localhost:3000` 🎉

## ☁️ Deploy to Render

1. Push your code to GitHub (follow steps below)
2. Go to [https://render.com](https://render.com) and sign up / log in
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini API key
7. Click **"Create Web Service"**
8. Your app will be live at `https://studybot-xxxx.onrender.com` 🚀

## 📁 Project Structure

```
studybot/
├── public/
│   └── index.html      # Frontend UI
├── server.js           # Express server + Gemini integration
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 📄 License

MIT
