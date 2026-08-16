import { apiRequest } from './client';

export async function uploadAudio(file) {
  const formData = new FormData();

  formData.append('file', file);

  return apiRequest('/api/v1/stt/transcriptions/', {
    method: 'POST',
    body: formData,
  });
}

export async function fetchTranscription(jobId) {
  return apiRequest(`/api/v1/stt/transcriptions/${jobId}`, {
    method: 'GET',
  });
}