import { useState, type CSSProperties } from 'react';
import { GameCard } from './components/GameCard';
import { games } from './games';
import { readLastPlayed } from './recent';
import styles from './App.module.css';

const TITLE = 'Fusion Game Portal';

// 간판 글자를 한 글자씩 나눠 제각기 둥둥 떠 있게 한다. 읽어 주는 기기에는 제목 전체를 한 번에 준다
function SignTitle({ className }: { className: string }) {
  let index = 0;
  return (
    <h1 className={className} lang="en" aria-label={TITLE}>
      {TITLE.split(' ').map((word, wordIndex) => (
        <span key={word} aria-hidden="true">
          {wordIndex > 0 && ' '}
          <span className={styles.word}>
            {word.split('').map((letter, letterIndex) => (
              <span key={letterIndex} className={styles.letter} style={{ '--i': index++ } as CSSProperties}>
                {letter}
              </span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}

export default function App() {
  const [lastPlayed] = useState(readLastPlayed);
  const [started, setStarted] = useState(false);

  return (
    <div className={styles.page}>
      <header className={started ? `${styles.header} ${styles.started}` : styles.header}>
        <SignTitle className={styles.title} />
        <p className={styles.count}>
          <span>{String(games.length).padStart(2, '0')}</span> GAMES
        </p>
        {!started && (
          <button type="button" className={styles.start} onClick={() => setStarted(true)}>
            GAME START ?
          </button>
        )}
      </header>

      {started && (
        <main>
          <ul className={styles.grid}>
            {games.map((game, index) => (
              <li key={game.slug} style={{ '--i': index } as CSSProperties}>
                <GameCard game={game} index={index} isLastPlayed={game.slug === lastPlayed} />
              </li>
            ))}
          </ul>
        </main>
      )}

      <footer className={styles.footer}>
        <p>
          © 2026 StellaKHK. Released under the{' '}
          <a href="https://github.com/khk9562/fusion_game_portal/blob/main/LICENSE" target="_blank" rel="noreferrer">
            MIT License
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
