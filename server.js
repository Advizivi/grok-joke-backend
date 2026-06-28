const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.GROK_API_KEY; // کلید DeepSeek تو

app.get('/joke', async (req, res) => {
  // اول سعی می‌کنه از API واقعی استفاده کنه
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی خیلی بامزه و خلاق هستی. فقط یک جوک کوتاه و خنده‌دار بده."
          },
          { role: "user", content: "یه جوک جدید بگو" }
        ],
        temperature: 0.9,
        max_tokens: 200
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message?.content) {
      const joke = data.choices[0].message.content.trim();
      return res.json({ success: true, joke, source: "DeepSeek API" });
    }
  } catch (e) {
    console.error("DeepSeek API failed:", e.message);
  }

  // اگر API شکست خورد، از جوک‌های آماده استفاده می‌کنه
  const fallbackJokes = [
    "چرا برنامه‌نویس به ساحل رفت؟ چون نیاز به Sea (C) داشت! 🌊😂",
    "مامانم گفت برو دکتر، گفتم چرا؟ گفت چون خیلی آنلاین هستی! 📱😅",
    "چرا کامپیوتر به روانشناس رفت؟ چون هاردش پر از خاطرات بد بود! 💾",
    "یه ایرانی گفت: زندگی مثل اینترنت شده، پر از باگ! 😂",
    "چرا هوش مصنوعی ازدواج نکرد؟ گفت هنوز commitment نداره! 🤖"
  ];

  const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
  res.json({ 
    success: true, 
    joke: randomJoke + "\n\n(DeepSeek API موقتاً آفلاین - Build 0.1)", 
    source: "fallback" 
  });
});

app.listen(PORT, () => {
  console.log(`✅ DeepSeek Joke Server Running on port ${PORT}`);
});
