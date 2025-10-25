export interface ScheduleGoalSummary {
  goalId?: number | string;
  goalTitle?: string;
  category?: string;
  [key: string]: unknown;
}

export interface ScheduleSubgoalSummary {
  subgoalId?: number | string;
  subgoalTitle?: string;
  title?: string;
  [key: string]: unknown;
}

export interface ScheduleListItem {
  scheduleId?: number | string;
  title?: string;
  goal?: ScheduleGoalSummary;
  subgoal?: ScheduleSubgoalSummary;
  date?: string;
  startTime?: string;
  endTime?: string;
  [key: string]: unknown;
}

export interface ScheduleListResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: ScheduleListItem[];
  [key: string]: unknown;
}

export interface MonthScheduleAvailability {
  date?: string;
  hasSchedule?: boolean;
  [key: string]: unknown;
}

export interface MonthScheduleResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: MonthScheduleAvailability[];
  [key: string]: unknown;
}

export interface CreateScheduleRequest {
  goalId?: number | string;
  subgoalId?: number | string;
  title?: string;
  localDate?: string;
  startTime?: string;
  endTime?: string;
  recurrenceDays?: string[];
  [key: string]: unknown;
}

export interface CreateScheduleResult {
  recurrenceGroupId?: number | string;
  scheduleIds?: Array<number | string>;
  title?: string;
  recurrenceDays?: string[];
  startTime?: string;
  endTime?: string;
  baseDate?: string;
  [key: string]: unknown;
}

export interface CreateScheduleResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: CreateScheduleResult;
  [key: string]: unknown;
}

export interface DeleteScheduleResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: string;
  [key: string]: unknown;
}
