import React from 'react';
import './App.css';
// import LangSelector from './component/LangSelector';
import { ReactMic } from '@cleandersonlobo/react-mic';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      audio: undefined,
      transcript: undefined,
      words: [],
      transcriptLanguage: "en-US"
    }
    this.onStop = this.onStop.bind(this);
  }

  startRecording = () => {
    this.setState({
      record: true
    });
  }

  stopRecording = () => {
    this.setState({
      record: false 
    });
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
    const self = this;
    let reader = new FileReader();
    reader.readAsDataURL(recordedBlob.blob); 
    reader.onloadend = function() {
      
    let base64data = reader.result;
           
    self.setState({
        audio: base64data,
        isLoading: true
      });
        
    fetch('http://localhost:3000/transform-audio-to-text', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          base64Audio: base64data,
          language: self.state.transcriptLanguage,
        })
      }).then((response) => {

        return response.json()
      }).then((data) => {
       

        if(data.results[0] !== undefined){
          console.log("data from api to get transcript: ", data.results[0].alternatives[0]);
          const wordsForState = [];
          data.results[0].alternatives[0].words.map((altWord) => {
            wordsForState.push({
              word: altWord.word,
              confidence: Math.floor(altWord.confidence * 100)
            });
            return null;
          });

          self.setState({
            // transcript: data.results[0].alternatives[0].transcript,
            isLoading: false,
            words: wordsForState,
          });
          console.log(data.results[0].alternatives[0])
          
        }
       
      })
    }
  }

  render() {
    
    return (
      <div className="App">
      <div>
          <h1>Web Speech API Demonstartion</h1>
          {!this.state.record && <h3>
            Click on the microphone icon and begin speaking for as    
              long as you like. 
          </h3>}

          {this.state.record && <h3>
            Is recording
          </h3>}
      </div>
      
      <div className="container">
         <p className="paragrah">
            {this.state.words.map((stateWord) => {
              return (
                <>
                  <span className="tooltip">
                      {stateWord.word}
                      <span className="tooltiptext">Accuraty: {stateWord.confidence}%</span>
                  </span>&nbsp;
                </>)
            })}
            {/* {this.state.transcript} */}
         </p>
        {this.state.record && <button onClick={this.stopRecording} type="button"> <img src="speaker-512.png" className="image" alt="img" /></button>}
        {!this.state.record && <button onClick={this.startRecording} type="button"><img src="speaker-512.png" className="image" alt="img" /></button>}
        
      </div>
       
      <div>
          <select value={this.state.transcriptLanguage} onChange={(e) => {
            this.setState({
              transcriptLanguage: e.target.value
            });
          }}>
            <option value="fr-FR">French</option>
            <option value="en-US">English</option>
            <option value="es-ES">Espanish</option>
          </select>
        {/* < LangSelector /> */}
      </div>

        {/* <audio controls src={this.state.audio} ></audio> */}
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop.bind()}
          onData={this.onData}
          strokeColor="#000000" />
      </div>
    );
  }
}

export default App;
