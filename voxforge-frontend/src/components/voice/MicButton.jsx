import { IconMic, IconStop } from '../ui/icons';
import './voice.css';

export default function MicButton({ status, onClick }) {
  // status: 'idle' | 'listening' | 'thinking' | 'speaking'
  const isRecording = status === 'listening';

  return (
    <button
      className={`mic-button mic-${status}`}
      onClick={onClick}
      aria-pressed={isRecording}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      <span className="mic-ring mic-ring-1" />
      <span className="mic-ring mic-ring-2" />
      <span className="mic-core">
        {isRecording ? <IconStop width={26} height={26} /> : <IconMic width={30} height={30} />}
      </span>
    </button>
  );
}
