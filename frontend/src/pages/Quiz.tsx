import React from 'react';
import { InteractiveQuiz } from '../components/InteractiveQuiz';

export const Quiz: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto transition-colors">
      <InteractiveQuiz />
    </div>
  );
};
export default Quiz;
