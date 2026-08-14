import { apiRequest } from './client';

export async function fetchKnowledgeDocuments() {
  return apiRequest('/api/v1/knowledge/documents', {
    method: 'GET',
  });
}

export async function uploadKnowledgeDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest('/api/v1/knowledge/documents', {
    method: 'POST',
    body: formData,
  });
}

export async function searchKnowledge(query) {
  return apiRequest('/api/v1/knowledge/search', {
    method: 'POST',
    body: JSON.stringify({
      query,
    }),
  });
}

export async function deleteKnowledgeDocument(documentId) {
  return apiRequest(`/api/v1/knowledge/documents/${documentId}`, {
    method: 'DELETE',
  });
}