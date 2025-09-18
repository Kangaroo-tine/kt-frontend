export type MissionStatus = 'NOT_STARTED' | 'COMPLETED' | 'FAILED' | 'AWAITING_APPROVAL';

export type Mission = {
  id: bigint;
  title: string;
  description: string;
  description_photo?: boolean;
  requires_photo: boolean;
  mission_start_time: string;
  mission_end_time: string;
  status: MissionStatus;
  location?: { lat: number; lng: number };
};