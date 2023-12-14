import styles from './Button.module.css';

function Button({onClick, type, children}) {
  return (
    <button 
      className={styles.button} 
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button