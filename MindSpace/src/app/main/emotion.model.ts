export interface Emotion {
  id: string;
  type: string;
  name: string;
  times: number;
  size?: string;
  trigger_keyword_frequency?: [{ keyword: string; frequency: number }];
}
