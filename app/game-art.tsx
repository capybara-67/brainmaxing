type ArtProps = { id: string; category: string; index: number };

// Small, purpose-built diagrams keep the library recognizable at a glance.
export function GameArt({ id, category, index }: ArtProps) {
  const motifs: Record<string, string> = {
    reverse: '8 4 1 → 1 4 8',
    ordering: '9 · 2 · 6',
    arithmetic: '12 × 3 = ?',
    logic: '2  4  8  ?',
    magnitude: '½ < 0.75',
    anagram: 'C L O U D',
    binary: '0 1 0 1',
    pairs: 'harbor ↔ velvet',
    retrieval: 'learn → recall',
    nback: 'A → B → A',
    switch: 'ODD / EVEN',
  };
  const text = motifs[id];
  return (
    <svg viewBox="0 0 280 128" className="game-art" aria-hidden="true">
      {text ? (
        <>
          <path
            d="M32 38V24H48M232 24H248V38M32 90V104H48M232 104H248V90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity=".35"
          />
          <text
            x="140"
            y="72"
            textAnchor="middle"
            fill="currentColor"
            fontSize={text.length > 12 ? 19 : 25}
            fontFamily="var(--font-geist-mono)"
          >
            {text}
          </text>
          <circle cx="140" cy="99" r="2" fill="currentColor" />
        </>
      ) : category === 'Memory' ? (
        id === 'path' ? (
          <>
            {Array.from({ length: 9 }, (_, n) => (
              <circle
                key={n}
                cx={96 + (n % 3) * 44}
                cy={24 + Math.floor(n / 3) * 40}
                r="6"
                fill="currentColor"
                opacity=".25"
              />
            ))}
            <path
              d="M96 24L140 24L140 64L184 64L184 104"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="184" cy="104" r="7" fill="currentColor" />
          </>
        ) : (
          Array.from({ length: 16 }, (_, n) => (
            <rect
              key={n}
              x={90 + (n % 4) * 26}
              y={14 + Math.floor(n / 4) * 26}
              width="20"
              height="20"
              rx="3"
              fill="currentColor"
              opacity={[2, 5, 9, 14].includes(n) ? 1 : 0.13}
            />
          ))
        )
      ) : category === 'Attention' ? (
        id === 'focus' ? (
          <>
            <text
              x="140"
              y="80"
              textAnchor="middle"
              fill="currentColor"
              fontSize="47"
              fontWeight="650"
              letterSpacing="-2"
            >
              BLUE
            </text>
            <path
              d="M78 95H202"
              stroke="currentColor"
              strokeWidth="2"
              opacity=".35"
            />
          </>
        ) : id === 'flanker' ? (
          <text
            x="140"
            y="79"
            textAnchor="middle"
            fill="currentColor"
            fontSize="31"
            fontFamily="var(--font-geist-mono)"
          >
            → → ← → →
          </text>
        ) : (
          <>
            {[0, 1, 2, 3, 4].map((n) => (
              <circle
                key={n}
                cx={76 + n * 32}
                cy="64"
                r={n === 2 ? 18 : 10}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity={n === 2 ? 1 : 0.25}
              />
            ))}
            <path
              d="M133 57L147 71M147 57L133 71"
              stroke="currentColor"
              strokeWidth="2"
            />
          </>
        )
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <rect
            x="82"
            y="35"
            width="55"
            height="55"
            rx="3"
            transform={`rotate(${index % 2 ? 15 : -15} 110 64)`}
          />
          <circle cx="177" cy="64" r="29" />
          <path d="M150 28L157 21L164 28M157 21V43" opacity=".4" />
          <circle cx="177" cy="64" r="4" fill="currentColor" stroke="none" />
        </g>
      )}
    </svg>
  );
}

export function CuriosityArt({ topic }: { topic: string }) {
  return (
    <svg viewBox="0 0 280 140" className="curiosity-art" aria-hidden="true">
      {topic === 'engine' ? (
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M107 24V89H173V24M100 24H180M140 24V12" />
          <path d="M110 54H170V67H110Z" fill="currentColor" fillOpacity=".2" />
          <path d="M140 67V103L164 119" strokeWidth="4" />
          <circle cx="164" cy="119" r="11" />
          <path d="M84 45H101M180 45H196" strokeDasharray="3 4" />
        </g>
      ) : topic === 'internet' ? (
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M60 70L140 32L220 70L140 108ZM60 70H220M140 32V108"
            opacity=".4"
          />
          {[
            [60, 70],
            [140, 32],
            [220, 70],
            [140, 108],
          ].map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="10"
              fill="var(--art-surface)"
            />
          ))}
          <path d="M66 67L130 37M151 37L209 66" strokeWidth="3" />
          <rect
            x="97"
            y="43"
            width="8"
            height="8"
            fill="currentColor"
            stroke="none"
            transform="rotate(-25 101 47)"
          />
        </g>
      ) : (
        <g fill="none" stroke="currentColor">
          <circle cx="140" cy="70" r="29" fill="currentColor" />
          <ellipse
            cx="140"
            cy="70"
            rx="76"
            ry="20"
            strokeWidth="2"
            transform="rotate(-20 140 70)"
          />
          <ellipse
            cx="140"
            cy="70"
            rx="61"
            ry="38"
            strokeWidth="1"
            opacity=".4"
            transform="rotate(-20 140 70)"
          />
          <path
            d="M211 25V35M206 30H216M75 106V112M72 109H78"
            strokeWidth="1.5"
          />
        </g>
      )}
    </svg>
  );
}
