export enum LicenseType {
  RIGHTS_MANAGED = 'RIGHTS_MANAGED',
  ROYALTY_FREE = 'ROYALTY_FREE',
  EDITORIAL_ONLY = 'EDITORIAL_ONLY',
  PERSONAL_USE = 'PERSONAL_USE',
  CUSTOM = 'CUSTOM'
}

export enum UsageType {
  COMMERCIAL = 'COMMERCIAL',
  EDITORIAL = 'EDITORIAL',
  PERSONAL = 'PERSONAL',
  ADVERTISING = 'ADVERTISING',
  WEB = 'WEB',
  PRINT = 'PRINT'
}

export interface Photo {
    id: string;
    url: string;
    title: string;
    category: string;
    aspectRatio: number; // width / height
    description?: string;
    licenseType?: LicenseType;
  }
  
  export enum Theme {
    MONOCHROME = 'MONOCHROME',  // Dark background + monochrome images
    VIBRANT = 'VIBRANT'         // Light background + colorful images
  }
  