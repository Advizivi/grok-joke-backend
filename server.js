const express = require('express');
const cors = require('cors');
const jokes = require('./jokes.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

const NVIDIA_API_KEY =
  process.env.NVIDIA_API_KEY ||
  process.env.NVIDIA_NIM_API_KEY ||
  process.env.GROK_API_KEY;

const NVIDIA_BASE =
  (process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/$/, '');

const NVIDIA_MODEL =
  process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.1-8b-instruct';

function pickJoke() {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

async function fetchFromNim() {
  if (!NVIDIA_API_KEY) return null;

  const response = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NVIDIA_API_KEY}`
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      temperature: 0.95,
      max_tokens: 160,
      stream: false,
      messages: [
        {
          role: 'system',
          content:
            'تو یک نویسنده‌ی جوک فارسی هستی. فقط یک جوک کوتاه، تمیز و خنده‌دار به فارسی بنویس. بدون مقدمه و بدون توضیح.'
        },
        { role: 'user', content: 'یک جوک تازه بگو.' }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('NVIDIA NIM error:', response.status, errText);
    return null;
  }

  const data = await response.json();
  const joke = data.choices?.[0]?.message?.content?.trim();
  return joke || null;
}

app.get('/joke', async (req, res) => {
  try {
    const live = await fetchFromNim();
    if (live) {
      return res.json({ success: true, joke: live, source: 'live' });
    }
  } catch (error) {
    console.error('Joke API failed:', error.message);
  }

  res.json({
    success: true,
    joke: pickJoke(),
    source: 'archive'
  });
});

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Joke backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
