import React, { useState, useEffect } from "react";
import "./Timer.css";

interface TimerProps {
     lastCandleTimestamp?: number | null;
     currentTimestamp?: number | null;
}

const Timer = ({ lastCandleTimestamp, currentTimestamp }: TimerProps) => {
     const [currentSeconds, setCurrentSeconds] = useState(59);

     useEffect(() => {
          if (!lastCandleTimestamp) return;

          const calculateTimeRemaining = () => {
               const now = currentTimestamp ? currentTimestamp * 1000 : Date.now();
               const lastCandleTime = lastCandleTimestamp * 1000;
               const nextCandleTime = lastCandleTime + 60000; // Add 1 minute (60 seconds)
               const timeRemaining = Math.max(0, Math.floor((nextCandleTime - now) / 1000));

               return timeRemaining;
          };

          // Set initial time
          setCurrentSeconds(calculateTimeRemaining());

          const timerInterval = setInterval(() => {
               const timeRemaining = calculateTimeRemaining();
               setCurrentSeconds(timeRemaining);
          }, 1000);

          return () => clearInterval(timerInterval);
     }, [lastCandleTimestamp, currentTimestamp]);

     const minutes = Math.floor(currentSeconds / 60);
     const seconds = currentSeconds % 60;
     const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;

     return (
          <div className="timer-container">
               <span>⏱️</span>
               <span>{timeString}</span>
          </div>
     );
};

export default Timer;
