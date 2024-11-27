import React, { useState, useEffect } from 'react'
import './Pomodoro.css'
import alarmSound from "./alarm-104243.mp3";
import restart from "./restart.png";
import start from "./start.png";
import stop from  "./stop.png";
import up from "./up.png";
import down from "./down.png";


const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
}
const Pomodoro = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timer, setTimer] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);

  useEffect(() => { // Updates the timer when sessionLength changes, with a maximum of 60 minutes.
    setTimer(Math.min(sessionLength * 60, 3600));
  }, [sessionLength]);

  const increment = (event) => {
    if (event.target.id === 'break-increment') {
      setBreakLength(Math.min(breakLength + 1, 60));
    } else if (event.target.id === 'session-increment') {
      if (sessionLength < 60) {
        setSessionLength(sessionLength + 1);
      }
    }
  };
  const decrement = (event) => {
    if (event.target.id === 'break-decrement' && breakLength > 1) {
      setBreakLength(breakLength - 1);
    } else if (event.target.id === 'session-decrement' && sessionLength > 1) {
      setSessionLength(Math.max(sessionLength - 1, 1));
    }
  };

  const reset = () => {
    setIsRunning(false);
    setIsSession(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimer(1500);
    const audio = document.getElementById('beep');
    audio.load();
  };

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
  let intervalId;
  if (isRunning && timer > 0) {
    intervalId = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);
  } else if (isRunning && timer === 0) {
    setTimeout(() => {
      if (isSession) {
        setIsSession(false);
        setTimer(breakLength * 60);
      } else {
        setIsSession(true);
        setTimer(sessionLength * 60);
      }
    }, 1000); // add a 1-second delay before starting the new countdown
    alarm();
  }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, timer, isSession, breakLength, sessionLength]);

  const alarm = () => {
    const audio = document.getElementById('beep');
    audio.play();
  }

  return (
    <div className='app'>
    <div className='length'>
      <div className='break-length-container'>
        <div className="break-length" id="break-label">Break Length</div>
        <div className="button-container">
          <button  id="break-decrement" onClick={decrement}> <img src={down} alt="-" /></button>
          <div id="break-length">{breakLength}</div>
          <button id="break-increment" onClick={increment}> <img src={up} alt="+" /></button>
        </div>
      </div>
      <div className='session-length-container'>
        <div className='session-length' id="session-label">Session Length</div>
        <div className="button-container">
          <button id="session-decrement" onClick={decrement}> <img src={down} alt="-" /></button>
          <div id="session-length">{sessionLength}</div>
          <button id="session-increment" onClick={increment}> <img src={up} alt="+" /></button>
        </div>
      </div>
    </div>
    <div className='session'>
      <div className="sessionWindow">
        <div className='timer-length' id="timer-label">{isSession ? 'Session' : 'Break'}</div>
        <div className='timer-length' id="time-left">{formatTime(timer)}</div>
      </div>
        <div className='timer-controls'>
        <button id="start_stop" onClick={startStop}>{isRunning ?   <img src={stop} alt="Stop" /> : <img src={start} alt="Start" /> }</button>
        <button id="reset" onClick={reset}><img src={restart} alt="Restart" /></button>
      </div>
    </div>
    <audio id="beep" src={alarmSound} />
    <div className="footer">Icons by <a href="https://icons8.com">Icons8</a></div>
  </div>
  )
}

export default Pomodoro