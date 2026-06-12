const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی خیلی بامزه، خلاق و مدرن هستی. جوک‌های کوتاه، مرتبط با زندگی روزمره ایرانی بگو. همیشه به فارسی جواب بده."
          },
          { role: "user", content: "یه جوک جدید و خنده‌دار بگو" }
        ],
        temperature: 0.95,
        max_tokens: 400
      })
    });

    const data = await response.json();
    const joke = data.choices[0].message.content.trim();
    res.json({ success: true, joke });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'خطا در دریافت جوک' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});