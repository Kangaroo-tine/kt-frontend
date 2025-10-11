import { API_BASE_URL } from '@env';

import { authenticatedFetch } from '../auth/apiClient';
import type {
  CreateGoalDraftRequest,
  CreateGoalDraftResponse,
} from '../../types/goal';

const BASE_URL = API_BASE_URL || 'https://your-api-server.com/api';

export async function createGoalDraft(
  payload: CreateGoalDraftRequest,
): Promise<CreateGoalDraftResponse> {
  console.log('[GoalService] createGoalDraft payload:', JSON.stringify(payload));

  const response = await authenticatedFetch(`${BASE_URL}/goal-drafts`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[GoalService] Failed to create goal draft: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();

  console.log('[GoalService] createGoalDraft raw response:', raw || '(empty body)');

  if (!raw) {
    return {};
  }

  try {
    const data = JSON.parse(raw) as CreateGoalDraftResponse;
    console.log(
      '[GoalService] createGoalDraft parsed response:',
      JSON.stringify(data),
    );
    return data;
  } catch (parseError) {
    throw new Error(
      `[GoalService] Invalid goal draft response: ${
        parseError instanceof Error ? parseError.message : 'Unknown error'
      }`,
    );
  }
}
