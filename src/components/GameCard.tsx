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

  return (
    <article className={styles.card}>
      <a className={styles.thumb} href={href} onClick={play} style={{ background: sprite.background }} tabIndex={-1} aria-hidden="true">
        <PixelArt sprite={sprite} label={game.title} />
        <span className={styles.slot}>{String(index + 1).padStart(2, '0')}</span>
        {isLastPlayed && <span className={styles.badge}>최근 플레이</span>}
      </a>

      <div className={styles.body}>
        <p className={styles.english}>{game.englishTitle}</p>
        <h2 className={styles.title}>
          <a href={href} onClick={play}>
            {game.title}
          </a>
        </h2>
        <p className={styles.tagline}>{game.tagline}</p>
        <p className={styles.description}>{game.description}</p>
        <ul className={styles.tags}>
          {game.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <a className={styles.play} href={href} onClick={play}>
          플레이
        </a>
        <a className={styles.repo} href={game.repo} target="_blank" rel="noreferrer">
          저장소
        </a>
      </div>
    </article>
  );
}
