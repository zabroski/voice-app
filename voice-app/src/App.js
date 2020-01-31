import React from 'react';
import './App.css';
import LangSelector from './component/LangSelector';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      audios: [],
      audio: undefined,
    };
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.mediaRecorder = new MediaRecorder(stream, {
      type: "audio",
      sampleRate: 8000,
      desiredSampleRate: 8000
  });
    // init data storage for video chunks
    this.chunks = [];
    // listen for data from media recorder
    this.mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
  }

  startRecording(e) {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    // say that we're recording
    this.setState({recording: true});
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({recording: false});
    // save the video to memory
    this.saveAudio();
  }

  saveAudio() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { 'type' : 'audio/wav; codecs=MS_PCM' });

    const self = this;
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var base64data = reader.result;    

        self.setState({
          audio: base64data
        });
        
      fetch('http://localhost:3000/transform-audio-to-text', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:JSON.stringify({
          base64Audio: base64data
        })
      }).then((response) => {
        return response.json()
      }).then((data) => {

        if(data.results[0] !== undefined){
          console.log("data from api to get transcript: ", data.results[0].alternatives[0]);
          this.setState({
            transcript: data.results[0].alternatives[0].transcript
          });
        }

      })
        console.log(base64data);
    }

    // console.log(blob);
    // generate video url from blob
    // const audioURL = window.URL.createObjectURL(blob);
    // // append videoURL to list of saved videos for rendering
    // const audios = this.state.audios.concat([audioURL]);
    // this.setState({audios});
  }

  deleteAudio(audioURL) {
    // filter out current videoURL from the list of saved videos
    const audios = this.state.audios.filter(a => a !== audioURL);
    this.setState({audios});
  }

  render() {
    const {recording, audios} = this.state;

    return (
      <div className="camera">
        <audio


          style={{width: 400}}
          ref={a => {
            this.audio = a;
          }}>
         <p>Audio stream not available. </p>
        </audio>
        <div>
          {!recording && <button onClick={e => this.startRecording(e)}>Record</button>}
          {recording && <button onClick={e => this.stopRecording(e)}>Stop</button>}
        </div>
        <div>
          <h3>Recorded audios:</h3>
          <audio controls style={{width: 200}} src={this.state.audio}   />
          {audios.map((audioURL, i) => (
            <div key={`audio_${i}`}>
              
              <div>
                <button onClick={() => this.deleteAudio(audioURL)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
//   constructor(props) {
//     super();
//     this.state = {
//       transcript:"",
//       shouldStop: false,
//       stopped: false,
//       recordedChunks: [],
//       options: {mimeType: 'audio/webm'}
      
//     };

//     this.audioPlayer = React.createRef();
  
//     // fetch('http://localhost:3000/transform-audio-to-text', {
//     //   method: "POST"
//     // }).then((response) => {
//     //   return response.json()
//     // }).then((data) => {
//     //   console.log("data from api to get transcript: ", data.results[0].alternatives[0]);
//     //   this.setState({
//     //     transcript: data.results[0].alternatives[0].transcript
//     //   });
//     // })

//   }

//   componentDidMount(){
//     navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(this.handleSuccess);
//   }
 

// handleSuccess = function(stream) {
//   const options = {mimeType: 'audio/webm'};
//   const recordedChunks = [];
//   const mediaRecorder = new MediaRecorder(stream, options);

//   mediaRecorder.addEventListener('dataavailable', function(e) {
//     console.log("IS RECORDING: ", e.data);

//     if (e.data.size > 0) {
//       recordedChunks.push(e.data);
//     }

//     if(this.state.shouldStop === true && this.state.stopped === false) {
//       mediaRecorder.stop();
//       console.log("STOPED RECORDING: ");
//       // this.setState({
//       //   stopped: true
//       // });
//       // stopped = true;
//     }
//   });

//   mediaRecorder.addEventListener('stop', function() {
//     console.log("stopped");

//     var reader = new FileReader();
//     reader.readAsDataURL(new Blob(recordedChunks)); 
//     reader.onloadend = function() {
//         var base64data = reader.result;                
//         console.log("my audio is: ", base64data);
//     }
//     // downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
//     // downloadLink.download = 'acetest.wav';
//   });

//   mediaRecorder.start();
//   console.log("start");
// };

//   stop = () => {
//     this.setState({
//       shouldStop: true
//     });
//   }
//   render(){

//     return (
//       <div className="App">
//         <div>
//           <h1>Web Speech API Demonstartion</h1>
//           <h3>Click on the microphone icon and begin speaking for as long as you like.</h3>
//         </div>
//         <div className="container">
//         <p>{this.state.transcript}</p>
//           {/* <button onClick="">Click</button> */}
//         </div>
//         <div>
//           <LangSelector/>
//         </div>


//         <audio controls ref={this.audioPlayer} ></audio>
//         <input type="file" accept="audio/*" onChange={(e) => {
//             const file = e.target.files[0];
//             const url = URL.createObjectURL(file);
//             this.audioPlayer.current.src = url;
//         }} />
//         <button onClick={() => {
//           this.stop();
//         }}>Stop</button>

               
// })
//       </div>
// );
//   }
}

export default App;
