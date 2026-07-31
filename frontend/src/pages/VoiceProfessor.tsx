import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
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
      text: "Namaste! I am your AI Socratic Voice Professor. I see your Learning DNA shows confusion in Dynamic Programming state transitions. Shall we break down Memoization vs Tabulation with an intuitive analogy in Teluglish?",
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>Socratic AI Classroom • Vernacular Audio Enabled</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">
            AI Voice <span className="gradient-text">Professor</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Adapts Socratic follow-up questions to your Cognitive Twin DNA profile.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
          >
            <option value="Teluglish" className="bg-slate-900">Teluglish (Telugu + Eng)</option>
            <option value="Hinglish" className="bg-slate-900">Hinglish (Hindi + Eng)</option>
            <option value="English" className="bg-slate-900">English (Standard)</option>
          </select>
        </div>
      </div>

      {/* Main Classroom Panel */}
      <div className="glass-card rounded-2xl p-6 space-y-6 border border-cyan-500/20 min-h-[450px] flex flex-col justify-between">
        
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
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    <button className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline">
                      <Volume2 className="w-3 h-3" /> Listen Audio (Edge-TTS)
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>AI Socratic Professor is formulating explanation...</span>
            </div>
          )}
        </div>

        {/* Audio Mic & Input Controls */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            
            {/* Mic Toggle Button */}
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all shadow-md ${
                isRecording
                  ? 'bg-red-600 animate-pulse shadow-red-600/40'
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30'
              }`}
              title={isRecording ? 'Stop Recording' : 'Start Speech Mic'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Box */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Professor a question or respond to Socratic prompt..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center gap-2"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
