require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `You are StudyBot, a friendly and knowledgeable AI tutor designed to help students learn effectively. Your role is to:

1. Explain concepts clearly - Break down complex topics into simple, digestible explanations with examples
2. Help with homework - Guide students through problems step-by-step without just giving answers
3. Quiz students - Create practice questions to reinforce learning when asked
4. Cover all subjects - Math, Science, History, English, Programming, Languages, and more
5. Adapt your teaching style - Use analogies, diagrams (in text), mnemonics, and real-world examples
6. Encourage growth mindset - Be supportive, patient, and motivating

Guidelines:
- Always ask clarifying questions if the topic is vague
- For math problems, show your working step-by-step
- Suggest related topics the student might want to explore
- If a student seems confused, try a different explanation approach
- Use emojis sparingly to make responses friendly
- Keep responses focused and not overly long unless detail is needed`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Groq API key not configured" });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history || []).slice(-20).map((msg) => ({
        role: msg.role === "bot" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: messages,
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);
      return res.status(500).json({ error: data.error?.message || "Failed to get response" });
    }

    const reply = data.choices[0]?.message?.content;
    res.json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
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