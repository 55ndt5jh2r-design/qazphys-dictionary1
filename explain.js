export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Тек POST сұраныстары қабылданады' });
  }

  const { term, lang = 'kk' } = req.body || {};
  if (!term) {
    return res.status(400).json({ error: 'Термин көрсетілмеген' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      explanation: `«${term}» термині бойынша қысқаша анықтама: Бұл физикалық шама немесе құбылыс табиғат заңдылықтарын сипаттайды. Толық AI талдауын қосу үшін Vercel ортасында GEMINI_API_KEY айнымалысын орнатыңыз.`
    });
  }

  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Сен ҰБТ-ға дайындайтын тәжірибелі физика мұғалімісің. «${term}» физикалық терминін оқушыға өте түсінікті, өмірден алынған қарапайым мысалмен және ҰБТ-да жиі кездесетін ерекшелігімен қазақ тілінде (3-4 сөйлеммен) түсіндіріп бер.`
              }]
            }]
          })
        }
      );
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Түсіндірме табылмады.';
      return res.status(200).json({ explanation: text });
    }
  } catch (error) {
    return res.status(500).json({ error: 'AI серверімен байланыс қатесі' });
  }
}
