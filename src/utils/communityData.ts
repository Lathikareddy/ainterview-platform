import type { UserProfile } from '../context/AuthContext';

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  score: number;
  role: string;
  picture?: string;
  isYou?: boolean;
}

// Realistic names pool
const firstNames = [
  'Sarah', 'Michael', 'Jessica', 'David', 'Emily', 'James', 'Jennifer', 'Robert',
  'Lisa', 'William', 'Maria', 'John', 'Patricia', 'Christopher', 'Linda', 'Daniel'
];

const lastNames = [
  'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
  'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor',
  'Chen', 'Kim', 'Patel', 'Singh', 'Kumar', 'Sharma', 'Wang', 'Wong'
];

const roles = [
  'Senior Software Engineer',
  'Product Manager',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Solutions Architect',
  'Engineering Manager',
  'Senior Product Manager',
  'Staff Engineer',
  'Principal Engineer'
];

const companies = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Stripe',
  'Airbnb', 'Uber', 'Pinterest', 'Spotify', 'Coinbase', 'OpenAI', 'Databricks'
];

export const generateDeterministicHash = (email: string, seed: number = 0): number => {
  let hash = seed;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const generateCommunityLeaderboard = (user: UserProfile | null, maxMembers: number = 5): CommunityMember[] => {
  if (!user) return [];

  const members: CommunityMember[] = [];
  const userHash = generateDeterministicHash(user.email);

  // Add current user (slightly ahead or behind based on their score from store)
  members.push({
    id: user.id,
    name: `${user.name} (You)`,
    email: user.email,
    score: 82,
    role: user.role || 'Software Engineer',
    picture: user.picture,
    isYou: true
  });

  // Generate other realistic community members based on hash
  const generateEmail = (index: number) => {
    const hash = generateDeterministicHash(user.email, index);
    const domain = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'techcorp.io'][hash % 5];
    const username = `${firstNames[hash % firstNames.length].toLowerCase()}.${lastNames[(hash + index) % lastNames.length].toLowerCase()}${index}`;
    return `${username}@${domain}`;
  };

  const seenScores = new Set([members[0].score]);

  for (let i = 0; i < maxMembers - 1; i++) {
    const seed = userHash + i;
    const hash = generateDeterministicHash(user.email, i + 1);

    // Generate unique score within reasonable range
    let score = 85 + ((hash % 15) - 7);
    while (seenScores.has(score)) {
      score = (score % 100) + 70;
    }
    seenScores.add(score);

    const email = generateEmail(i + 1);
    members.push({
      id: `user_${i + 1}_${hash}`,
      name: `${firstNames[hash % firstNames.length]} ${lastNames[(hash + i + 1) % lastNames.length]}`,
      email,
      score,
      role: roles[(hash + i) % roles.length],
      isYou: false
    });
  }

  // Sort by score descending
  return members.sort((a, b) => Number(b.score) - Number(a.score));
};

export const generateImprovementTip = (userScore: number, recentActivity: any[] = []): string => {
  if (!recentActivity || recentActivity.length === 0) {
    return 'Keep practicing! Each interview improves your skills and confidence.';
  }

  const lastScore = recentActivity[0]?.score ?? 0;
  const avgScore = recentActivity.reduce((sum, item) => sum + (item.score || 0), 0) / recentActivity.length;

  if (userScore < 50) {
    return 'Focus on keyword coverage. Include specific technical concepts and frameworks in your answers.';
  } else if (userScore < 70) {
    return 'You\'re on the right track! Add more examples and quantifiable results to strengthen your answers.';
  } else if (userScore < 85) {
    return 'Great job! Practice more behavioral questions to showcase your leadership and collaboration skills.';
  } else if (lastScore < userScore) {
    return 'Excellent progress! Keep maintaining this momentum with consistent practice.';
  } else if (avgScore < userScore) {
    return 'You\'re improving! Focus on weak areas and review previous feedback for targeted practice.';
  } else {
    return 'Challenge yourself with harder difficulty levels to keep improving and stay ahead of the curve.';
  }
};
