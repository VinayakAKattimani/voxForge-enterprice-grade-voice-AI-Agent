import { useEffect, useRef, useState, useCallback } from 'react';

import {
  synthesizeSpeech,
  fetchTTSVoices,
} from '../api/ttsApi';

import {
  uploadAudio,
  fetchTranscription,
} from '../api/sttApi';

import {
  createConversation,
  sendConversationMessage,
} from '../api/conversationApi';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Field';

import MicButton from '../components/voice/MicButton';
import Waveform from '../components/voice/Waveform';
import TranscriptPanel from '../components/voice/TranscriptPanel';
import Timeline from '../components/voice/Timeline';

import {
  IconPause,
  IconPlay,
  IconRestart,
  IconStop,
  IconSend,
} from '../components/ui/icons';

import './conversation.css';


function nowTs() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}


export default function VoiceConversation() {

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [status, setStatus] = useState('idle');

  const [messages, setMessages] = useState([]);

  const [conversationId, setConversationId] =
    useState(null);

  const [liveCaption, setLiveCaption] =
    useState('');

  const [ttsVoice, setTtsVoice] =
    useState(null);

  const [timelineEvents, setTimelineEvents] =
    useState([
      {
        type: 'system',
        label: 'Initializing voice session...',
        ts: nowTs(),
      },
    ]);

  const [typedInput, setTypedInput] =
    useState('');

  const [playback, setPlayback] =
    useState({
      playing: false,
      progress: 0,
      duration: 0,
    });

  const [lastAiMessage, setLastAiMessage] =
    useState(null);

  const [analyserNode, setAnalyserNode] =
    useState(null);


  // --------------------------------------------------
  // REFS
  // --------------------------------------------------

  const streamRef =
    useRef(null);

  const mediaRecorderRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const audioRef =
    useRef(null);

  const audioUrlRef =
    useRef(null);

  const analyserRef =
    useRef(null);

  const audioCtxRef =
    useRef(null);


  // --------------------------------------------------
  // TIMELINE
  // --------------------------------------------------

  const pushTimeline = useCallback(
    (label, type = 'system') => {

      setTimelineEvents((events) => [
        ...events,
        {
          label,
          type,
          ts: nowTs(),
        },
      ]);

    },
    []
  );


  // --------------------------------------------------
  // CREATE CONVERSATION
  // --------------------------------------------------

  useEffect(() => {

    let mounted = true;

    const initializeConversation =
      async () => {

        try {

          console.log(
            '🔵 CREATING CONVERSATION...'
          );

          const conversation =
            await createConversation({
              title: 'Voice Conversation',
            });

          console.log(
            '🟢 CONVERSATION CREATED:',
            conversation
          );

          if (!mounted) {
            return;
          }

          setConversationId(
            conversation.id
          );

          pushTimeline(
            'Conversation created',
            'system'
          );

        } catch (error) {

          console.error(
            '🔴 FAILED TO CREATE CONVERSATION:',
            error
          );

          if (!mounted) {
            return;
          }

          pushTimeline(
            'Failed to create conversation',
            'alert'
          );

        }

      };


    initializeConversation();


    return () => {
      mounted = false;
    };

  }, [pushTimeline]);


  // --------------------------------------------------
  // LOAD TTS VOICES
  // --------------------------------------------------

  useEffect(() => {

    const loadVoices =
      async () => {

        try {

          console.log(
            '🔵 LOADING TTS VOICES...'
          );

          const voices =
            await fetchTTSVoices();

          console.log(
            '🟢 TTS VOICES:',
            voices
          );

          if (
            voices &&
            voices.length > 0
          ) {

            setTtsVoice(
              voices[0].id
            );

            console.log(
              '🟢 SELECTED TTS VOICE:',
              voices[0].id
            );

            pushTimeline(
              `TTS voice selected: ${voices[0].id}`,
              'system'
            );

          }

        } catch (error) {

          console.error(
            '🔴 FAILED TO LOAD TTS VOICES:',
            error
          );

          pushTimeline(
            'Failed to load TTS voices',
            'alert'
          );

        }

      };


    loadVoices();

  }, [pushTimeline]);


  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {

    return () => {

      streamRef.current
        ?.getTracks()
        .forEach(
          (track) => track.stop()
        );

      audioCtxRef.current
        ?.close?.();

      if (audioRef.current) {

        audioRef.current.pause();

        audioRef.current.src = '';

      }

      if (audioUrlRef.current) {

        URL.revokeObjectURL(
          audioUrlRef.current
        );

        audioUrlRef.current = null;

      }

    };

  }, []);


  // --------------------------------------------------
  // POLL STT TRANSCRIPTION
  // --------------------------------------------------

  const pollTranscription =
    async (jobId) => {

      const maxAttempts = 30;


      for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
      ) {

        const result =
          await fetchTranscription(
            jobId
          );


        console.log(
          `🔵 STT STATUS [${attempt + 1}]:`,
          result.status
        );


        if (
          result.status === 'COMPLETED'
        ) {

          return result.transcript || '';

        }


        if (
          result.status === 'FAILED'
        ) {

          throw new Error(
            'STT transcription failed'
          );

        }


        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1000
            )
        );

      }


      throw new Error(
        'STT transcription timed out'
      );

    };


  // --------------------------------------------------
  // TTS PLAYBACK
  // --------------------------------------------------

  const startPlayback =
    useCallback(
      async (text) => {

        if (!text) {
          return;
        }


        const selectedVoice =
          ttsVoice || 'af_heart';


        try {

          console.log(
            '🔵 TTS REQUEST:',
            {
              text,
              voice: selectedVoice,
              language: 'en',
            }
          );


          setPlayback({
            playing: false,
            progress: 0,
            duration: 0,
          });


          if (audioRef.current) {

            audioRef.current.pause();

            audioRef.current.src = '';

          }


          if (audioUrlRef.current) {

            URL.revokeObjectURL(
              audioUrlRef.current
            );

            audioUrlRef.current = null;

          }


          const audioBlob =
            await synthesizeSpeech({

              text,

              voice: selectedVoice,

              language: 'en',

            });


          console.log(
            '🟢 TTS AUDIO RECEIVED:',
            audioBlob
          );


          const audioUrl =
            URL.createObjectURL(
              audioBlob
            );


          audioUrlRef.current =
            audioUrl;


          const audio =
            new Audio(audioUrl);


          audioRef.current =
            audio;


          audio.onloadedmetadata =
            () => {

              setPlayback((previous) => ({
                ...previous,
                duration:
                  Number.isFinite(
                    audio.duration
                  )
                    ? audio.duration
                    : 0,
              }));

            };


          audio.ontimeupdate =
            () => {

              setPlayback((previous) => ({
                ...previous,
                progress:
                  audio.currentTime,
              }));

            };


          audio.onplay =
            () => {

              setPlayback((previous) => ({
                ...previous,
                playing: true,
              }));

            };


          audio.onpause =
            () => {

              setPlayback((previous) => ({
                ...previous,
                playing: false,
              }));

            };


          audio.onended =
            () => {

              setPlayback((previous) => ({
                ...previous,
                playing: false,
                progress:
                  audio.duration ||
                  previous.duration,
              }));

              setStatus('idle');

            };


          await audio.play();


        } catch (error) {

          console.error(
            '🔴 TTS FAILED:',
            error
          );


          setPlayback((previous) => ({
            ...previous,
            playing: false,
          }));


          setStatus('idle');


          pushTimeline(
            `Text-to-speech failed: ${error.message}`,
            'alert'
          );

        }

      },
      [
        ttsVoice,
        pushTimeline,
      ]
    );


  // --------------------------------------------------
  // SEND MESSAGE TO CONVERSATION SERVICE
  //
  // IMPORTANT:
  //
  // Conversation Service is already responsible for
  // calling the LLM.
  //
  // Frontend therefore does NOT call /llm/chat here.
  //
  // Flow:
  //
  // Frontend
  //    ↓
  // Conversation Service
  //    ↓
  // LLM Service
  //    ↓
  // Assistant response
  //
  // --------------------------------------------------

  const respondTo =
    useCallback(
      async (userText) => {

        if (!conversationId) {

          console.error(
            '🔴 NO CONVERSATION ID'
          );

          pushTimeline(
            'Conversation is not ready',
            'alert'
          );

          return;

        }


        if (!userText?.trim()) {
          return;
        }


        try {

          setStatus('thinking');


          pushTimeline(
            'Sending message to Conversation Service',
            'system'
          );


          console.log(
            '🔵 SENDING MESSAGE:',
            {
              conversationId,
              content: userText,
            }
          );


          const response =
            await sendConversationMessage(
              conversationId,
              {
                role: 'user',
                content: userText,
              }
            );


          console.log(
            '🟢 CONVERSATION RESPONSE:',
            response
          );


          const reply =
            response?.content;


          if (!reply) {

            throw new Error(
              'Conversation Service returned an empty response'
            );

          }


          setMessages(
            (previous) => [
              ...previous,
              {
                speaker: 'ai',
                text: reply,
                ts: nowTs(),
              },
            ]
          );


          setLastAiMessage(
            reply
          );


          pushTimeline(
            'Response generated by LLM',
            'system'
          );


          setStatus('speaking');


          pushTimeline(
            'Sending response to TTS',
            'system'
          );


          await startPlayback(
            reply
          );


          pushTimeline(
            'TTS playback completed',
            'system'
          );


        } catch (error) {

          console.error(
            '🔴 CONVERSATION FAILED:',
            error
          );


          setStatus('idle');


          pushTimeline(
            `Conversation request failed: ${error.message}`,
            'alert'
          );

        }

      },
      [
        conversationId,
        pushTimeline,
        startPlayback,
      ]
    );


  // --------------------------------------------------
  // MICROPHONE RECORDING
  // --------------------------------------------------

  const simulateListening =
    useCallback(
      async () => {

        try {

          const stream =
            await navigator.mediaDevices
              .getUserMedia({
                audio: true,
              });


          streamRef.current =
            stream;


          const mimeType =
            MediaRecorder.isTypeSupported(
              'audio/webm;codecs=opus'
            )
              ? 'audio/webm;codecs=opus'
              : 'audio/webm';


          const mediaRecorder =
            new MediaRecorder(
              stream,
              {
                mimeType,
              }
            );


          mediaRecorderRef.current =
            mediaRecorder;


          audioChunksRef.current =
            [];


          mediaRecorder.ondataavailable =
            (event) => {

              if (
                event.data.size > 0
              ) {

                audioChunksRef.current.push(
                  event.data
                );

              }

            };


          mediaRecorder.onstop =
            async () => {

              try {

                setStatus('thinking');


                pushTimeline(
                  'Recording stopped',
                  'system'
                );


                const audioBlob =
                  new Blob(
                    audioChunksRef.current,
                    {
                      type: mimeType,
                    }
                  );


                const audioFile =
                  new File(
                    [audioBlob],
                    'voice-input.webm',
                    {
                      type: mimeType,
                    }
                  );


                console.log(
                  '🔵 UPLOADING AUDIO:',
                  audioFile.size,
                  'bytes'
                );


                pushTimeline(
                  'Audio uploaded to STT service',
                  'system'
                );


                const job =
                  await uploadAudio(
                    audioFile
                  );


                console.log(
                  '🟢 STT JOB CREATED:',
                  job
                );


                pushTimeline(
                  `STT job created: ${job.job_id}`,
                  'system'
                );


                const transcript =
                  await pollTranscription(
                    job.job_id
                  );


                console.log(
                  '🟢 TRANSCRIPTION:',
                  transcript
                );


                if (
                  !transcript?.trim()
                ) {

                  setStatus('idle');


                  pushTimeline(
                    'No speech detected',
                    'alert'
                  );


                  return;

                }


                setMessages(
                  (previous) => [
                    ...previous,
                    {
                      speaker: 'user',
                      text: transcript,
                      ts: nowTs(),
                    },
                  ]
                );


                pushTimeline(
                  'Speech transcribed',
                  'system'
                );


                setLiveCaption('');


                await respondTo(
                  transcript
                );


              } catch (error) {

                console.error(
                  '🔴 STT FAILED:',
                  error
                );


                setStatus('idle');


                pushTimeline(
                  `Speech transcription failed: ${error.message}`,
                  'alert'
                );

              }

            };


          mediaRecorder.start();


          setStatus(
            'listening'
          );


          pushTimeline(
            'Recording started',
            'system'
          );


        } catch (error) {

          console.error(
            '🔴 MICROPHONE ERROR:',
            error
          );


          setStatus('idle');


          pushTimeline(
            `Microphone access failed: ${error.message}`,
            'alert'
          );

        }

      },
      [
        pushTimeline,
        respondTo,
      ]
    );


  // --------------------------------------------------
  // STOP MICROPHONE
  // --------------------------------------------------

  const stopMic = () => {

    streamRef.current
      ?.getTracks()
      .forEach(
        (track) => track.stop()
      );


    audioCtxRef.current
      ?.close?.();


    streamRef.current =
      null;


    audioCtxRef.current =
      null;


    analyserRef.current =
      null;


    setAnalyserNode(
      null
    );

  };


  // --------------------------------------------------
  // MICROPHONE BUTTON
  // --------------------------------------------------

  const handleMicClick = () => {

    if (!conversationId) {

      console.warn(
        'Conversation is still being initialized.'
      );


      pushTimeline(
        'Conversation is still initializing',
        'alert'
      );


      return;

    }


    if (status === 'listening') {

      mediaRecorderRef.current
        ?.stop();


      streamRef.current
        ?.getTracks()
        .forEach(
          (track) =>
            track.stop()
        );


      streamRef.current =
        null;


      return;

    }


    if (status === 'idle') {

      simulateListening();

    }

  };


  // --------------------------------------------------
  // PLAY / PAUSE AUDIO
  // --------------------------------------------------

  const togglePlayback =
    () => {

      const audio =
        audioRef.current;


      if (!audio) {
        return;
      }


      if (audio.paused) {

        audio.play();

      } else {

        audio.pause();

      }

    };


  // --------------------------------------------------
  // RESTART AUDIO
  // --------------------------------------------------

  const restartPlayback =
    () => {

      const audio =
        audioRef.current;


      if (!audio) {

        if (lastAiMessage) {

          startPlayback(
            lastAiMessage
          );

        }

        return;

      }


      audio.currentTime =
        0;


      audio.play();

    };


  // --------------------------------------------------
  // PAUSE / RESUME
  // --------------------------------------------------

  const handlePause =
    () => {

      const audio =
        audioRef.current;


      if (
        status === 'listening'
      ) {

        return;

      }


      if (
        status === 'speaking'
      ) {

        audio?.pause();


        setStatus(
          'paused'
        );


        pushTimeline(
          'Conversation paused',
          'alert'
        );


        return;

      }


      if (
        status === 'paused'
      ) {

        audio?.play();


        setStatus(
          'speaking'
        );


        pushTimeline(
          'Conversation resumed',
          'system'
        );

      }

    };


  // --------------------------------------------------
  // STOP SESSION
  // --------------------------------------------------

  const handleStop =
    () => {

      stopMic();


      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          'inactive'
      ) {

        mediaRecorderRef.current.stop();

      }


      if (
        audioRef.current
      ) {

        audioRef.current.pause();

        audioRef.current.currentTime =
          0;

      }


      setLiveCaption('');


      setStatus(
        'idle'
      );


      setPlayback(
        (previous) => ({
          ...previous,
          playing: false,
          progress: 0,
        })
      );


      pushTimeline(
        'Session stopped',
        'alert'
      );

    };


  // --------------------------------------------------
  // RESTART SESSION
  // --------------------------------------------------

  const handleRestart =
    () => {

      stopMic();


      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          'inactive'
      ) {

        mediaRecorderRef.current.stop();

      }


      if (
        audioRef.current
      ) {

        audioRef.current.pause();

        audioRef.current.currentTime =
          0;

      }


      setMessages([]);


      setLiveCaption('');


      setLastAiMessage(
        null
      );


      setPlayback({
        playing: false,
        progress: 0,
        duration: 0,
      });


      setStatus(
        'idle'
      );


      setTimelineEvents([
        {
          type: 'system',
          label: 'Session restarted',
          ts: nowTs(),
        },
      ]);

    };


  // --------------------------------------------------
  // TEXT INPUT
  // --------------------------------------------------

  const handleTypeSubmit =
    async (event) => {

      event.preventDefault();


      const text =
        typedInput.trim();


      if (!text) {
        return;
      }


      if (!conversationId) {

        pushTimeline(
          'Conversation is still initializing',
          'alert'
        );


        return;

      }


      setMessages(
        (previous) => [
          ...previous,
          {
            speaker: 'user',
            text,
            ts: nowTs(),
          },
        ]
      );


      pushTimeline(
        'Message sent via text input',
        'system'
      );


      setTypedInput('');


      await respondTo(
        text
      );

    };


  // --------------------------------------------------
  // STATUS LABEL
  // --------------------------------------------------

  const statusLabel = {

    idle:
      conversationId
        ? 'Tap the microphone to start speaking'
        : 'Connecting...',

    listening:
      'Listening…',

    thinking:
      'Thinking…',

    speaking:
      'Speaking response…',

    paused:
      'Conversation paused',

  }[status];


  const progressPct =
    playback.duration
      ? Math.min(
          100,
          (
            playback.progress /
            playback.duration
          ) * 100
        )
      : 0;


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="container-page">

      {/* HEADER */}

      <div className="conv-header">

        <div className="conv-persona">

          <span className="conv-persona-avatar">
            BA
          </span>

          <div>

            <div className="conv-persona-name">
              Banking Assistant
            </div>

            <div className="conv-persona-sub">
              Northfield Bank · English (US)
              {' · '}
              Voice: {ttsVoice || 'Loading...'}
            </div>

          </div>

        </div>


        <div className="conn-status">

          <span className="conn-dot" />

          {conversationId
            ? 'Connected'
            : 'Connecting...'}

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="conv-grid">

        {/* LEFT */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >

          {/* VOICE CARD */}

          <Card padded={false}>

            <div className="conv-stage">

              <div className="conv-stage-waveform">

                <Waveform
                  analyser={analyserNode}
                  active={
                    status === 'listening' ||
                    status === 'speaking'
                  }
                  speaking={
                    status === 'speaking'
                  }
                />

              </div>


              <MicButton
                status={
                  status === 'paused'
                    ? 'idle'
                    : status
                }
                onClick={
                  handleMicClick
                }
              />


              <div className="conv-stage-status">

                {statusLabel}

              </div>


              <div className="conv-controls">

                <button
                  className="conv-control-btn"
                  onClick={handlePause}
                  disabled={
                    status === 'idle'
                  }
                  title={
                    status === 'paused'
                      ? 'Resume'
                      : 'Pause'
                  }
                  aria-label="Pause or resume"
                >

                  {status === 'paused'
                    ? (
                      <IconPlay
                        width={17}
                        height={17}
                      />
                    )
                    : (
                      <IconPause
                        width={17}
                        height={17}
                      />
                    )}

                </button>


                <button
                  className="conv-control-btn"
                  onClick={handleStop}
                  disabled={
                    status === 'idle'
                  }
                  title="Stop"
                  aria-label="Stop"
                >

                  <IconStop
                    width={16}
                    height={16}
                  />

                </button>


                <button
                  className="conv-control-btn"
                  onClick={handleRestart}
                  title="Restart conversation"
                  aria-label="Restart"
                >

                  <IconRestart
                    width={17}
                    height={17}
                  />

                </button>

              </div>


              {/* TEXT INPUT */}

              <form
                className="conv-type-row"
                onSubmit={
                  handleTypeSubmit
                }
              >

                <Input
                  placeholder="Or type a message instead…"
                  value={
                    typedInput
                  }
                  onChange={(event) =>
                    setTypedInput(
                      event.target.value
                    )
                  }
                />


                <Button
                  type="submit"
                  variant="secondary"
                  icon={
                    <IconSend
                      width={15}
                      height={15}
                    />
                  }
                >
                  Send
                </Button>

              </form>

            </div>

          </Card>


          {/* TIMELINE */}

          <Card
            title="Conversation timeline"
            subtitle="System events for this session"
          >

            <Timeline
              events={
                timelineEvents
              }
            />

          </Card>

        </div>


        {/* RIGHT */}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >

          {/* TRANSCRIPT */}

          <Card
            title="Live transcript"
            subtitle="What's been said so far"
            className="conv-transcript-card"
          >

            <TranscriptPanel
              messages={
                messages
              }
              liveCaption={
                liveCaption
              }
            />

          </Card>


          {/* AI RESPONSE */}

          <Card
            title="AI response"
            subtitle="Latest generated reply"
          >

            {lastAiMessage ? (

              <>

                <p className="ai-response-text">

                  {lastAiMessage}

                </p>


                <div className="player-row">

                  <button
                    className="conv-control-btn"
                    onClick={
                      togglePlayback
                    }
                    aria-label={
                      playback.playing
                        ? 'Pause playback'
                        : 'Play response'
                    }
                  >

                    {playback.playing
                      ? (
                        <IconPause
                          width={15}
                          height={15}
                        />
                      )
                      : (
                        <IconPlay
                          width={15}
                          height={15}
                        />
                      )}

                  </button>


                  <div
                    className="player-progress"
                    onClick={
                      (event) => {

                        const audio =
                          audioRef.current;


                        if (!audio) {
                          return;
                        }


                        const rect =
                          event.currentTarget
                            .getBoundingClientRect();


                        const pct =
                          (
                            event.clientX -
                            rect.left
                          ) /
                          rect.width;


                        audio.currentTime =
                          pct *
                          audio.duration;

                      }
                    }
                  >

                    <div
                      className="player-progress-fill"
                      style={{
                        width:
                          `${progressPct}%`,
                      }}
                    />

                  </div>


                  <span className="player-time">

                    {playback.progress.toFixed(0)}
                    s /{' '}
                    {playback.duration.toFixed(0)}
                    s

                  </span>


                  <button
                    className="conv-control-btn"
                    onClick={
                      restartPlayback
                    }
                    aria-label="Restart playback"
                  >

                    <IconRestart
                      width={14}
                      height={14}
                    />

                  </button>

                </div>

              </>

            ) : (

              <p className="ai-response-empty">

                The assistant&apos;s next spoken reply
                will appear here with playback controls.

              </p>

            )}

          </Card>

        </div>

      </div>

    </div>

  );

}

