import { useEffect, useState } from "react";

interface RotatingWordsProps {
  words: string[];
  interval?: number;
  className?: string;
}

const RotatingWords = ({ words, interval = 10000, className = "" }: RotatingWordsProps) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false); // start fade-out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true); // fade-in new word
      }, 700); // duration of fade-out
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span
      className={`inline-block transition-opacity duration-700 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {words[index]}
    </span>
  );
};

export default RotatingWords;
