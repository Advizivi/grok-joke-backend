// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));

const API_KEY = process.env.GROK_API_KEY;

app.get('/joke', async (req, res) => {
  try {
    const r = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "یه جوک فارسی خنده‌دار بگو" }],
        temperature: 0.8,
        max_tokens: 150
      })
    });

    const data = await r.json();
    const joke = data.choices?.[0]?.message?.content?.trim() || "جوک آماده نشد 😅";

    res.json({ success: true, joke });
  } catch (e) {
    res.json({ success: true, joke: "DeepSeek موقتاً آفلاین 😅\n\nجوک: چرا ایرانی به دکتر گفت حافظه ندارم؟ دکتر گفت: از کی؟ 😂" });
  }
});

app.listen(PORT, () => console.log('Server running'));
