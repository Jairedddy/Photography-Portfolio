export interface Photo {
    id: string;
    url: string;
    title: string;
    category: string;
    aspectRatio: number; // width / height
    description?: string;
  }
  
  export enum Theme {
    LIGHT = 'LIGHT',
    DARK = 'DARK'
  }
  