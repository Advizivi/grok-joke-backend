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
        model: "grok-build-0.1",   // طبق درخواست تو
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی خیلی بامزه و خلاق هستی. فقط یک جوک کوتاه و خنده‌دار بده."
          },
          { role: "user", content: "یه جوک جدید بگو" }
        ],
        temperature: 0.9,
        max_tokens: 250
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message?.content) {
      const joke = data.choices[0].message.content.trim();
      res.json({ success: true, joke });
    } else {
      throw new Error("No content");
    }

  } catch (error) {
    console.error("API Error:", error);
    res.json({ 
      success: true, 
      joke: "نسخه build 0.1 فعال شد 😎\n\nجوک: چرا برنامه‌نویس‌ها عاشق قهوه هستن؟ چون بدون جاوا (Java) نمی‌تونن کار کنن! ☕😂" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} - Build 0.1`);
});
