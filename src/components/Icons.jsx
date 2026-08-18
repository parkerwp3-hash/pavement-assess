/* Line icons at a single weight so the tab bar reads as one set. */

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

export function IconProperties(props) {
  return (
    <Svg {...props}>
      <path d="M3 20h18" />
      <path d="M5 20V7l7-4 7 4v13" />
      <path d="M10 20v-6h4v6" />
    </Svg>
  )
}

export function IconAssess(props) {
  return (
    <Svg {...props}>
      <path d="M4 4h16v16H4z" />
      <path d="M8 14l3-4 2 3 3-5" />
    </Svg>
  )
}

export function IconReports(props) {
  return (
    <Svg {...props}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h4" />
      <path d="M9 13h6M9 17h6" />
    </Svg>
  )
}

export function IconPlus(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function IconChevron(props) {
  return (
    <Svg {...props}>
      <path d="M9 5l7 7-7 7" />
    </Svg>
  )
}
