"use client";

type SpeedometerProps = {
  speedKmh: number;
  maxSpeedKmh?: number;
};

export function Speedometer({
  speedKmh,
  maxSpeedKmh = 120,
}: SpeedometerProps) {
  const normalizedSpeed = Math.min(
    Math.max(speedKmh / maxSpeedKmh, 0),
    1,
  );

  const angle = -135 + normalizedSpeed * 270;

  return (
    <div className="w-full max-w-[280px]">
      <div className="border border-slate-700 bg-[var(--color-brand-charcoal)] p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="font-[var(--font-chakra-petch)] text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Vehicle Speed
          </span>

          <span className="font-[var(--font-jetbrains-mono)] text-[10px] uppercase tracking-wider text-slate-500">
            km/h
          </span>
        </div>

        <div className="relative mx-auto mt-6 aspect-square max-w-[220px]">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full"
            aria-label={`Vehicle speed ${speedKmh.toFixed(1)} kilometers per hour`}
            role="img"
          >
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="#334155"
              strokeWidth="10"
              strokeDasharray="385 105"
              strokeLinecap="butt"
              transform="rotate(-135 100 100)"
            />

            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="#dc2626"
              strokeWidth="10"
              strokeDasharray={`${385 * normalizedSpeed} 490`}
              strokeLinecap="butt"
              transform="rotate(-135 100 100)"
            />

            <g>
              <line
                x1="100"
                y1="29"
                x2="100"
                y2="39"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              <line
                x1="171"
                y1="100"
                x2="161"
                y2="100"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              <line
                x1="100"
                y1="171"
                x2="100"
                y2="161"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              <line
                x1="29"
                y1="100"
                x2="39"
                y2="100"
                stroke="#94a3b8"
                strokeWidth="2"
              />
            </g>

            <g
              style={{
                transformOrigin: "100px 100px",
                transform: `rotate(${angle}deg)`,
                transition: "transform 150ms ease-out",
              }}
            >
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="43"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>

            <circle
              cx="100"
              cy="100"
              r="7"
              fill="#dc2626"
            />

            <text
              x="100"
              y="137"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="28"
              fontFamily="var(--font-oswald)"
              fontWeight="600"
            >
              {speedKmh.toFixed(0)}
            </text>

            <text
              x="100"
              y="153"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="var(--font-chakra-petch)"
              fontWeight="600"
              letterSpacing="2"
            >
              KM/H
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}