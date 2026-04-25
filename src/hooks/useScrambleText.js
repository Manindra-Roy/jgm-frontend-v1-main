import { useState, useEffect } from 'react';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

export default function useScrambleText(text, isRevealed) {
    const [scrambledText, setScrambledText] = useState(text);

    useEffect(() => {
        if (!isRevealed) {
            setScrambledText('');
            return;
        }

        let iteration = 0;
        let interval = null;

        const scramble = () => {
            setScrambledText(text.split('').map((char, index) => {
                if (index < iteration) {
                    return text[index];
                }
                if (char === ' ') return ' ';
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3; 
        };

        interval = setInterval(scramble, 30);

        return () => clearInterval(interval);
    }, [text, isRevealed]);

    return scrambledText;
}
