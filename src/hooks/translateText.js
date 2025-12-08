import useTranslate from "../hooks/useTranslate";

const TranslatedText = ({ text, lang }) => {
    const translated = useTranslate(text, lang);
    return translated;
  };

export default TranslatedText;