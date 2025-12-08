import { useEffect, useState } from "react";

export default function useTranslate(text, lang) {
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text || !lang) return;

    const cacheKey = `trans_${lang}_${text}`;
    const cache = localStorage.getItem(cacheKey);

    // --- check cache ---
    if (cache) {
      const cacheData = JSON.parse(cache);
      const now = Date.now();

      // cache valid for 24 hours
      if (now - cacheData.time < 24 * 60 * 60 * 1000) {
        setTranslated(cacheData.value);
        return;
      }
    }

    // ---- Call Google Translate API ----
    const translate = async () => {
      try {
        const targetLang = lang === "mm" ? "my" : "en"; // adjust target
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
            text
          )}`
        );
        const data = await res.json();

        const translatedText = data[0][0][0] || text;
        setTranslated(translatedText);

        // Save to cache
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            value: translatedText,
            time: Date.now(),
          })
        );
      } catch (err) {
        console.error("Translate Error:", err);
        setTranslated(text); // fallback original
      }
    };

    translate();
  }, [text, lang]);

  return translated;
}
