const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));

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
        model: "grok-4",
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی بامزه هستی. فقط یک جوک کوتاه و خنده‌دار بده."
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
    console.error("Error:", error.message);
    res.json({ 
      success: true, 
      joke: "Grok Build 0.1 فعاله 😎\n\nجوک: چرا برنامه‌نویس شب‌ها خوابش نمی‌بره؟ چون باگ تو ذهنش هست! 🐛😂" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} - Build 0.1`);
});
