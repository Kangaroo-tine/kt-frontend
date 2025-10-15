import { API_BASE_URL } from '@env';

import { authenticatedFetch } from '../auth/apiClient';
import type {
  CreateScheduleRequest,
  CreateScheduleResponse,
  DeleteScheduleResponse,
  MonthScheduleResponse,
  ScheduleListResponse,
} from '../../types/schedule';

const BASE_URL = (API_BASE_URL || 'https://your-api-server.com/api').replace(/\/+$/, '');

function buildUrl(path: string, query?: Record<string, string | number | undefined>) {
  const normalizedPath = path.replace(/^\/+/, '');
  const url = new URL(`${BASE_URL}/${normalizedPath}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function fetchSchedulesByDate(date: string): Promise<ScheduleListResponse> {
  console.log('[ScheduleService] fetchSchedulesByDate date:', date);

  const url = buildUrl('/schedules', { date });
  const response = await authenticatedFetch(url);

  console.log('[ScheduleService] fetchSchedulesByDate status:', response.status);

  if (!response.ok) {
    if (response.status === 404) {
      console.log('[ScheduleService] fetchSchedulesByDate 404: no schedules found');
      return {};
    }
    const errorText = await response.text();
    console.error('[ScheduleService] fetchSchedulesByDate error:', errorText);
    throw new Error(errorText || response.statusText || String(response.status));
  }

  if (response.status === 204) {
    return {};
  }

  const raw = await response.text();
  if (!raw) {
    return {};
  }

  try {
    const data = JSON.parse(raw) as ScheduleListResponse;
    console.log(
      '[ScheduleService] fetchSchedulesByDate response:',
      JSON.stringify(data),
    );
    return data;
  } catch (error) {
    console.error('[ScheduleService] fetchSchedulesByDate parse error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

export async function fetchMonthScheduleAvailability(
  year: number,
  month: number,
): Promise<MonthScheduleResponse> {
  console.log('[ScheduleService] fetchMonthScheduleAvailability year:', year, 'month:', month);

  const url = buildUrl('/schedules/month', { year, month });
  const response = await authenticatedFetch(url);

  console.log('[ScheduleService] fetchMonthScheduleAvailability status:', response.status);

  if (!response.ok) {
    if (response.status === 404) {
      console.log('[ScheduleService] fetchMonthScheduleAvailability 404: no availability data');
      return {};
    }
    const errorText = await response.text();
    console.error('[ScheduleService] fetchMonthScheduleAvailability error:', errorText);
    throw new Error(errorText || response.statusText || String(response.status));
  }

  if (response.status === 204) {
    return {};
  }

  const raw = await response.text();
  if (!raw) {
    return {};
  }

  try {
    const data = JSON.parse(raw) as MonthScheduleResponse;
    console.log(
      '[ScheduleService] fetchMonthScheduleAvailability response:',
      JSON.stringify(data),
    );
    return data;
  } catch (error) {
    console.error('[ScheduleService] fetchMonthScheduleAvailability parse error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

export async function createSchedule(
  payload: CreateScheduleRequest,
): Promise<CreateScheduleResponse> {
  console.log('[ScheduleService] createSchedule payload:', JSON.stringify(payload));

  const url = buildUrl('/schedules');
  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  console.log('[ScheduleService] createSchedule status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[ScheduleService] createSchedule error:', errorText);
    throw new Error(errorText || response.statusText || String(response.status));
  }

  if (response.status === 204) {
    return {};
  }

  const raw = await response.text();
  if (!raw) {
    return {};
  }

  try {
    const data = JSON.parse(raw) as CreateScheduleResponse;
    console.log('[ScheduleService] createSchedule response:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('[ScheduleService] createSchedule parse error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

export async function deleteSchedule(scheduleId: number | string): Promise<DeleteScheduleResponse> {
  const resolvedId = encodeURIComponent(String(scheduleId));
  console.log('[ScheduleService] deleteSchedule scheduleId:', resolvedId);

  const url = buildUrl(`/schedules/${resolvedId}`);
  const response = await authenticatedFetch(url, {
    method: 'DELETE',
  });

  console.log('[ScheduleService] deleteSchedule status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[ScheduleService] deleteSchedule error:', errorText);
    throw new Error(errorText || response.statusText || String(response.status));
  }

  if (response.status === 204) {
    return {};
  }

  const raw = await response.text();
  if (!raw) {
    return {};
  }

  try {
    const data = JSON.parse(raw) as DeleteScheduleResponse;
    console.log('[ScheduleService] deleteSchedule response:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('[ScheduleService] deleteSchedule parse error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}
