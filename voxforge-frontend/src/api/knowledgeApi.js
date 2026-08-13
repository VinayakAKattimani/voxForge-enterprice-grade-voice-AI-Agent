import { apiRequest } from './client';

export async function fetchKnowledgeDocuments() {
  return apiRequest('/knowledge/documents', {
    method: 'GET',
  });
}

export async function uploadKnowledgeDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest('/knowledge/documents', {
    method: 'POST',
    body: formData,
  });
}