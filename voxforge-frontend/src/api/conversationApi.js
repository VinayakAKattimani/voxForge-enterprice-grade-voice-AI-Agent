import { apiRequest } from './client';

export async function fetchConversations() {
  return apiRequest('/api/v1/conversations', {
    method: 'GET',
  });
}

export async function fetchConversation(conversationId) {
  return apiRequest(
    `/api/v1/conversations/${conversationId}`,
    {
      method: 'GET',
    }
  );
}

export async function createConversation(payload) {
  return apiRequest('/api/v1/conversations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateConversation(
  conversationId,
  payload
) {
  return apiRequest(
    `/api/v1/conversations/${conversationId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }
  );
}

export async function fetchConversationMessages(
  conversationId
) {
  return apiRequest(
    `/api/v1/conversations/${conversationId}/messages`,
    {
      method: 'GET',
    }
  );
}

export async function sendConversationMessage(
  conversationId,
  payload
) {
  return apiRequest(
    `/api/v1/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );
}