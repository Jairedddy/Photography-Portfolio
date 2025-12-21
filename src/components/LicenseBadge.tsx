import React from 'react';
import { LicenseType, Theme } from '../types';

interface LicenseBadgeProps {
  licenseType: LicenseType;
  theme: Theme;
  className?: string;
}

const LicenseBadge: React.FC<LicenseBadgeProps> = ({ licenseType, theme, className = '' }) => {
  const getLicenseInfo = (type: LicenseType) => {
    if (theme === Theme.MONOCHROME) {
      // Monochrome theme: use black, white, and grayscale
      switch (type) {
        case LicenseType.RIGHTS_MANAGED:
          return { label: 'RM', color: 'bg-white/90', textColor: 'text-black' };
        case LicenseType.ROYALTY_FREE:
          return { label: 'RF', color: 'bg-neutral-300/90', textColor: 'text-black' };
        case LicenseType.EDITORIAL_ONLY:
          return { label: 'ED', color: 'bg-neutral-500/90', textColor: 'text-white' };
        case LicenseType.PERSONAL_USE:
          return { label: 'PU', color: 'bg-neutral-700/90', textColor: 'text-white' };
        case LicenseType.CUSTOM:
          return { label: 'C', color: 'bg-black/90', textColor: 'text-white' };
        default:
          return { label: '?', color: 'bg-neutral-500/90', textColor: 'text-white' };
      }
    } else {
      // Vibrant theme: use colors
      switch (type) {
        case LicenseType.RIGHTS_MANAGED:
          return { label: 'RM', color: 'bg-purple-500/90', textColor: 'text-white' };
        case LicenseType.ROYALTY_FREE:
          return { label: 'RF', color: 'bg-teal-500/90', textColor: 'text-white' };
        case LicenseType.EDITORIAL_ONLY:
          return { label: 'ED', color: 'bg-orange-500/90', textColor: 'text-white' };
        case LicenseType.PERSONAL_USE:
          return { label: 'PU', color: 'bg-gray-500/90', textColor: 'text-white' };
        case LicenseType.CUSTOM:
          return { label: 'C', color: 'bg-indigo-500/90', textColor: 'text-white' };
        default:
          return { label: '?', color: 'bg-gray-500/90', textColor: 'text-white' };
      }
    }
  };

  const { label, color, textColor } = getLicenseInfo(licenseType);

  return (
    <div
      className={`absolute top-3 right-3 z-40 px-2 py-1 rounded-sm backdrop-blur-sm ${color} ${textColor} text-xs font-bold tracking-wider shadow-lg ${className}`}
      title={licenseType.replace('_', ' ')}
    >
      {label}
    </div>
  );
};

export default LicenseBadge;

