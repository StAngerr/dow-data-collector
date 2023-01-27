// 5 highest priority
export type ImportanceLevel = 1 | 2 | 3 | 4 | 5;

export enum DataSourcesEnum {
  pravda = "pravda",
}

export interface Article {
  id: string;
  title: string;
  url: string;
  fullDate?: string; // MM-DD-YYYY HH:mm
  time: string;
  date: string; // MM-DD-YYYY
  level: ImportanceLevel;
  source: DataSourcesEnum;
}
