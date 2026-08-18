import { MapIcon } from "./Icons.jsx";
import { DISTRESS_TYPES, SEVERITIES, labelFor } from "../lib/taxonomy.js";
import { formatMoney, formatNumber } from "../lib/format.js";

/** Severity drives zone color — the map has to be readable before it is read. */
const TONE = {
  severe: { stroke: "#c0392b", fill: "rgba(235, 87, 87, 0.42)" },
  moderate: { stroke: "#c87d1e", fill: "rgba(242, 153, 74, 0.42)" },
  low: { stroke: "#1f8a4c", fill: "rgba(39, 174, 96, 0.34)" },
};

const VIEW_W = 1000;
const VIEW_H = 560;

function toneFor(severity) {
  return TONE[severity] || TONE.moderate;
}

/**
 * Repair zones drawn over the site.
 *
 * Zone geometry is normalized 0–1 against the site extent, so it scales to any
 * viewport without touching the stored coordinates. No aerial image ships with
 * the app — `map.imageUrl` is null on every record so far — so the base is a
 * drawn surface rather than a photo standing in for one.
 */
export default function SiteMap({ site, selectedId, onSelect }) {
  const zones = site.repairZones || [];

  return (
    <div className="sitemap">
      <div className="sitemap-canvas">
        <svg
          className="sitemap-svg"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={`Site map with ${zones.length} repair zones`}
        >
          <rect width={VIEW_W} height={VIEW_H} fill="#d8dcd9" />
          <rect
            x="40"
            y="30"
            width={VIEW_W - 80}
            height={VIEW_H - 60}
            fill="#c9cdc9"
          />

          {/* Drive aisles, to read as a lot rather than an empty field. */}
          <g
            stroke="#ffffff"
            strokeWidth="3"
            strokeDasharray="26 20"
            opacity="0.85"
          >
            <path d={`M60 ${VIEW_H / 2} H${VIEW_W - 60}`} />
            <path d={`M${VIEW_W / 2} 50 V${VIEW_H - 50}`} />
          </g>

          {/* Building pad */}
          <rect
            x={VIEW_W * 0.6}
            y={VIEW_H * 0.08}
            width={VIEW_W * 0.3}
            height={VIEW_H * 0.24}
            fill="#b4b8b4"
          />
          <text
            x={VIEW_W * 0.75}
            y={VIEW_H * 0.21}
            textAnchor="middle"
            fontSize="18"
            fill="#6a6f6a"
            fontWeight="600"
          >
            BUILDING
          </text>

          {zones.map((zone) => {
            const points = zone.geometry.points;
            if (points.length < 3) return null;
            const tone = toneFor(zone.severity);
            const on = zone.id === selectedId;
            const path = points
              .map(([x, y]) => `${x * VIEW_W},${y * VIEW_H}`)
              .join(" ");
            const cx =
              (points.reduce((s, p) => s + p[0], 0) / points.length) * VIEW_W;
            const cy =
              (points.reduce((s, p) => s + p[1], 0) / points.length) * VIEW_H;

            return (
              <g
                key={zone.id}
                className="sitemap-zone"
                onClick={() => onSelect(on ? null : zone.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(on ? null : zone.id);
                  }
                }}
                aria-label={`${zone.id}, ${labelFor(DISTRESS_TYPES, zone.distressType)}, ${labelFor(SEVERITIES, zone.severity)} severity, ${formatNumber(zone.quantity)} ${zone.unit}, ${formatMoney(zone.currentCustomerPrice)}`}
              >
                <polygon
                  points={path}
                  fill={tone.fill}
                  stroke={tone.stroke}
                  strokeWidth={on ? 6 : 3}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="17"
                  fontWeight="700"
                  fill="#1a1a1a"
                >
                  {zone.id}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="sitemap-actions">
          <button type="button" className="btn">
            <MapIcon />
            View Map
          </button>
        </div>
      </div>

      <div className="sitemap-legend">
        {SEVERITIES.map((severity) => (
          <span className="legend-key" key={severity.id}>
            <span
              className="legend-swatch"
              style={{
                borderColor: toneFor(severity.id).stroke,
                background: toneFor(severity.id).fill,
              }}
            />
            {severity.label} severity
          </span>
        ))}
        <span
          className="legend-key"
          style={{ marginLeft: "auto", color: "#767676" }}
        >
          Zone geometry is normalized to the site extent
        </span>
      </div>
    </div>
  );
}
