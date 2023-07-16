import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main>
      <h1>
        ffmpeg.wasmで遊ぶ
      </h1>
      
      <ul className={styles.list}>
        <li>
          <Link href="canvas_to_webp">
            canvasをwebpに
          </Link>
        </li>
      </ul>
    </main>
  )
}
