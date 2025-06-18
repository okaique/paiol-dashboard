
import { useState, useEffect } from 'react';

export const useBrasiliaTime = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getBrasiliaTime = () => new Date();
  
  const getBrasiliaTimeISO = () => new Date().toISOString();

  return {
    currentTime,
    getBrasiliaTime,
    getBrasiliaTimeISO,
  };
};
