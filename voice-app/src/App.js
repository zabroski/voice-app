import React from 'react';
import './App.css';
import LangSelector from './component/LangSelector';
import { ReactMic } from '@cleandersonlobo/react-mic';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      audio: undefined,
      transcript: undefined
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
        var base64data = reader.result;    

      self.setState({
        audio: base64data
      });
        
      fetch('http://localhost:3000/transform-audio-to-text', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        
        body: JSON.stringify({
          base64Audio: base64data
        })
      }).then((response) => {
        return response.json()
      }).then((data) => {

        if(data.results[0] !== undefined){
          console.log("data from api to get transcript: ", data.results[0].alternatives[0]);
          self.setState({
            transcript: data.results[0].alternatives[0].transcript
          });
          console.log(data.results[0].alternatives[0])
        }
       
      })
      
      // .then((data) => {

      // })
        // console.log(base64data);
        // console.log(this.resut)
       
    }
  }

  render() {
    return (
      <div className="App">
      <div>
          <h1>Web Speech API Demonstartion</h1>
          <h3>Click on the microphone icon and begin speaking for as long as you like.</h3>
      </div>
      
      <div className="container">
         <p className="paragrah">{this.state.transcript}</p>
         <img src="images/snake_right" alt="ok" onClick={this.startRecording} type="button"/>
         <button onClick={this.stopRecording} type="button">Stop</button>
        
      </div>
       
      <div>
        < LangSelector />
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
