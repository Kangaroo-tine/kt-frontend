export type GoalCategory =
  | 'LEARNING'
  | 'LIFE'
  | 'EXERCISE'
  | 'ASSIGNMENT'
  | 'RELATIONSHIP'
  | 'SELF_DEVELOPMENT';

export interface CreateGoalDraftRequest {
  category: GoalCategory;
}

export interface GoalDraftResult {
  goalDraftId?: number | string;
}

export interface CreateGoalDraftResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: GoalDraftResult;
  [key: string]: unknown;
}
