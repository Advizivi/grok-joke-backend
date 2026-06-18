const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS بهبود یافته
app.use(cors({
  origin: '*',           // برای تست همه جا اجازه بده
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const GROK_API_KEY = process.env.GROK_API_KEY;

if (!GROK_API_KEY) {
  console.error('❌ GROK_API_KEY تنظیم نشده است!');
}

app.get('/joke', async (req, res) => {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی خیلی بامزه و خلاق هستی. جوک کوتاه و خنده‌دار بگو. همیشه به فارسی."
          },
          { role: "user", content: "یه جوک جدید بگو" }
        ],
        temperature: 0.9,
        max_tokens: 300
      })
    });

    const data = await response.json();
    const joke = data.choices?.[0]?.message?.content?.trim() || "جوک آماده نشد 😅";
    
    res.json({ success: true, joke });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'خطا در دریافت جوک' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

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
        model: "grok-4.3",   // ← مدل جدید و درست
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی خیلی بامزه، خلاق و مدرن هستی. جوک‌های کوتاه، خنده‌دار و مرتبط با زندگی ایرانی بگو. همیشه به فارسی جواب بده."
          },
          { role: "user", content: "یه جوک جدید و خنده‌دار بگو" }
        ],
        temperature: 0.95,
        max_tokens: 300
      })
    });

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response');
    }

    const joke = data.choices[0].message.content.trim();
    res.json({ success: true, joke });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'جوک آماده نشد 😅 دوباره امتحان کن' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
