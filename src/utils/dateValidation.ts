export function isValidDate(dateStr: string): boolean {
  const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/
  const match = dateStr.match(regex)
  
  if (!match) return false
  
  const [, day, month, year] = match
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  
  return date.getDate() === parseInt(day) &&
         date.getMonth() === parseInt(month) - 1 &&
         date.getFullYear() === parseInt(year)
}

export function isValidTime(timeStr: string): boolean {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return regex.test(timeStr)
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}