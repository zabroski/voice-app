import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div>
        <h1>Web Speech API Demonstartion</h1>
        <h3>Click on the microphone icon and begin speaking for as long as you like.</h3>
      </div>
      <div className="container"><p></p></div>
      <div>
      <select>
        <option>English</option>
        <option>Francais</option>
      </select>

      <select>
        <option>United State</option>
        <option>Canada</option>
      </select>
      </div>  
    </div>
  );
}

export default App;
