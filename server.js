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
        model: "grok-beta",     // ← مدل مطمئن‌تر
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی خیلی بامزه هستی. همیشه یک جوک کوتاه و خنده‌دار به فارسی بگو."
          },
          { role: "user", content: "یه جوک جدید بگو" }
        ],
        temperature: 0.9,
        max_tokens: 200
      })
    });

    const data = await response.json();

    let joke = "جوک آماده نشد 😅";
    if (data.choices && data.choices[0] && data.choices[0].message) {
      joke = data.choices[0].message.content.trim();
    }

    res.json({ success: true, joke });

  } catch (error) {
    console.error('API Error:', error);
    res.json({ 
      success: true, 
      joke: "Grok امروز خیلی خسته‌ست 😅\n\nجوک جایگزین: چرا программиست‌ها همیشه سردشون می‌شه؟ چون همیشه نزدیک پنجره (Window) هستن! 😂" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
