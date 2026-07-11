import { useEffect, useRef } from 'react';
import EmptyState from '../ui/EmptyState';
import { IconMic } from '../ui/icons';
import './transcript.css';

export default function TranscriptPanel({ messages, liveCaption }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, liveCaption]);

  if (!messages.length && !liveCaption) {
    return (
      <EmptyState
        icon={<IconMic width={20} height={20} />}
        title="Nothing said yet"
        description="Tap the microphone or type a message below to start the conversation."
      />
    );
  }

  return (
    <div className="transcript-list">
      {messages.map((m, i) => (
        <div key={i} className={`transcript-msg ${m.speaker === 'user' ? 'from-user' : 'from-ai'}`}>
          <div className="transcript-bubble">
            <p>{m.text}</p>
          </div>
          <span className="transcript-ts">{m.ts}</span>
        </div>
      ))}
      {liveCaption && (
        <div className="transcript-msg from-user">
          <div className="transcript-bubble transcript-bubble-live">
            <p>{liveCaption}<span className="caret" /></p>
          </div>
          <span className="transcript-ts">listening…</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
