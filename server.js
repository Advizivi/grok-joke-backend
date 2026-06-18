const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

const GROK_API_KEY = process.env.GROK_API_KEY;

if (!GROK_API_KEY) {
  console.error('❌ GROK_API_KEY is not set!');
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
        model: "grok-4.3",   // مدل مطمئن
        messages: [
          {
            role: "system",
            content: "تو یک جوک‌گو فارسی بامزه هستی. همیشه یک جوک کوتاه و خنده‌دار به فارسی بگو."
          },
          { 
            role: "user", 
            content: "یه جوک جدید بگو" 
          }
        ],
        temperature: 0.9,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    const joke = data.choices?.[0]?.message?.content?.trim() 
                 || "جوک آماده نشد 😅 دوباره امتحان کن";

    res.json({ success: true, joke });

  } catch (error) {
    console.error('Grok API Error:', error);
    res.json({ 
      success: true, 
      joke: "Grok امروز خسته است 😅 یه جوک ساده: چرا کامپیوتر به دکتر رفت؟ چون ویروس گرفته بود! 😂" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
