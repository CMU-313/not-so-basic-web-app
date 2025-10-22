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

// Calls GitHub API and parses complex nested response
export async function handleGitHubQuery(username: string): Promise<string> {
  const userUrl = `https://api.github.com/users/${encodeURIComponent(username)}`;
  const reposUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos`;
  
  const userResponse = await fetch(userUrl);
  const userData = await userResponse.json();
  
  const reposResponse = await fetch(reposUrl);
  const reposData = await reposResponse.json();
  
  // Parse repos array and calculate stats
  const totalStars = reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
  const languages = reposData.map((repo: any) => repo.language).filter((lang: string) => lang !== null);
  const uniqueLanguages = Array.from(new Set(languages));
  
  // Find most popular repo
  const sortedRepos = reposData.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);
  const topRepo = sortedRepos[0];
  
  return `${userData.name} (@${userData.login}) has ${userData.public_repos} public repositories with ${totalStars} total stars. ` +
         `They code in ${uniqueLanguages.length} languages including ${uniqueLanguages.slice(0, 3).join(', ')}. ` +
         `Most popular repo: ${topRepo.name} (${topRepo.stargazers_count} stars)`;
}

// Interface for student grades
interface Assignment {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
}

// Calculates weighted average from assignment data
// This has complex internal logic where assertions catch PROGRAMMER errors
export function handleGradeQuery(assignmentsJson: string): string {
  // Parse input (validation happens here - could fail with bad user input)
  const assignments: Assignment[] = JSON.parse(assignmentsJson);
  
  // Internal logic - these should NEVER be violated if our algorithm is correct
  // These are PROGRAMMER errors, not user errors
  
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  for (const assignment of assignments) {
    const normalizedScore = (assignment.score / assignment.maxScore) * 100;
    const weightedScore = normalizedScore * assignment.weight;
    
    // ASSERTION: Intermediate calculations should maintain invariants
    // If these fail, it's a bug in OUR code, not bad input
    // normalizedScore should be 0-100 if score <= maxScore (could be > 100 for extra credit)
    // weightedScore should be proportional to weight
    
    totalWeightedScore += weightedScore;
    totalWeight += assignment.weight;
    
    // ASSERTION: Running totals should only increase (weights are positive)
    // If this fails after adding positive weight, we have a serious bug
  }
  
  // ASSERTION: If we had any assignments, totalWeight should be > 0
  // Division by zero here would be a logic error
  
  const finalGrade = totalWeightedScore / totalWeight;
  
  // ASSERTION: If all normalized scores were 0-100 and weights > 0,
  // finalGrade should be 0-100 (unless extra credit)
  
  let letterGrade: string;
  if (finalGrade >= 90) {
    letterGrade = 'A';
  } else if (finalGrade >= 80) {
    letterGrade = 'B';
  } else if (finalGrade >= 70) {
    letterGrade = 'C';
  } else if (finalGrade >= 60) {
    letterGrade = 'D';
  } else {
    letterGrade = 'F';
  }
  
  // ASSERTION: We should have assigned EXACTLY one letter grade
  // If letterGrade is still undefined, we missed a case
  
  return `Final grade: ${finalGrade.toFixed(2)}% (${letterGrade})`;
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

  // GitHub query - "What is the GitHub profile of [username]"
  const githubMatch = lowerQuery.match(/what is the github profile of (.+)/);
  if (githubMatch) {
    const username = githubMatch[1].trim();
    return await handleGitHubQuery(username);
  }

  // Grade calculation query - "Calculate grade: [JSON data]"
  const gradeMatch = query.match(/calculate grade:\s*(.+)/i);
  if (gradeMatch) {
    const jsonData = gradeMatch[1].trim();
    return handleGradeQuery(jsonData);
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
