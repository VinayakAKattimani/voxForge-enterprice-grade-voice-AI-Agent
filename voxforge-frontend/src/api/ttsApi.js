import { apiRequest } from './client';

export async function fetchTTSVoices() {
  return apiRequest('/api/v1/tts/voices', {
    method: 'GET',
  });
}

export async function synthesizeSpeech({
  text,
  voice,
  language = 'en',
}) {
  return apiRequest('/api/v1/tts/synthesize', {
    method: 'POST',
    body: JSON.stringify({
      text,
      voice,
      language,
    }),
  });
}