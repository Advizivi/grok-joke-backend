const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: '*' }));

const jokes = [
  "چرا برنامه‌نویس به ساحل رفت؟ چون نیاز به Sea (C) داشت! 🌊😂",
  "مامانم گفت برو دکتر، گفتم چرا؟ گفت چون خیلی آنلاین هستی! 📱😅",
  "چرا کامپیوتر رفت پیش روانشناس؟ چون هاردش پر از خاطرات تلخ بود! 💾",
  "یه ایرانی به دوستش گفت: زندگی مثل اینترنت شده، پر از باگ و قطع و وصل! 😂",
  "چرا هوش مصنوعی ازدواج نکرد؟ گفت هنوز commitment نداره! 🤖",
  "دانشجو چرا همیشه گرسنه‌ست؟ چون هر ترم واحد می‌ندازه! 📚",
  "چرا ایرانی‌ها عاشق چای هستن؟ چون هر مشکلی باشه با چای حل می‌شه! ☕",
  "Grok به کاربر گفت: تو خیلی بامزه‌ای، ولی من بامزه‌ترم! 😎",
  "چرا برنامه‌نویس شب‌ها نمی‌خوابه؟ چون باگ تو سرش می‌چرخه! 🐛",
  "زن به شوهرش گفت: تو مثل وای‌فای منی! شوهر گفت: سریع و قوی؟ گفت: نه، همیشه قطع! 😂"
];

app.get('/joke', (req, res) => {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  res.json({ 
    success: true, 
    joke: randomJoke + "\n\n(نسخه Build 0.1 - Grok API موقتاً آفلاین)" 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Grok Joke Server Build 0.1 Running on port ${PORT}`);
});
