export async function handleWeatherQuery(city: string): Promise<string> {
  const apiKey = process.env.OPENWEATHER_API_KEY || 'demo';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (response.status === 200) {
    return `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${Math.round(data.main.temp)}°F`;
  } else {
    throw new Error(`Weather data not available for ${city}`);
  }
}

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
export default async function QueryProcessor(query: string): Promise<string> {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("shakespeare")) {
    return handleShakespeareQuery();
  }

  if (lowerQuery.includes("name")) {
    return handleNameQuery();
  }

  // Weather query - extract city name
  const weatherMatch = lowerQuery.match(/what is the weather in (.+)/);
  if (weatherMatch) {
    const city = weatherMatch[1].trim();
    return await handleWeatherQuery(city);
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
