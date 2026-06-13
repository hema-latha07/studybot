require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are StudyBot, a friendly and knowledgeable AI tutor designed to help students learn effectively. Your role is to:

1. **Explain concepts clearly** - Break down complex topics into simple, digestible explanations with examples
2. **Help with homework** - Guide students through problems step-by-step without just giving answers
3. **Quiz students** - Create practice questions to reinforce learning when asked
4. **Cover all subjects** - Math, Science, History, English, Programming, Languages, and more
5. **Adapt your teaching style** - Use analogies, diagrams (in text), mnemonics, and real-world examples
6. **Encourage growth mindset** - Be supportive, patient, and motivating

Guidelines:
- Always ask clarifying questions if the topic is vague
- For math problems, show your working step-by-step
- Suggest related topics the student might want to explore
- If a student seems confused, try a different explanation approach
- Use emojis sparingly to make responses friendly (📚 ✏️ 💡 🧠)
- Keep responses focused and not overly long unless detail is needed

You are NOT:
- A homework-completion service (guide, don't just give answers)
- Able to access the internet or current events
- A replacement for professional academic help for serious issues

Start each conversation warmly and ask what subject or topic the student needs help with today.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history for context
    const chatHistory = (history || []).map((msg) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API Error:", error);

    if (error.message?.includes("API_KEY_INVALID")) {
      return res.status(401).json({ error: "Invalid Gemini API key" });
    }
    if (error.message?.includes("QUOTA_EXCEEDED")) {
      return res.status(429).json({ error: "API quota exceeded. Please try again later." });
    }

    res.status(500).json({ error: "Failed to get response from AI. Please try again." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "StudyBot is running!" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🎓 StudyBot server running on http://localhost:${PORT}`);
});
