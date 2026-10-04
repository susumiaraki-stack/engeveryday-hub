import React, { useState } from 'react';
import { ArrowLeft, Send, Smile, Sparkles, CheckCheck } from 'lucide-react';
import type { ScreenName, ChatMessage } from '../types';
import confetti from 'canvas-confetti';

interface RealChatArenaProps {
  onNavigate: (screen: ScreenName) => void;
  onAddXp: (amount: number) => void;
}

export const RealChatArena: React.FC<RealChatArenaProps> = ({ onNavigate, onAddXp }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'alex',
      text: "Hey! Are you free this afternoon? We're going to the night market 🍢🔥",
      timestamp: '2:32 PM',
    },
    {
      id: '2',
      sender: 'alex',
      text: 'tbh I really want to try mango sticky rice haha',
      timestamp: '2:32 PM',
      slangTip: "💡 Slang Tip: 'tbh' means 'To be honest'",
    },
    {
      id: '3',
      sender: 'student',
      text: 'Sounds awesome! Count me in 🎉',
      timestamp: '2:34 PM',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isAlexTyping, setIsAlexTyping] = useState(false);
  const [goalCount, setGoalCount] = useState(2);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'student',
      text: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    setGoalCount(3);
    onAddXp(20);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });

    // Simulate Alex typing back
    setIsAlexTyping(true);
    setTimeout(() => {
      setIsAlexTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'alex',
          text: 'No worries at all! See you there around 5:30! 🥳',
          timestamp: 'Just now',
        },
      ]);
    }, 1500);
  };

  const handleChipClick = (phrase: string) => {
    setInputVal((prev) => (prev ? `${prev} ${phrase}` : phrase));
  };

  return (
    <div className="flex flex-col h-full bg-[#faf8f5] text-slate-800 font-sans">
      {/* Top Header */}
      <div className="p-3.5 bg-white border-b border-slate-200/70 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-200 to-rose-300 flex items-center justify-center text-lg">
              👱‍♂️
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">Alex (Exchange Student)</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Active now • English</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
          <span>Translate</span>
          <div className="w-7 h-4 bg-emerald-500 rounded-full p-0.5 flex justify-end">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        <div className="text-center my-1">
          <span className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-[10px] font-bold text-emerald-700">
            REAL-CHAT & SLANG ARENA • +20 XP
          </span>
          <p className="text-[10px] text-slate-400 mt-1">Today, 2:32 PM</p>
        </div>

        {messages.map((msg) => {
          if (msg.sender === 'alex') {
            return (
              <div key={msg.id} className="space-y-1.5">
                <div className="flex items-end gap-2 max-w-[82%]">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs shrink-0">
                    👱‍♂️
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs p-3.5 shadow-2xs">
                    <p className="text-xs font-medium text-slate-800 leading-relaxed">{msg.text}</p>
                  </div>
                </div>

                {msg.slangTip && (
                  <div className="ml-9 inline-block px-2.5 py-1 bg-orange-50 border border-orange-200/70 text-orange-700 text-[10px] font-bold rounded-lg shadow-2xs">
                    {msg.slangTip}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl rounded-br-xs p-3.5 max-w-[82%] shadow-sm">
                <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                Delivered • {msg.timestamp}
                <CheckCheck className="w-3 h-3 text-emerald-500" />
              </span>
            </div>
          );
        })}

        {isAlexTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
            <div className="flex gap-1 bg-white p-2.5 rounded-full border border-slate-200 shadow-2xs">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></div>
            </div>
            <span className="text-[10px]">Alex is typing...</span>
          </div>
        )}
      </div>

      {/* Scaffolding & Input Area */}
      <div className="p-4 bg-white border-t border-slate-200/80 space-y-3">
        {/* Scaffolding Prompt Box */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl">
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Your turn: Tell Alex you'd love to come, but you might be 10 minutes late.</span>
          </div>

          {/* Quick Slang/Phrase Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {["I'm down!", "Count me in!", "Running a bit late 🏃‍♂️", "See ya soon!"].map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-[10px] font-semibold text-emerald-800 hover:bg-emerald-100/50 active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Field */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-slate-100 rounded-2xl px-3.5 py-2 border border-slate-200/60 focus-within:border-orange-400 focus-within:bg-white transition-all">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your reply..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
            <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Keep it friendly and natural ✨</span>
          <span className="font-bold text-orange-600">{goalCount} / 3 chat goals</span>
        </div>
      </div>
    </div>
  );
};
