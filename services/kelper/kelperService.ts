import { API_BASE_URL } from '@env';

import { authenticatedFetch } from '../auth/apiClient';
import type { KelperChatRequest, KelperChatResponse } from '../../types/kelper';

const BASE_URL = (API_BASE_URL || 'https://your-api-server.com/api').replace(/\/+$/, '');

function buildUrl(path: string) {
  const normalizedPath = path.replace(/^\/+/, '');
  return `${BASE_URL}/${normalizedPath}`;
}

export async function requestKelperChat(
  payload: KelperChatRequest,
): Promise<KelperChatResponse> {
  const url = buildUrl('/ai/kelper/chat');
  const body = JSON.stringify(payload);
  console.log('[KelperService] requestKelperChat payload:', body);

  const response = await authenticatedFetch(url, {
    method: 'POST',
    body,
  });

  console.log('[KelperService] requestKelperChat status:', response.status, response.statusText);

  const raw = await response.text();
  if (!response.ok) {
    console.error('[KelperService] requestKelperChat error body:', raw);
    throw new Error(raw || response.statusText || String(response.status));
  }

  if (!raw) {
    console.log('[KelperService] requestKelperChat: empty body');
    return {};
  }

  try {
    const data = JSON.parse(raw) as KelperChatResponse;
    console.log('[KelperService] requestKelperChat response:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('[KelperService] requestKelperChat parse error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}
