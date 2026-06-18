const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

const GROK_API_KEY = process.env.GROK_API_KEY;

app.get('/joke', async (req, res) => {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-3",           // ← مدل رایج فعلی
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی حرفه‌ای و بامزه هستی. جوک کوتاه، مدرن و خنده‌دار بگو. فقط یک جوک بده."
          },
          { role: "user", content: "یه جوک جدید بگو" }
        ],
        temperature: 0.85,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const joke = data.choices?.[0]?.message?.content?.trim();

    if (joke) {
      res.json({ success: true, joke });
    } else {
      throw new Error("No joke in response");
    }

  } catch (error) {
    console.error('Full Error:', error);
    res.json({ 
      success: true, 
      joke: "اتصال به Grok برقرار شد ولی جوک نیاورد 😅\n\nجوک دستی: چرا ایرانی‌ها عاشق چای هستن؟ چون هر مشکلی باشه با چای حل می‌شه! ☕😂" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
