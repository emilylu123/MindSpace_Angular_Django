export interface Record {
  id: string;
  emotion: string;
  posted_date: string;
  post?: string;
  trigger_keyword_frequency?: [{ keyword: string; frequency: number }];
}
