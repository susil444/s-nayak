import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        const newRecording = {
          id: Date.now(),
          url,
          duration: recordingTime,
        };

        setRecordings((prev) => [newRecording, ...prev]);
        setRecordingTime(0);
        clearInterval(timerRef.current);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied or not supported', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const deleteRecording = (id) => {
    setRecordings((prev) => prev.filter((rec) => rec.id !== id));
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current); // Cleanup timer on unmount
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>🎙 Voice Recorder</h2>

      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      {recording && (
        <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>
          ⏱ Recording: {recordingTime}s
        </p>
      )}

      <h3 style={{ marginTop: '2rem' }}>📝 Recordings List</h3>
      {recordings.length === 0 && <p>No recordings yet</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {recordings.map((rec) => (
          <li key={rec.id} style={{ marginBottom: '1.5rem' }}>
            <audio controls src={rec.url} />
            <div>
              ⏱ Duration: {rec.duration}s
              <br />
              <a href={rec.url} download={`recording-${rec.id}.webm`}>
                Download
              </a>{' '}
              |{' '}
              <button
                onClick={() => deleteRecording(rec.id)}
                style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoiceRecorder;
