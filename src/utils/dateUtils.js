import { format, isPast, isToday, isTomorrow, differenceInDays, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  try {
    return format(new Date(date), 'MMM dd, yyyy')
  } catch (err) {
    return ''
  }
}

export const formatDateTime = (date) => {
  if (!date) return ''
  try {
    return format(new Date(date), 'MMM dd, yyyy HH:mm')
  } catch (err) {
    return ''
  }
}

export const getDateLabel = (date) => {
  if (!date) return ''
  try {
    const parsedDate = new Date(date)
    if (isToday(parsedDate)) return 'Today'
    if (isTomorrow(parsedDate)) return 'Tomorrow'
    const daysUntil = differenceInDays(parsedDate, new Date())
    if (daysUntil > 0 && daysUntil <= 7) return `In ${daysUntil} days`
    if (daysUntil === -1) return 'Yesterday'
    if (daysUntil < 0 && daysUntil >= -7) return `${Math.abs(daysUntil)} days ago`
    return formatDate(date)
  } catch (err) {
    return formatDate(date)
  }
}

export const isOverdue = (date) => {
  if (!date) return false
  try {
    return isPast(new Date(date)) && !isToday(new Date(date))
  } catch (err) {
    return false
  }
}

export const isToday_Check = (date) => {
  if (!date) return false
  try {
    return isToday(new Date(date))
  } catch (err) {
    return false
  }
}

export const getDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return []
  const dates = []
  let currentDate = new Date(startDate)
  const end = new Date(endDate)
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

export const calculateDateDifference = (date1, date2) => {
  try {
    return differenceInDays(new Date(date2), new Date(date1))
  } catch (err) {
    return 0
  }
}
