import type { GoalCategory } from './goal';

export interface GoalsRibbonGoal {
  id: number | string;
  title?: string;
  category: GoalCategory | string;
  progress?: number;
  [key: string]: unknown;
}

export interface GoalsRibbonResponse {
  code?: string;
  message?: string;
  result?: GoalsRibbonGoal[];
  success?: boolean;
  [key: string]: unknown;
}

export interface GoalSubgoal {
  id?: number | string;
  subgoalId?: number | string;
  goalId?: number | string;
  title?: string;
  status?: string;
  completed?: boolean;
  [key: string]: unknown;
}

export interface GoalSubgoalResponse {
  code?: string;
  message?: string;
  result?: GoalSubgoal[];
  success?: boolean;
  [key: string]: unknown;
}

export interface CompleteSubgoalResult {
  id?: number | string;
  status?: string;
  parentGoalProgress?: number;
  [key: string]: unknown;
}

export interface CompleteSubgoalResponse {
  code?: string;
  message?: string;
  result?: CompleteSubgoalResult;
  success?: boolean;
  [key: string]: unknown;
}

export interface HomeUsernameResult {
  nickname?: string;
  [key: string]: unknown;
}

export interface HomeUsernameResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: HomeUsernameResult;
  [key: string]: unknown;
}
