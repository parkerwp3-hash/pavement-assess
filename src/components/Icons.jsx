/**
 * Line icons on a 24px grid, inheriting `currentColor`. Stroke is 1.75 —
 * lighter than the field build's 2px, which read as heavy against the
 * lighter-weight brand UI.
 */

function Svg({ size = 24, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function PortfolioIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 20h18" />
      <path d="M5 20V6h9v14" />
      <path d="M14 20V10h5v10" />
      <path d="M8 10h3M8 14h3" />
    </Svg>
  )
}

export function ProposalsIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 12h6M9 16h6M9 8h3" />
    </Svg>
  )
}

export function ProjectsIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 9h18v4H3z" />
      <path d="M6 13v7M18 13v7M12 9V4" />
    </Svg>
  )
}

export function BellIcon(props) {
  return (
    <Svg {...props}>
      <path d="M18 10a6 6 0 10-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10.5 20a2 2 0 003 0" />
    </Svg>
  )
}

export function GearIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1A1.6 1.6 0 006 19.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003 14H3a2 2 0 110-4h.1A1.6 1.6 0 004.6 8l-.1-.1a2 2 0 112.8-2.8l.1.1A1.6 1.6 0 0010 4.6V3a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1A1.6 1.6 0 0021 10h.1a2 2 0 110 4H21a1.6 1.6 0 00-1.5 1z" />
    </Svg>
  )
}

export function SearchIcon(props) {
  return (
    <Svg size={20} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </Svg>
  )
}

export function ListIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Svg>
  )
}

export function GridIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M10 4v16M10 12h10" />
    </Svg>
  )
}

export function FilterIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </Svg>
  )
}

export function StarIcon({ filled, ...props }) {
  return (
    <Svg size={22} fill={filled ? 'currentColor' : 'none'} {...props}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
    </Svg>
  )
}

export function KebabIcon(props) {
  return (
    <Svg size={20} {...props}>
      <circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function PlusIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function CheckIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Svg>
  )
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  )
}

export function ChevronLeftIcon(props) {
  return (
    <Svg {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Svg>
  )
}

export function ChevronRightIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M9 5l7 7-7 7" />
    </Svg>
  )
}

export function MapIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </Svg>
  )
}

export function PhotoIcon(props) {
  return (
    <Svg size={28} {...props}>
      <path d="M3 5h18v14H3z" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="M21 16l-5-5-6 6-2-2-5 4" />
    </Svg>
  )
}

export function DocIcon(props) {
  return (
    <Svg size={22} {...props}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 12h6M9 16h6" />
    </Svg>
  )
}

export function MoneyIcon(props) {
  return (
    <Svg size={22} {...props}>
      <path d="M4 6h16v12H4z" />
      <path d="M12 9v6M10.5 10.5h3M10.5 13.5h3" />
    </Svg>
  )
}

export function TrowelIcon(props) {
  return (
    <Svg size={22} {...props}>
      <path d="M4 4l7 7-4 4-4-7z" />
      <path d="M11 11l4 4 5-5-4-4z" />
    </Svg>
  )
}

export function ActivityIcon(props) {
  return (
    <Svg size={22} {...props}>
      <path d="M3 12h4l3 7 4-16 3 9h4" />
    </Svg>
  )
}

export function SupportIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M4 13a8 8 0 1116 0v4a2 2 0 01-2 2h-2v-6h4M4 13v4a2 2 0 002 2h2v-6H4" />
    </Svg>
  )
}

export function SignOutIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M9 4H5v16h4" />
      <path d="M15 8l4 4-4 4M19 12H9" />
    </Svg>
  )
}

/* Rating marks — one per pavement rating category. */
export function FunctionIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M12 3l9 9-9 9-9-9z" />
      <path d="M9.5 12h5M12.5 9.5l2.5 2.5-2.5 2.5" />
    </Svg>
  )
}

export function LiabilityIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5z" />
    </Svg>
  )
}

export function AestheticsIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M4 9l8-5 8 5v11H4z" />
      <path d="M4 9h16" />
    </Svg>
  )
}

export function ConditionIcon(props) {
  return (
    <Svg size={20} {...props}>
      <path d="M4 15l1.5-5h13L20 15" />
      <path d="M3 15h18v3H3z" />
      <circle cx="7.5" cy="18.5" r="1.2" />
      <circle cx="16.5" cy="18.5" r="1.2" />
    </Svg>
  )
}
