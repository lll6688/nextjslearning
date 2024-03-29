import { useEffect, useState } from 'react';
import styles from './index.module.scss';
interface IProps {
  time: number;
  onEnd: Function;
}

const Countdown = (props: IProps) => {
  const { time, onEnd } = props;
  const [count, setCount] = useState(time || 60);
  useEffect(() => {
    const id = setInterval(() => {
      setCount((count: number) => {
        if (count === 0) {
          clearInterval(id);
          onEnd && onEnd();
          return count;
        }
        return count - 1;
      });
    }, 1000);
    return function () {
      clearInterval(id);
    };
  }, [time, onEnd]);

  return <div className={styles.countDown}>{count}</div>;
};

export default Countdown;
