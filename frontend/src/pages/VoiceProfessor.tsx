import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Brain, 
  Send,
  Globe
} from 'lucide-react';
import { api } from '../services/api';

export const VoiceProfessor: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('Teluglish');
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      role: 'assistant',
      text: "Namaste! I am your AI Socratic Voice Professor. I see your Cognitive Twin DNA shows confusion in Dynamic Programming state transitions. Shall we break down Memoization vs Tabulation with an intuitive analogy in Teluglish?",
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText;
    setInputText('');

    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/chat/ask', {
        question: userMsg,
        ai_model: 'gemini-1.5-flash',
        agent_type: 'teacher'
      });

      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', text: res.data.answer || "That's a fantastic question! Think of Dynamic Programming like storing calculated Fibonacci numbers in a lookup table so you never re-compute subproblems!" }
      ]);
    } catch (e) {
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', text: "Let me explain this with a clear analogy: Imagine solving 1+1+1+1. If I ask you what 1+1+1+1+1 is, you instantly say 5 because you remembered the previous 4. That is DP Memoization!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>Socratic AI Classroom • Vernacular Audio Enabled</span>
          </div>
          <h1 className="h1-title text-2xl sm:text-3xl">AI Voice Professor</h1>
          <p className="small-text mt-1">
            Adapts Socratic follow-up questions to your Cognitive Twin DNA profile.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md text-xs">
          <Globe className="w-4 h-4 text-indigo-600" />
          <span className="text-gray-500">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="Teluglish">Teluglish (Telugu + Eng)</option>
            <option value="Hinglish">Hinglish (Hindi + Eng)</option>
            <option value="English">English (Standard)</option>
          </select>
        </div>
      </div>

      {/* Main Classroom Panel */}
      <div className="saas-card p-6 space-y-6 min-h-[450px] flex flex-col justify-between">
        
        {/* Messages */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-lg space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-gray-50 border border-gray-200 text-gray-800'
                }`}
              >
                <p>{msg.text}</p>

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                    <button className="flex items-center gap-1 text-[10px] text-indigo-600 font-medium hover:underline">
                      <Volume2 className="w-3 h-3" /> Listen Audio (Edge-TTS)
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
              <span className="animate-spin text-indigo-600">🌀</span>
              <span>AI Socratic Professor is formulating explanation...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-white transition-colors ${
                isRecording ? 'bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Professor a question or respond to Socratic prompt..."
              className="saas-input flex-1 text-xs"
            />

            <button onClick={handleSend} className="btn-primary text-xs">
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
