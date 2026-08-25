type BunnyMood = "happy" | "wink" | "sleepy" | "yum" | "sparkle";

type BunnyProps = {
  mood?: BunnyMood;
  className?: string;
};

/**
 * Original kawaii purple bunny mascot — long ears, a bow, blush cheeks.
 * Not based on any copyrighted character; purely original shapes/colors.
 */
export function Bunny({ mood = "happy", className = "" }: BunnyProps) {
  return (
    <svg viewBox="0 0 200 220" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ears */}
      <g>
        <path
          d="M70 70 C55 30 60 -5 78 5 C96 15 92 55 95 85 Z"
          fill="var(--bunny-body, #b794f6)"
        />
        <path d="M75 65 C67 38 70 15 80 20 C90 26 87 52 90 78 Z" fill="#f3c4e0" />
        <path
          d="M130 70 C145 30 140 -5 122 5 C104 15 108 55 105 85 Z"
          fill="var(--bunny-body, #b794f6)"
        />
        <path d="M125 65 C133 38 130 15 120 20 C110 26 113 52 110 78 Z" fill="#f3c4e0" />
      </g>

      {/* bow on left ear */}
      <g transform="translate(58 32) rotate(-18)">
        <path d="M0 6 C-10 -4 -10 14 0 6 C0 -2 0 14 0 6" fill="#ef4a9c" />
        <circle cx="0" cy="6" r="3.4" fill="#d6317f" />
        <path d="M0 6 L-9 -3 L-11 9 Z" fill="#ef4a9c" />
        <path d="M0 6 L9 -3 L11 9 Z" fill="#ef4a9c" />
      </g>

      {/* body */}
      <ellipse cx="100" cy="150" rx="46" ry="40" fill="var(--bunny-body, #b794f6)" />

      {/* head */}
      <circle cx="100" cy="118" r="52" fill="var(--bunny-body, #b794f6)" />

      {/* cheeks */}
      <ellipse cx="72" cy="128" rx="9" ry="6" fill="#f9a8d4" opacity="0.8" />
      <ellipse cx="128" cy="128" rx="9" ry="6" fill="#f9a8d4" opacity="0.8" />

      {/* face */}
      <BunnyFace mood={mood} />

      {/* tiny paws */}
      <ellipse cx="70" cy="180" rx="12" ry="9" fill="var(--bunny-body, #b794f6)" />
      <ellipse cx="130" cy="180" rx="12" ry="9" fill="var(--bunny-body, #b794f6)" />

      {/* belly */}
      <ellipse cx="100" cy="158" rx="24" ry="20" fill="#f3e8fc" opacity="0.85" />
    </svg>
  );
}

function BunnyFace({ mood }: { mood: BunnyMood }) {
  if (mood === "sleepy") {
    return (
      <g stroke="#2e1065" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M78 112 q6 6 12 0" />
        <path d="M110 112 q6 6 12 0" />
        <path d="M94 128 q6 5 12 0" stroke="#2e1065" fill="none" />
      </g>
    );
  }
  if (mood === "wink") {
    return (
      <g>
        <circle cx="84" cy="112" r="4.2" fill="#2e1065" />
        <path d="M112 112 q6 -5 12 0" stroke="#2e1065" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M94 128 q6 5 12 0" stroke="#2e1065" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M100 122 l-2 4h4l-2-4z" fill="#f472b6" />
      </g>
    );
  }
  if (mood === "yum") {
    return (
      <g>
        <circle cx="84" cy="112" r="4.4" fill="#2e1065" />
        <circle cx="116" cy="112" r="4.4" fill="#2e1065" />
        <ellipse cx="100" cy="130" rx="8" ry="6" fill="#5b2a86" />
        <ellipse cx="100" cy="132" rx="4" ry="2.6" fill="#f472b6" />
      </g>
    );
  }
  if (mood === "sparkle") {
    return (
      <g>
        <path d="M80 108 l4 4 -4 4 -4 -4z" fill="#2e1065" />
        <path d="M112 108 l4 4 -4 4 -4 -4z" fill="#2e1065" />
        <path d="M94 128 q6 5 12 0" stroke="#2e1065" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <circle cx="84" cy="112" r="4.4" fill="#2e1065" />
      <circle cx="116" cy="112" r="4.4" fill="#2e1065" />
      <path d="M100 118 l-2.4 4h4.8l-2.4-4z" fill="#f472b6" />
      <path d="M92 128 q8 7 16 0" stroke="#2e1065" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </g>
  );
}
