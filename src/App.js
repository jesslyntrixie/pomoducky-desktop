
// App.js - React Component

import React from 'react';
import './App.css';
// NOTE: You need to have these assets in your src folder
// import duckySprite from './spritesheet/ducky_2_spritesheet.png'; 
import beepSound from './beep.mp3';
import duckySprite from './spritesheet/ducky_2_spritesheet.png'; 
// Placeholder for assets if you don't have them
// const duckySprite = 'https://placehold.co/192x32/ff0000/ffffff?text=Sprite';



// --- Component for Window Controls ---
function WindowControls() {
  const handleMinimize = () => {
    window.electronAPI.minimize();
  };

  const handleClose = () => {
    window.electronAPI.close();
  };

  return (
    <div id="window-controls">
      <button onClick={handleMinimize} className="control-btn" id="minimize-btn">
        -
      </button>
      <button onClick={handleClose} className="control-btn" id="close-btn">
        x
      </button>
    </div>
  );
}


// --- Component untuk Kontrol Play/Pause/Reset & Bebek ---
function Control({ handleStartStop, handleRestart, isRunning, mode }) {
  const animationClass =
    isRunning && mode === "Session"
      ? "walkbounce"
      : isRunning && mode === "Break"
      ? "idlebounce"
      : "idle";

  return (
    <div id="control-container">
      <button id="start_stop" onClick={handleStartStop} className="btn control-btn">
        <i className={isRunning ? "bi bi-pause-fill" : "bi bi-play-fill"}></i>
      </button>
      <div id="animation">
        <img src={duckySprite} className={`character_spritesheet pixelart ${animationClass}`} alt="ducky" />
      </div>
      <button id="reset" onClick={handleRestart} className="btn control-btn">
        <i className="bi bi-arrow-counterclockwise" />
      </button>
    </div>
  );
}

// --- Component untuk Pengaturan Durasi ---
function SessionSettings({ sessionMins, breakMins, sessionLengthUp, sessionLengthDown, breakLengthUp, breakLengthDown }) {
  return (
    <div id="session-container">
      <div className="settings-group">
        <p id="session-label">Session</p>
        <div className="buttons-container">
          <button className="btn" id="session-decrement" onClick={sessionLengthDown}>-</button>
          <p id="session-length">{sessionMins}</p>
          <button className="btn" id="session-increment" onClick={sessionLengthUp}>+</button>
        </div>
      </div>
      <div className="settings-group">
        <p id="break-label">Break</p>
        <div className="buttons-container">
          <button className="btn" id="break-decrement" onClick={breakLengthDown}>-</button>
          <p id="break-length">{breakMins}</p>
          <button className="btn" id="break-increment" onClick={breakLengthUp}>+</button>
        </div>
      </div>
    </div>
  );
}

// --- Component untuk Tampilan Timer (tanpa bebek) ---
function Display({ timeLeft, mode }) {
  const getMinSec = (time) => {
    const mins = Math.floor(time / 60).toString().padStart(2, "0");
    const secs = (time % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div id="display-container">
      <p id="timer-label">{mode}</p>
      <p id="time-left">{getMinSec(timeLeft)}</p>
    </div>
  );
}


// --- Komponen Utama Aplikasi ---
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: 60 * 25,
      mode: "Session",
      isRunning: false,
      sessionMins: 25,
      breakMins: 5
    };
    this.audioBeep = React.createRef();
    this.handleStartStop = this.handleStartStop.bind(this);
    this.tick = this.tick.bind(this);
    this.sessionLengthUp = this.sessionLengthUp.bind(this);
    this.sessionLengthDown = this.sessionLengthDown.bind(this);
    this.breakLengthUp = this.breakLengthUp.bind(this);
    this.breakLengthDown = this.breakLengthDown.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  handleRestart() {
    clearInterval(this.timerID);
    if (this.audioBeep.current) {
      this.audioBeep.current.pause();
      this.audioBeep.current.currentTime = 0;
    }
    this.setState({
      timeLeft: 25 * 60,
      mode: "Session",
      isRunning: false,
      sessionMins: 25,
      breakMins: 5
    });
  }

  handleStartStop() {
    if (!this.state.isRunning) {
      this.timerID = setInterval(() => this.tick(), 1000);
      this.setState({ isRunning: true });
    } else {
      clearInterval(this.timerID);
      this.setState({ isRunning: false });
    }
  }

  tick() {
    this.setState(prevState => {
      const newTime = prevState.timeLeft - 1;
      if (newTime < 0) {
        const newMode = prevState.mode === "Session" ? "Break" : "Session";
        const nextTime = newMode === "Session" ? this.state.sessionMins * 60 : this.state.breakMins * 60;
        if (this.audioBeep.current) {
          this.audioBeep.current.play();
        }
        return { mode: newMode, timeLeft: nextTime };
      }
      return { timeLeft: newTime };
    });
  }

  sessionLengthUp() {
    if (this.state.sessionMins === 60 || this.state.isRunning) return;
    this.setState(prevState => {
      const newSesMins = prevState.sessionMins + 1;
      return {
        sessionMins: newSesMins,
        timeLeft: prevState.mode === "Session" ? newSesMins * 60 : prevState.timeLeft
      };
    });
  }

  sessionLengthDown() {
    if (this.state.sessionMins === 1 || this.state.isRunning) return;
    this.setState(prevState => {
      const newSesMins = prevState.sessionMins - 1;
      return {
        sessionMins: newSesMins,
        timeLeft: prevState.mode === "Session" ? newSesMins * 60 : prevState.timeLeft
      };
    });
  }

  breakLengthUp() {
    if (this.state.breakMins === 60 || this.state.isRunning) return;
    this.setState(prevState => {
      const newBreakMins = prevState.breakMins + 1;
      return {
        breakMins: newBreakMins,
        timeLeft: prevState.mode === "Break" ? newBreakMins * 60 : prevState.timeLeft
      };
    });
  }

  breakLengthDown() {
    if (this.state.breakMins === 1 || this.state.isRunning) return;
    this.setState(prevState => {
      const newBreakMins = prevState.breakMins - 1;
      return {
        breakMins: newBreakMins,
        timeLeft: prevState.mode === "Break" ? newBreakMins * 60 : prevState.timeLeft
      };
    });
  }

  render() {
    const themeClass = this.state.mode === "Session" ? "day" : "night";
    return (
      <div id="app" className={themeClass}>
        <div id="wrapper">
          <WindowControls />
          <audio id="beep" preload="auto" src={beepSound} ref={this.audioBeep} />
          
          <Display 
            timeLeft={this.state.timeLeft} 
            mode={this.state.mode} 
          />
          
          <Control 
            handleRestart={this.handleRestart} 
            handleStartStop={this.handleStartStop} 
            isRunning={this.state.isRunning} 
            mode={this.state.mode}
          />

          <SessionSettings
            breakMins={this.state.breakMins}
            sessionMins={this.state.sessionMins}
            breakLengthDown={this.breakLengthDown}
            breakLengthUp={this.breakLengthUp}
            sessionLengthUp={this.sessionLengthUp}
            sessionLengthDown={this.sessionLengthDown}
          />
          
          <div id="author">coded by @jesslyntrixie</div>
        </div>
      </div>
    );
  }
}

export default App;
