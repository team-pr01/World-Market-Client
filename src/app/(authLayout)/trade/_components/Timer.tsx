import React, { useState, useEffect } from 'react';
import './Timer.css';

const Timer = () => {
  const [currentSeconds, setCurrentSeconds] = useState(59);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setCurrentSeconds(prev => {
        if (prev <= 0) {
          return 59; // Reset to 59 seconds
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="timer-container">
      <span>⏱️</span>
      <span>{timeString}</span>
    </div>
  );
};

export default Timer; 