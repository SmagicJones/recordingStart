// import { StatusBar } from 'expo-status-bar';
// import { useState } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import { Audio } from 'expo-av';

// export default function App() {
//   const [recording, setRecording] = useState();
//   const [recordings, setRecordings] = useState([]);
//   const [message, setMessage] = useState("");


//   async function startRecording(){
//     try {
//       const permission = await Audio.requestPermissionsAsync();

//       if(permission.status === "granted"){
//         await Audio.setAudioModeAsync({
//           allowRecordingIOS: true,
//           playInSilentModeIOS: true
//         });
//         const {recording} = await Audio.Recording.createAsync(
//           Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//         );
//         setRecording(recording);
//       } else {
//         setMessage("Please allow access to your microphone")
//       }
//     } catch (err){
//       console.error("failed to start recording", err)
//     }

//   }

//    async function stopRecording(){
//     setRecording(undefined);
//     await recording.stopAndUnloadAsync();

//     let updatedRecordings = [...recordings];
//     const {sound, status} = await recording.createNewLoadedSoundAsync();
//     updatedRecordings.push({
//       sound: sound,
//       duration: getDurationFormatted(status.durationMillis),
//       file: recording.getURI()
//     });

//     setRecordings(updatedRecordings);
//   }

//   function getDurationFormatted(millis){
//     const minutes = millis / 1000 * 60;
//     const minutesDisplay = Math.floor(minutes);
//     const seconds = Math.round(minutes - minutesDisplay) * 60;
//     const secondsDisplay = seconds < 10 ? `0${seconds}` :  seconds;
//     return `${minitesDisplay}:${secondsDisplay}`;
//   }

//   function getRecordingLines(){
//     return recordings.map((recordingLine, i)=>{
//       return (
//         <View key={i} style={styles.row}>
//         <Text style={styles.fill}>Recording {i +1} - {recordingLine.duration}</Text>
//         <Button style={styles.button} onPress={()=> recordingLine.sound.replayAsync()} title='play '></Button>

//         </View>
//       )
//     })
//   }




//   return (
//     <View style={styles.container}>
//       <Text>{message}</Text>
//       <Button
//         title={recording ? "Stop Recording" : "Start Recording"}
//         onPress={recording ? stopRecording : startRecording}

//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   fill: {
//     flex: 1,
//     margin: 16
//   },
//   button: {
//     margin: 16
//   }
// });

import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

export default function App() {
  const [recording, setRecording] = React.useState();
  const [loadedSound, setLoadedSound] = React.useState()

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  }

  async function playSound(){
    console.log('loading sound');
    const {sound} = await Audio.Sound.createAsync(require('./assets/crash.mp3'))
    setLoadedSound(sound)
    console.log('playing sound');
    await loadedSound.playAsync()

  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button
      title='play'
      onPress={playSound}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
}); 