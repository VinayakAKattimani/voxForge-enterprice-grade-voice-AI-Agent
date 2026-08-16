import { apiRequest } from './client';

export async function generateChatResponse({
  conversationId,
  messages,
}) {
  return apiRequest('/api/v1/llm/chat', {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: conversationId,
      messages,
    }),
  });
}