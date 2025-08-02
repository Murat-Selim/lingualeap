
import React from 'react';

export const LinguaLeapLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5 4.5C14.5 5.88 13.38 7 12 7C10.62 7 9.5 5.88 9.5 4.5C9.5 3.12 10.62 2 12 2C13.38 2 14.5 3.12 14.5 4.5ZM17 9H16C15.14 9 14.39 8.64 13.78 8.05C13.59 8.23 13.38 8.43 13.16 8.64C14.61 9.53 15.68 10.94 16.03 12.59C16.89 12.21 17.91 12 19 12V10C18.23 10 17.54 10.15 16.97 10.39C16.5 9.56 15.82 8.87 15 8.36C15.61 7.77 16.24 7.33 17 7V9ZM8 9H7V7C7.76 7.33 8.39 7.77 9 8.36C8.18 8.87 7.5 9.56 7.03 10.39C6.46 10.15 5.77 10 5 10V12C6.09 12 7.11 12.21 7.97 12.59C8.32 10.94 9.39 9.53 10.84 8.64C10.62 8.43 10.41 8.23 10.22 8.05C9.61 8.64 8.86 9 8 9ZM12 8.25C11.41 8.25 10.83 8.12 10.29 7.88L10.22 8.05C10.89 8.95 11.23 10.09 11.23 11.25V22H12.77V11.25C12.77 10.09 13.11 8.95 13.78 8.05L13.71 7.88C13.17 8.12 12.59 8.25 12 8.25Z" />
  </svg>
);

export const DailyConversationsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export const TotalXPIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

export const StartIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
);

export const SpeakerIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
    </svg>
);

export const LoadingSpinner = ({ className }: { className?: string }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
