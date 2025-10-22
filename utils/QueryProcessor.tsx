// Handler functions for different query types
export function handleShakespeareQuery(): string {
  return (
    "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
    "English poet, playwright, and actor, widely regarded as the greatest " +
    "writer in the English language and the world's pre-eminent dramatist."
  );
}

export function handleNameQuery(): string {
  return "Rohan";
}

export function handleCurrentTimeQuery(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US');
}

export function handleTodaysDateQuery(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function handleDayOfWeekQuery(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[now.getDay()];
}

export function handleCurrentYearQuery(): string {
  const now = new Date();
  return now.getFullYear().toString();
}

export function handleCurrentMonthQuery(): string {
  const now = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[now.getMonth()];
}

// Main query router
export default function QueryProcessor(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("shakespeare")) {
    return handleShakespeareQuery();
  }

  if (lowerQuery.includes("name")) {
    return handleNameQuery();
  }

  // Date/Time queries
  if (lowerQuery.includes("what is the current time")) {
    return handleCurrentTimeQuery();
  }

  if (lowerQuery.includes("what is today's date") || 
      lowerQuery.includes("what is the date today")) {
    return handleTodaysDateQuery();
  }

  if (lowerQuery.includes("what day is today") || 
      lowerQuery.includes("what day of the week is it")) {
    return handleDayOfWeekQuery();
  }

  if (lowerQuery.includes("what year is it") || 
      lowerQuery.includes("what is the current year")) {
    return handleCurrentYearQuery();
  }

  if (lowerQuery.includes("what month is it") || 
      lowerQuery.includes("what is the current month")) {
    return handleCurrentMonthQuery();
  }

  return "";
}
