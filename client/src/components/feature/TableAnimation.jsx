import { useEffect, useState } from 'react';
import styles from './TableAnimation.module.css';

const TableAnimation = ({ delay, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  let classNames = styles['animatedRow'];
  if (isVisible) {
    classNames += ` ${styles.visible}`;
  }

  return (
    <tr className={classNames}>
      {children}
    </tr>
  );
};

export default TableAnimation;
