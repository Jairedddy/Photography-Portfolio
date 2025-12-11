export interface Photo {
    id: string;
    url: string;
    title: string;
    category: string;
    aspectRatio: number; // width / height
    description?: string;
  }
  
  export enum Theme {
    MONOCHROME = 'MONOCHROME',  // Dark background + monochrome images
    VIBRANT = 'VIBRANT'         // Light background + colorful images
  }
  