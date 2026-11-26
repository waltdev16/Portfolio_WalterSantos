/** Small filled icons in the style of the room's label pills. */

type P = { className?: string };
const base = { viewBox: "0 0 24 24", "aria-hidden": true as const, focusable: false as const };

export const PersonIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <circle cx="12" cy="7.5" r="4.5" fill="currentColor" />
    <path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5z" fill="currentColor" />
  </svg>
);

export const NoteIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M9 4.5 20 2.5v13.2a3.3 3.3 0 1 1-2.2-3.1V7.1L11.2 8.3v9.4A3.3 3.3 0 1 1 9 14.6z" fill="currentColor" />
  </svg>
);

export const FolderIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M2.5 6.5A2 2 0 0 1 4.5 4.5h5l2 2.2h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" fill="currentColor" />
    <path d="M2.5 10h19" stroke="#1b1618" strokeOpacity=".35" strokeWidth="1.4" />
  </svg>
);

export const RosetteIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m8.2 14.5-2.4 7 3.3-1.2 1.9 2.7 1.2-6.2zM15.8 14.5l2.4 7-3.3-1.2-1.9 2.7-1.2-6.2z" fill="currentColor" />
    <circle cx="12" cy="9.2" r="7" fill="currentColor" />
    <circle cx="12" cy="9.2" r="3.6" fill="none" stroke="#1b1618" strokeOpacity=".45" strokeWidth="1.5" />
  </svg>
);

export const BookIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 4.5h11.5a3 3 0 0 1 3 3V21H7a3 3 0 0 1-3-3z" fill="currentColor" />
    <path d="M4 18a3 3 0 0 1 3-3h11.5" stroke="#1b1618" strokeOpacity=".4" strokeWidth="1.5" fill="none" />
  </svg>
);

export const ChatIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 4.5h16a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H10l-5 4v-4H4A1.5 1.5 0 0 1 2.5 16V6A1.5 1.5 0 0 1 4 4.5z" fill="currentColor" />
  </svg>
);

export const CubeIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="m12 2.5 8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="m3.8 7.4 8.2 4.7 8.2-4.7M12 12v9.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const BackIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Sound bars; flat line when muted. */
export const TerminalIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" fill="currentColor" />
    <path d="m6.5 9 3 3-3 3M11.5 15.5h5" stroke="#1b1618" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CameraIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 8a2 2 0 0 1 2-2h2.2l1.6-2h6.4l1.6 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" />
    <circle cx="12" cy="12.5" r="3.6" fill="none" stroke="#1b1618" strokeWidth="1.8" />
  </svg>
);

export const CupIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" fill="currentColor" />
    <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M8 2.5c-1 1.3 1 2.2 0 3.5M12 2.5c-1 1.3 1 2.2 0 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const GearIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path
      d="M10.3 2.5h3.4l.5 2.6 1.7.7 2.2-1.5 2.4 2.4-1.5 2.2.7 1.7 2.6.5v3.4l-2.6.5-.7 1.7 1.5 2.2-2.4 2.4-2.2-1.5-1.7.7-.5 2.6h-3.4l-.5-2.6-1.7-.7-2.2 1.5-2.4-2.4 1.5-2.2-.7-1.7-2.6-.5v-3.4l2.6-.5.7-1.7-1.5-2.2 2.4-2.4 2.2 1.5 1.7-.7z"
      fill="currentColor"
    />
    <circle cx="12" cy="12" r="3.2" fill="#1b1618" />
  </svg>
);

export const CarIcon = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M3 14.5 5 9.5a2 2 0 0 1 1.8-1.2h8.6a2 2 0 0 1 1.6.8l2.6 3.4 1.4.5a1 1 0 0 1 .7 1V16a1 1 0 0 1-1 1H3.8a.8.8 0 0 1-.8-.8z" fill="currentColor" />
    <circle cx="7.5" cy="17" r="2" fill="#1b1618" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17" cy="17" r="2" fill="#1b1618" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
