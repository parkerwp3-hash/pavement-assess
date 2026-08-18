/**
 * Line icons drawn on a 24px grid with a heavy 2px stroke so they stay legible
 * on a bright screen held at arm's length. All inherit `currentColor`.
 */

function Svg({ size = 24, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function PropertiesIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 20h18" />
      <path d="M5 20V6h9v14" />
      <path d="M14 20V10h5v10" />
      <path d="M8 10h3M8 14h3" />
    </Svg>
  )
}

export function AssessIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M4 10h16M10 4v16" />
      <path d="M13.5 13.5l3.5 3.5" />
    </Svg>
  )
}

export function ReportsIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 12h6M9 16h6M9 8h3" />
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

export function ChevronLeftIcon(props) {
  return (
    <Svg {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Svg>
  )
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
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
