import React from 'react';

export const SparkleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.863 2.863l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.863 2.863l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.863-2.863l-2.846-.813a.75.75 0 010-1.442l2.846.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a.75.75 0 00.463.463l1.036.258a.75.75 0 010 1.456l-1.036.258a.75.75 0 00-.463.463l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a.75.75 0 00-.463.463l-1.036-.258a.75.75 0 010-1.456l1.036.258a.75.75 0 00.463.463l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.558l.545 1.907a.75.75 0 00.564.564l1.907.545a.75.75 0 010 1.424l-1.907.545a.75.75 0 00-.564.564l-.545 1.907a.75.75 0 01-1.424 0l-.545-1.907a.75.75 0 00-.564-.564l-1.907-.545a.75.75 0 010-1.424l1.907.545a.75.75 0 00.564.564l.545-1.907a.75.75 0 01.712-.558z" clipRule="evenodd" />
  </svg>
);

export const MicIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 11-13.5 0v-1.5A.75.75 0 016 10.5z" />
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const PaperclipIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
    </svg>
);

export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const PhotoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const VideoCameraIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" />
    </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const SpeakerWaveIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);

export const CpuChipIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M19.5 8.25H21M19.5 12H21M19.5 15.75H21M15.75 21v-1.5m-6.429-1.929 1.125-1.125a3.375 3.375 0 0 1 4.773 0l1.125 1.125m-4.773-4.773 1.125-1.125a3.375 3.375 0 0 1 4.773 0l1.125 1.125M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const KeyboardIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM2.25 8.625v9.75a1.125 1.125 0 001.125 1.125h17.25a1.125 1.125 0 001.125-1.125v-9.75H2.25zM3.375 7.5a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 7.5a.75.75 0 000 1.5h.75a.75.75 0 000-1.5H6zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM3.375 11.25a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm2.25 0a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM5.625 15a.75.75 0 000 1.5h12.75a.75.75 0 000-1.5H5.625z" clipRule="evenodd" />
  </svg>
);

export const BoltIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

export const ClipboardCheckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
    </svg>
);

export const FireIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071 1.052A9.75 9.75 0 0 1 12 15.75v2.508c0 .552.448 1 1 1h.084c.552 0 1-.448 1-1v-2.508a9.75 9.75 0 0 1 .108-12.412Z M11.037 2.286a.75.75 0 0 1 1.071 1.052 9.75 9.75 0 0 0-.108 12.412v2.508c0 .552-.448 1-1 1H12a.75.75 0 0 1 0-1.5h.849a.75.75 0 0 0 .75-.75v-2.508a9.75 9.75 0 0 0-1.636-5.495A.75.75 0 0 1 11.037 2.286Z" clipRule="evenodd" />
    </svg>
);

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

export const RectangleStackIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 12l4.179 2.25M6.429 9.75 12 12.75l5.571-3M6.429 9.75 12 6.75l5.571 3m0 0-3.182 1.97m3.182-1.97L21.75 12l-4.179 2.25m-7.5 0L12 12.75l5.571-3" />
    </svg>
);

export const BeakerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.539-1.2 1.2-1.2h.013c.661 0 1.2.54 1.2 1.2v6.525c0 .66-.539 1.2-1.2 1.2h-.013c-.661 0-1.2-.54-1.2-1.2V6.087Zm-2.501.001c0-.66.54-1.2 1.2-1.2h.013c.66 0 1.2.54 1.2 1.2v6.525c0 .66-.54 1.2-1.2 1.2h-.013c-.66 0-1.2-.54-1.2-1.2V6.088Zm-5.002 0c0-.66.54-1.2 1.2-1.2h.013c.66 0 1.2.54 1.2 1.2v6.525c0 .66-.54 1.2-1.2 1.2h-.013c-.66 0-1.2-.54-1.2-1.2V6.088ZM7.5 6.128v1.444m3.75 0v1.444m3.75 0v1.444m-1.5 3.404v4.536a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.536m5.25 0v4.536a.75.75 0 0 0 .75.75h2.25a.75.75 0 0 0 .75-.75v-4.536m0 0a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM3.75 12.128c0-1.04.84-1.875 1.875-1.875h12.75c1.035 0 1.875.835 1.875 1.875v5.25c0 1.04-.84 1.875-1.875 1.875H5.625A1.875 1.875 0 0 1 3.75 17.378v-5.25Z" />
    </svg>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.25 7.25C7.25 6.56 7.81 6 8.5 6h4.25c.69 0 1.25.56 1.25 1.25v.018c.002.716.432 1.343 1.042 1.636.61.293 1.313.248 1.88-.126a1.25 1.25 0 0 1 1.622 1.622 2.25 2.25 0 0 1-1.88.126c-.61-.293-1.04-.92-1.042-1.636v-.018A1.25 1.25 0 0 0 12.75 6H8.5C7.81 6 7.25 6.56 7.25 7.25v4.5A1.25 1.25 0 0 0 8.5 13h1.596c.264 0 .52-.105.707-.293l2.829-2.829a1.25 1.25 0 0 1 1.767 1.767l-2.829 2.829a2.25 2.25 0 0 1-3.182 0L8.793 12.207A1.25 1.25 0 0 0 8.5 13H5.25C4.56 13 4 13.56 4 14.25v.018c.002.716.432 1.343 1.042 1.636.61.293 1.313.248 1.88-.126a1.25 1.25 0 0 1 1.622 1.622 2.25 2.25 0 0 1-1.88.126c-.61-.293-1.04-.92-1.042-1.636v-.018A1.25 1.25 0 0 0 5.25 13H4V7.25A1.25 1.25 0 0 0 2.75 6H2.5" />
    </svg>
);

export const TrophyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Zm0 0c0 .539-.213 1.052-.586 1.414M16.5 18.75V15M9 15v3.75m.586 1.414a1.052 1.052 0 0 1-.586-1.414M12 12a2.25 2.25 0 0 0-2.25 2.25v3.75h4.5v-3.75A2.25 2.25 0 0 0 12 12Zm0 0V7.5m0-4.5v4.5m0 0a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
    </svg>
);

export const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
    </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

export const AcademicCapIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v-2.5L12 4l11 5.5V12M12 21v-5.5" />
    </svg>
);

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a6.01 6.01 0 0 0-3.75 0M3.75 12h16.5M12 3.75h.008v.008H12V3.75Zm-3.75 0h.008v.008H8.25V3.75Zm7.5 0h.008v.008h-.008V3.75Z" />
    </svg>
);