export const trackActivity = (activityType: string, metadata: any = {}) => {
  const timestamp = new Date().toISOString();
  const event = {
    activityType,
    metadata,
    timestamp
  };

  // In a real application, this would send a POST request to the backend
  console.log(`[Tracking Event]: ${activityType}`, event);
  
  // Integration with primary analytics endpoint:
  // api.post('/analytics/track', event).catch(console.error);

  // Store locally for frontend gamification immediate updates
  const recentActivity = JSON.parse(localStorage.getItem('recent_activity') || '[]');
  recentActivity.unshift(event);
  localStorage.setItem('recent_activity', JSON.stringify(recentActivity.slice(0, 50)));
};

export const useActivityTracker = () => {
  return { trackActivity };
};
