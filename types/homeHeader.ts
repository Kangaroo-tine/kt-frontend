export type EmotionType = 'HAPPY' | 'SAD' | 'NEUTRAL';

export type Header = {
  userName: string;
  mission_count: number;
  mission_complete: number;
  date: string; //나중에 데이터 타입 DATE로 바꿔야함
  daily_emotion: EmotionType | null;
};