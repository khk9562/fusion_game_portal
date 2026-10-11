import { useState } from 'react';
import { GameCard } from './components/GameCard';
import { games } from './games';
import { readLastPlayed } from './recent';
import styles from './App.module.css';

export default function App() {
  const [lastPlayed] = useState(readLastPlayed);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>FUSION GAME PORTAL</p>
        <h1 className={styles.title}>퓨전 게임 포털</h1>
        <p className={styles.lead}>설치 없이 바로 즐기는 미니 게임 모음입니다. 게임을 고르고 플레이를 누르세요.</p>
        <p className={styles.count}>
          <span>{String(games.length).padStart(2, '0')}</span> GAMES
        </p>
      </header>

      <main>
        <ul className={styles.grid}>
          {games.map((game, index) => (
            <li key={game.slug}>
              <GameCard game={game} index={index} isLastPlayed={game.slug === lastPlayed} />
            </li>
          ))}
        </ul>
      </main>

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
