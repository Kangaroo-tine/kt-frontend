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
  draftGoalId?: number | string;
}

export interface CreateGoalDraftResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: GoalDraftResult;
  [key: string]: unknown;
}

export interface UpdateGoalDraftTitleRequest {
  title: string;
}

export interface PreviewSubGoalResponseItem {
  id: string | number;
  title: string;
}

export interface PreviewSubGoal {
  id: string;
  title: string;
}

export interface PreviewSubGoalResponse {
  code?: string;
  message?: string;
  result?: PreviewSubGoalResponseItem[];
  success?: boolean;
  [key: string]: unknown;
}

export interface ManualSubGoalRequest {
  title: string;
}

export interface ManualSubGoalResponseItem {
  id: string | number;
  title: string;
}

export interface ManualSubGoalResponse {
  code?: string;
  message?: string;
  result?: ManualSubGoalResponseItem;
  success?: boolean;
  [key: string]: unknown;
}

export interface SelectedSubGoalsRequest {
  selectedPreviewIds: string[];
}

export interface SelectedSubGoalsResponseItem {
  id: string | number;
  title: string;
}

export interface SelectedSubGoalsResponse {
  code?: string;
  message?: string;
  result?: {
    draftId?: string | number;
    selected?: SelectedSubGoalsResponseItem[];
  };
  success?: boolean;
  [key: string]: unknown;
}

export interface CommitGoalDraftResponseItem {
  goalId?: number | string;
  title?: string;
  category?: GoalCategory;
  subgoals?: {
    subgoalId?: number | string;
    title?: string;
  }[];
}

export interface CommitGoalDraftResponse {
  code?: string;
  message?: string;
  result?: CommitGoalDraftResponseItem;
  success?: boolean;
  [key: string]: unknown;
}
