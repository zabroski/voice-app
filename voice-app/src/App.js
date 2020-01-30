import React, {useRef} from 'react';
import './App.css';
import LangSelector from './component/LangSelector';

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      transcript:"",
    };

    this.audioPlayer = React.createRef();
  
    // fetch('http://localhost:3000/transform-audio-to-text', {
    //   method: "POST"
    // }).then((response) => {
    //   return response.json()
    // }).then((data) => {
    //   console.log("data from api to get transcript: ", data.results[0].alternatives[0]);
    //   this.setState({
    //     transcript: data.results[0].alternatives[0].transcript
    //   });
    // })

  }

  componentDidMount(){
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(this.handleSuccess);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
       devices = devices.filter((d) => d.kind === 'audioinput');
       navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: devices[0].deviceId
        }
      });
    });
    

  }

 handleSuccess =(stream) => {
    if (window.URL) {
      this.audioPlayer.current.srcObject = stream;
    } else {
      this.audioPlayer.current.src = stream;
      
    }
  };
  render(){

    return (
      <div className="App">
        <div>
          <h1>Web Speech API Demonstartion</h1>
          <h3>Click on the microphone icon and begin speaking for as long as you like.</h3>
        </div>
        <div className="container">
        <p>{this.state.transcript}</p>
          {/* <button onClick="">Click</button> */}
        </div>
        <div>
          <LangSelector/>
        </div>


        <audio controls ref={this.audioPlayer} ></audio>
        <input type="file" accept="audio/*" onChange={(e) => {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            this.audioPlayer.current.src = url;
        }} />

               
})
      </div>
);
  }
}

export default App;
