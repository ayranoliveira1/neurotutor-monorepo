export function formatInstagram(value: string): string {
  const trimmed = value.trim()
  if (trimmed === '' || trimmed === '@') return trimmed

  const withoutAt = trimmed.replace(/^@+/, '')
  return `@${withoutAt}`
}
