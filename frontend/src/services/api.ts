import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : null);
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:8000/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
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
    email: 'demo@EchoXScholar.ai',
    password: 'Demo@123',
    badge: '5-Day Streak • 1,450 XP',
    desc: '3 months learning history, 75% DSA mastery'
  },
  {
    role: 'Beginner Student',
    email: 'beginner@EchoXScholar.ai',
    password: 'Demo@123',
    badge: '⚠️ Active Prerequisite Gap',
    desc: '45% mastery, confusion warning on Recursion & DP'
  },
  {
    role: 'Placement Candidate',
    email: 'placement@EchoXScholar.ai',
    password: 'Demo@123',
    badge: 'Mock Interview Scorecards',
    desc: 'System Design Caching & HR Interview feedback'
  },
  {
    role: 'Advanced Scholar',
    email: 'advanced@EchoXScholar.ai',
    password: 'Demo@123',
    badge: '92% Mastery • Level 5',
    desc: '3,200 XP, System Design Specialist'
  },
  {
    role: 'System Admin Lead',
    email: 'admin@EchoXScholar.ai',
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
