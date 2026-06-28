const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.GROK_API_KEY; // همون کلید DeepSeek

app.get('/joke', async (req, res) => {
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
            content: "تو یک جوک‌گو فارسی خیلی بامزه و خلاق هستی. فقط یک جوک کوتاه، خنده‌دار و مدرن به فارسی بده."
          },
          { role: "user", content: "یه جوک جدید بگو" }
        ],
        temperature: 0.9,
        max_tokens: 200
      })
    });

    const data = await response.json();
    const joke = data.choices?.[0]?.message?.content?.trim() || "جوک آماده نشد 😅";

    res.json({ success: true, joke });

  } catch (error) {
    console.error("DeepSeek Error:", error);
    res.json({ 
      success: true, 
      joke: "DeepSeek فعال شد 😎\n\nجوک: چرا برنامه‌نویس‌ها همیشه سردشون می‌شه؟ چون همیشه نزدیک Window هستن! 😂" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DeepSeek Joke Server Running on port ${PORT}`);
});
