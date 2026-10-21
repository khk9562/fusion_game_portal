import { useState, type CSSProperties } from 'react';
import { GameCard } from './components/GameCard';
import { games } from './games';
import { readLastPlayed } from './recent';
import styles from './App.module.css';

const TITLE = 'Fusion Game Portal';

// 글자마다 순번과 상관없이 뒤섞인 박자를 준다. 순번에 비례하면 줄 따라 파도치듯 보인다
function hop(index: number): CSSProperties {
  const duration = 1.5 + ((index * 7) % 9) * 0.14;
  const delay = -((index * 5) % 11) * 0.29;
  return { '--hop-duration': `${duration}s`, '--hop-delay': `${delay}s` } as CSSProperties;
}

// 간판 글자를 한 글자씩 나눠 제각기 통통 뛰게 한다. 읽어 주는 기기에는 제목 전체를 한 번에 준다
function SignTitle({ className }: { className: string }) {
  let index = 0;
  return (
    <h1 className={className} lang="en" aria-label={TITLE}>
      {TITLE.split(' ').map((word, wordIndex) => (
        <span key={word} aria-hidden="true">
          {wordIndex > 0 && ' '}
          <span className={styles.word}>
            {word.split('').map((letter, letterIndex) => (
              <span key={letterIndex} className={styles.letter} style={hop(index++)}>
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
