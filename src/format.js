export function formatSqft(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '—'
  return `${n.toLocaleString('en-US')} sq ft`
}

export function totalSqft(sections = []) {
  return sections.reduce((sum, section) => {
    const n = Number(section.sqft)
    return Number.isFinite(n) && n > 0 ? sum + n : sum
  }, 0)
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`
}
