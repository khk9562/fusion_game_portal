import { useState, type MouseEvent } from 'react';
import { gamePath, type Game } from '../games';
import { saveLastPlayed } from '../recent';
import { PixelArt } from '../thumbnails/PixelArt';
import { sprites } from '../thumbnails/sprites';
import styles from './GameCard.module.css';

type Props = { game: Game; index: number; isLastPlayed: boolean };

export function GameCard({ game, index, isLastPlayed }: Props) {
  const sprite = sprites[game.slug];
  const href = gamePath(game);
  const play = () => saveLastPlayed(game.slug);
  // 마우스가 없는 기기에서는 카드를 누르면 설명이 열리고 다시 누르면 닫힌다. 재생 링크를 누른 것은 빼고 센다
  const [open, setOpen] = useState(false);
  const toggle = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest('a')) return;
    setOpen((value) => !value);
  };

  return (
    <article className={open ? `${styles.card} ${styles.open}` : styles.card} onClick={toggle}>
      <div className={styles.thumb} style={{ background: sprite.background }}>
        <PixelArt sprite={sprite} label={game.title} />
        <span className={styles.slot}>{String(index + 1).padStart(2, '0')}</span>
        {isLastPlayed && <span className={styles.badge}>최근 플레이</span>}

        <div className={styles.details}>
          <p className={styles.english}>{game.englishTitle}</p>
          <p className={styles.tagline}>{game.tagline}</p>
          <p className={styles.description}>{game.description}</p>
        </div>

        <ul className={styles.tags}>
          {game.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <div className={styles.footer}>
        <h2 className={styles.title}>
          <a href={href} onClick={play}>
            {game.title}
          </a>
        </h2>
        <a className={styles.play} href={href} onClick={play} aria-label={`${game.title} 플레이`} title="플레이">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4.5 19.5 12 7 19.5Z" />
          </svg>
        </a>
      </div>
    </article>
  );
}
