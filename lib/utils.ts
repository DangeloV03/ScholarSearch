import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateConversationTitle(firstMessage: string): string {
  // Clean and truncate the message
  const cleanMessage = firstMessage.trim().replace(/\s+/g, ' ');
  
  // If message is short enough, use it directly
  if (cleanMessage.length <= 50) {
    return cleanMessage;
  }
  
  // Extract key words and create a contextual title
  const words = cleanMessage.toLowerCase().split(' ');
  
  // Common scholarship-related keywords to look for (prioritized)
  const fieldKeywords = [
    'engineering', 'medical', 'business', 'arts', 'science', 'technology', 'computer', 'nursing', 'law', 'education'
  ];
  
  const levelKeywords = [
    'undergraduate', 'graduate', 'phd', 'masters', 'bachelors', 'doctoral', 'postgraduate'
  ];
  
  const typeKeywords = [
    'merit', 'need-based', 'academic', 'athletic', 'creative', 'research', 'leadership', 'community'
  ];
  
  const demographicKeywords = [
    'international', 'minority', 'women', 'first-generation', 'transfer', 'veteran', 'disabled', 'lgbtq'
  ];
  
  // Words to exclude from titles
  const excludeWords = [
    'the', 'and', 'for', 'with', 'that', 'this', 'have', 'will', 'need', 'want', 'looking', 'searching', 'find', 'help',
    'scholarship', 'scholarships', 'financial', 'aid', 'grant', 'grants', 'funding', 'tuition', 'money', 'cost', 'expensive',
    'please', 'can', 'you', 'help', 'me', 'find', 'get', 'apply', 'application', 'deadline', 'requirements', 'eligibility'
  ];
  
  // Find the most specific keywords in order of priority
  let titleParts = [];
  
  // First, look for field of study
  const foundField = fieldKeywords.find(keyword => 
    words.some(word => word.includes(keyword))
  );
  if (foundField) {
    titleParts.push(foundField.charAt(0).toUpperCase() + foundField.slice(1));
  }
  
  // Then look for level
  const foundLevel = levelKeywords.find(keyword => 
    words.some(word => word.includes(keyword))
  );
  if (foundLevel) {
    titleParts.push(foundLevel.charAt(0).toUpperCase() + foundLevel.slice(1));
  }
  
  // Then look for type
  const foundType = typeKeywords.find(keyword => 
    words.some(word => word.includes(keyword))
  );
  if (foundType) {
    titleParts.push(foundType.charAt(0).toUpperCase() + foundType.slice(1));
  }
  
  // Then look for demographic
  const foundDemographic = demographicKeywords.find(keyword => 
    words.some(word => word.includes(keyword))
  );
  if (foundDemographic) {
    titleParts.push(foundDemographic.charAt(0).toUpperCase() + foundDemographic.slice(1));
  }
  
  // If we found specific keywords, create a meaningful title (max 2 words)
  if (titleParts.length > 0) {
    const selectedParts = titleParts.slice(0, 2); // Only take first 2
    return selectedParts.join(' ') + ' Scholarships';
  }
  
  // If no specific keywords found, look for meaningful words
  const meaningfulWords = words.filter(word => 
    word.length > 3 && 
    !excludeWords.includes(word) &&
    !excludeWords.some(exclude => word.includes(exclude))
  );
  
  if (meaningfulWords.length > 0) {
    // Take only the first meaningful word
    const firstWord = meaningfulWords[0].charAt(0).toUpperCase() + meaningfulWords[0].slice(1);
    return `${firstWord} Scholarships`;
  }
  
  // Last resort: use first few words but exclude common words
  const filteredWords = words.filter(word => 
    word.length > 2 && 
    !excludeWords.includes(word) &&
    !excludeWords.some(exclude => word.includes(exclude))
  );
  
  if (filteredWords.length > 0) {
    const firstWord = filteredWords[0].charAt(0).toUpperCase() + filteredWords[0].slice(1);
    return `${firstWord} Scholarships`;
  }
  
  // Final fallback: generic
  return 'New Search';
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) { // 7 days
    return d.toLocaleDateString([], { weekday: 'short' });
  } else {
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
} 