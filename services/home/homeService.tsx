import { API_BASE_URL } from '@env';

import { authenticatedFetch } from '../auth/apiClient';
import type {
  CompleteSubgoalResponse,
  CompleteSubgoalResult,
  GoalSubgoal,
  GoalSubgoalResponse,
  GoalsRibbonGoal,
  GoalsRibbonResponse,
  HomeUsernameResponse,
} from '../../types/home';

const BASE_URL = API_BASE_URL || 'https://your-api-server.com/api';

function sanitizeGoals(goals: GoalsRibbonGoal[] = []): GoalsRibbonGoal[] {
  return goals
    .filter(
      (goal): goal is GoalsRibbonGoal =>
        !!goal && goal.id !== undefined && typeof goal.category === 'string',
    )
    .map((goal) => ({
      ...goal,
      id: goal.id,
      title: typeof goal.title === 'string' ? goal.title : '',
      progress:
        typeof goal.progress === 'number'
          ? Number.isFinite(goal.progress)
            ? goal.progress
            : 0
          : 0,
    }));
}

function sanitizeSubgoals(subgoals: GoalSubgoal[] = []): GoalSubgoal[] {
  return subgoals
    .filter(
      (subgoal): subgoal is GoalSubgoal =>
        !!subgoal && (subgoal.id !== undefined || subgoal.subgoalId !== undefined),
    )
    .map((subgoal) => ({
      ...subgoal,
      id: subgoal.id ?? subgoal.subgoalId,
      title: typeof subgoal.title === 'string' ? subgoal.title : '',
      status: typeof subgoal.status === 'string' ? subgoal.status : undefined,
      completed:
        typeof subgoal.completed === 'boolean' ? subgoal.completed : undefined,
    }));
}

export async function fetchGoalsRibbon(): Promise<GoalsRibbonGoal[]> {
  console.log('[HomeService] fetchGoalsRibbon');

  const response = await authenticatedFetch(`${BASE_URL}/home/goals-ribbon`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[HomeService] Failed to fetch goals ribbon: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();

  if (!raw) {
    console.log('[HomeService] fetchGoalsRibbon response: (empty body)');
    return [];
  }

  try {
    const data = JSON.parse(raw) as GoalsRibbonResponse;
    console.log(
      '[HomeService] fetchGoalsRibbon parsed response:',
      JSON.stringify(data),
    );
    const items = Array.isArray(data.result) ? data.result : [];
    return sanitizeGoals(items);
  } catch (error) {
    throw new Error(
      `[HomeService] Invalid goals ribbon response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

export async function fetchGoalSubGoals(
  goalId: number | string,
  sort = 'CREATED_AT',
): Promise<GoalSubgoal[]> {
  const resolvedGoalId = encodeURIComponent(String(goalId));
  console.log(`[HomeService] fetchGoalSubGoals goalId=${resolvedGoalId}, sort=${sort}`);

  const response = await authenticatedFetch(
    `${BASE_URL}/goals/${resolvedGoalId}/subgoals?sort=${encodeURIComponent(sort)}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[HomeService] Failed to fetch goal subgoals: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();

  if (!raw) {
    console.log('[HomeService] fetchGoalSubGoals response: (empty body)');
    return [];
  }

  try {
    const data = JSON.parse(raw) as GoalSubgoalResponse;
    console.log(
      '[HomeService] fetchGoalSubGoals parsed response:',
      JSON.stringify(data),
    );
    const items = Array.isArray(data.result) ? data.result : [];
    return sanitizeSubgoals(items);
  } catch (error) {
    throw new Error(
      `[HomeService] Invalid goal subgoal response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

export async function completeHomeSubgoal(
  subgoalId: number | string,
): Promise<CompleteSubgoalResult | null> {
  const resolvedSubgoalId = encodeURIComponent(String(subgoalId));
  console.log(`[HomeService] completeHomeSubgoal subgoalId=${resolvedSubgoalId}`);

  const response = await authenticatedFetch(
    `${BASE_URL}/home/subgoals/${resolvedSubgoalId}:complete`,
    {
      method: 'POST',
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[HomeService] Failed to complete subgoal: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();

  if (!raw) {
    console.log('[HomeService] completeHomeSubgoal response: (empty body)');
    return null;
  }

  try {
    const data = JSON.parse(raw) as CompleteSubgoalResponse;
    console.log(
      '[HomeService] completeHomeSubgoal parsed response:',
      JSON.stringify(data),
    );
    return data.result ?? null;
  } catch (error) {
    throw new Error(
      `[HomeService] Invalid complete subgoal response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}

export async function fetchHomeUserName(): Promise<string | null> {
  console.log('[HomeService] fetchHomeUserName');

  const response = await authenticatedFetch(`${BASE_URL}/home/username`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[HomeService] Failed to fetch home username: ${response.status} ${errorText}`,
    );
  }

  const raw = await response.text();

  if (!raw) {
    console.log('[HomeService] fetchHomeUserName response: (empty body)');
    return null;
  }

  try {
    const data = JSON.parse(raw) as HomeUsernameResponse;
    console.log(
      '[HomeService] fetchHomeUserName parsed response:',
      JSON.stringify(data),
    );
    const nickname = data.result?.nickname;
    return typeof nickname === 'string' ? nickname : null;
  } catch (error) {
    throw new Error(
      `[HomeService] Invalid home username response: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );
  }
}
