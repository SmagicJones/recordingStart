import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { Audio } from 'expo-av';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import * as Sharing from 'expo-sharing'

export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);

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
    let updatedRecordings = [...recordings]
    const {sound, status} = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });
    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
  <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
  <View style={styles.buttonContainer}>
    <Button  
      size="sm"
      onPress={() => recordingLine.sound.replayAsync()}
      title="Play"
      style={[styles.button, styles.singleButton]}
    />
    <Button  
      size="sm"
      color="secondary"
      onPress={() => Sharing.shareAsync(recordingLine.file)}
      title="Share"
      style={[styles.button, styles.singleButton]}
    />
    <Button  
      size="sm"
      color="error"
      onPress={() => deleteRecording(index)}
      title="Delete"
      style={[styles.button, styles.singleButton]}
    />
  </View>
</View>

      );
    });
  }
  
  //delete rec function
  async function deleteRecording(index) {
    const updatedRecordings = [...recordings];
    const recordingToDelete = updatedRecordings[index];
  
    if (recordingToDelete.sound) {
      await recordingToDelete.sound.unloadAsync();
    }
      updatedRecordings.splice(index, 1);
    setRecordings(updatedRecordings);
  }

//   async function playSound(){
//     console.log('loading sound');
//     const {sound} = await Audio.Sound.createAsync(require('./assets/crash.mp3'))
//     setLoadedSound(sound)
//     console.log('playing sound');
//     await loadedSound.playAsync()
// }

  return (
    <View style={styles.container} >
      <Button
        type="outline"
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {getRecordingLines()}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1, //space between rows
    padding: 1,
    backgroundColor: '#f5f5f5',
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10, //space between buttons
    marginRight: 5,
  },
  button: {
    margin: 1,
  },
  singleButton: {
    marginLeft: 2, //control the separation
  },
});
//
