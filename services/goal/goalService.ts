import { API_BASE_URL } from '@env';

import { authenticatedFetch } from '../auth/apiClient';
import type {
  CreateGoalDraftRequest,
  CreateGoalDraftResponse,
  UpdateGoalDraftTitleRequest,
  PreviewSubGoal,
  PreviewSubGoalResponse,
  PreviewSubGoalResponseItem,
  ManualSubGoalRequest,
  ManualSubGoalResponse,
  SelectedSubGoalsRequest,
  SelectedSubGoalsResponse,
  CommitGoalDraftResponse,
  GoalSubgoalResponse,
  GoalSubgoal,
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
    if (data?.result) {
      const { draftGoalId, goalDraftId } = data.result;
      if (draftGoalId !== undefined && goalDraftId === undefined) {
        data.result.goalDraftId = draftGoalId;
      }
    }
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

export async function updateGoalDraftTitle(
  draftId: number | string,
  payload: UpdateGoalDraftTitleRequest,
): Promise<void> {
  const resolvedDraftId = encodeURIComponent(String(draftId));
  console.log(
    `[GoalService] updateGoalDraftTitle draftId=${resolvedDraftId}, payload=${JSON.stringify(payload)}`,
  );

  const response = await authenticatedFetch(
    `${BASE_URL}/goal-drafts/${resolvedDraftId}/title`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[GoalService] Failed to update goal title: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();

  if (raw) {
    console.log('[GoalService] updateGoalDraftTitle response:', raw);
  } else {
    console.log('[GoalService] updateGoalDraftTitle response: (empty body)');
  }
}

export async function fetchPreviewSubGoals(
  draftId: number | string,
): Promise<PreviewSubGoal[]> {
  const resolvedDraftId = encodeURIComponent(String(draftId));
  console.log(`[GoalService] fetchPreviewSubGoals draftId=${resolvedDraftId}`);

  const response = await authenticatedFetch(
    `${BASE_URL}/goal-drafts/${resolvedDraftId}/preview-subgoals`,
    {
      method: 'POST',
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[GoalService] Failed to fetch preview subgoals: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();
  if (!raw) {
    console.log('[GoalService] fetchPreviewSubGoals response: (empty body)');
    return [];
  }

  try {
    const data = JSON.parse(raw) as PreviewSubGoalResponse;
    console.log(
      '[GoalService] fetchPreviewSubGoals parsed response:',
      JSON.stringify(data),
    );
    const items = Array.isArray(data.result) ? data.result : [];
    return items
      .filter(
        (goal): goal is PreviewSubGoalResponseItem =>
          !!goal && typeof goal.title === 'string' && goal.id !== undefined,
      )
      .map((goal) => ({
        id: String(goal.id),
        title: goal.title,
      }));
  } catch (error) {
    throw new Error(
      `[GoalService] Invalid preview subgoal response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

export async function createManualSubGoal(
  draftId: number | string,
  payload: ManualSubGoalRequest,
): Promise<PreviewSubGoal | null> {
  const resolvedDraftId = encodeURIComponent(String(draftId));
  console.log(
    `[GoalService] createManualSubGoal draftId=${resolvedDraftId}, payload=${JSON.stringify(payload)}`,
  );

  const response = await authenticatedFetch(
    `${BASE_URL}/goal-drafts/${resolvedDraftId}/manual-subgoals`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[GoalService] Failed to create manual subgoal: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();
  if (!raw) {
    console.log('[GoalService] createManualSubGoal response: (empty body)');
    return null;
  }

  try {
    const data = JSON.parse(raw) as ManualSubGoalResponse;
    console.log(
      '[GoalService] createManualSubGoal parsed response:',
      JSON.stringify(data),
    );
    const result = data.result;
    if (!result || result.id === undefined || typeof result.title !== 'string') {
      return null;
    }
    return {
      id: String(result.id),
      title: result.title,
    };
  } catch (error) {
    throw new Error(
      `[GoalService] Invalid manual subgoal response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

export async function fetchGoalSubGoals(
  goalId: number | string,
  sort: string = 'CREATED_AT',
): Promise<GoalSubgoal[]> {
  const resolvedGoalId = encodeURIComponent(String(goalId));
  console.log(
    `[GoalService] fetchGoalSubGoals goalId=${resolvedGoalId}, sort=${sort}`,
  );

  const response = await authenticatedFetch(
    `${BASE_URL}/goals/${resolvedGoalId}/subgoals?sort=${encodeURIComponent(sort)}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      console.log('[GoalService] fetchGoalSubGoals 404: no subgoals found');
      return [];
    }
    const errorText = await response.text();
    throw new Error(
      `[GoalService] Failed to fetch goal subgoals: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();
  if (!raw) {
    console.log('[GoalService] fetchGoalSubGoals response: (empty body)');
    return [];
  }

  try {
    const data = JSON.parse(raw) as GoalSubgoalResponse;
    console.log(
      '[GoalService] fetchGoalSubGoals parsed response:',
      JSON.stringify(data),
    );
    const result = Array.isArray(data?.result) ? data.result : data;
    if (Array.isArray(result)) {
      return result.map((item) => ({
        id: item.id ?? item.subgoalId,
        subgoalId: item.subgoalId ?? item.id,
        goalId: item.goalId,
        title: item.title ?? item.subgoalTitle,
        status: item.status,
        completed: item.completed,
      }));
    }
    if (Array.isArray((data as GoalSubgoalResponse)?.result)) {
      return data.result ?? [];
    }
    return [];
  } catch (error) {
    throw new Error(
      `[GoalService] Invalid goal subgoal response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

export async function updateSelectedSubGoals(
  draftId: number | string,
  payload: SelectedSubGoalsRequest,
): Promise<void> {
  const resolvedDraftId = encodeURIComponent(String(draftId));
  console.log(
    `[GoalService] updateSelectedSubGoals draftId=${resolvedDraftId}, payload=${JSON.stringify(payload)}`,
  );

  const response = await authenticatedFetch(
    `${BASE_URL}/goal-drafts/${resolvedDraftId}/selected-subgoals`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[GoalService] Failed to update selected subgoals: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();
  if (raw) {
    try {
      const data = JSON.parse(raw) as SelectedSubGoalsResponse;
      console.log(
        '[GoalService] updateSelectedSubGoals parsed response:',
        JSON.stringify(data),
      );
    } catch (error) {
      throw new Error(
        `[GoalService] Invalid selected subgoals response: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  } else {
    console.log('[GoalService] updateSelectedSubGoals response: (empty body)');
  }
}

export async function commitGoalDraft(
  draftId: number | string,
): Promise<CommitGoalDraftResponse> {
  const resolvedDraftId = encodeURIComponent(String(draftId));
  console.log(`[GoalService] commitGoalDraft draftId=${resolvedDraftId}`);

  const response = await authenticatedFetch(
    `${BASE_URL}/goal-drafts/${resolvedDraftId}:commit`,
    {
      method: 'POST',
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[GoalService] Failed to commit goal draft: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();
  if (!raw) {
    console.log('[GoalService] commitGoalDraft response: (empty body)');
    return {};
  }

  try {
    const data = JSON.parse(raw) as CommitGoalDraftResponse;
    console.log(
      '[GoalService] commitGoalDraft parsed response:',
      JSON.stringify(data),
    );
    return data;
  } catch (error) {
    throw new Error(
      `[GoalService] Invalid commit goal draft response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}
