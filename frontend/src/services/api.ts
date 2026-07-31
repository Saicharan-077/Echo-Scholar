import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header token if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Judge Persona credentials list for 1-click switching
export const JUDGE_PERSONAS = [
  {
    role: 'Standard Student',
    email: 'demo@EchoScholar.ai',
    password: 'Demo@123',
    badge: '5-Day Streak • 1,450 XP',
    desc: '3 months learning history, 75% DSA mastery'
  },
  {
    role: 'Beginner Student',
    email: 'beginner@EchoScholar.ai',
    password: 'Demo@123',
    badge: '⚠️ Active Prerequisite Gap',
    desc: '45% mastery, confusion warning on Recursion & DP'
  },
  {
    role: 'Placement Candidate',
    email: 'placement@EchoScholar.ai',
    password: 'Demo@123',
    badge: 'Mock Interview Scorecards',
    desc: 'System Design Caching & HR Interview feedback'
  },
  {
    role: 'Advanced Scholar',
    email: 'advanced@EchoScholar.ai',
    password: 'Demo@123',
    badge: '92% Mastery • Level 5',
    desc: '3,200 XP, System Design Specialist'
  },
  {
    role: 'System Admin Lead',
    email: 'admin@EchoScholar.ai',
    password: 'Admin@123',
    badge: 'Admin Privileges',
    desc: 'System audit logs & user database manager'
  }
];

export async function loginWithPersona(email: string, password: string) {
  try {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.access_token) {
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('user_email', email);
    }
    return res.data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}
