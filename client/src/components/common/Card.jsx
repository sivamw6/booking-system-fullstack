import styles from './Card.module.css';

function BbCard({ title, children }) {
  return (
      <div className={`${styles.leadCard} `}>
        <h1 className={`mt-5 text-center ${styles.cardTitle}`}>{title}</h1>
        <div className={styles.content}>{children}</div>
      </div>
  )
}

export default BbCard