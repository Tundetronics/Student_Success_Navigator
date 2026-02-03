import React, { useState } from 'react';
import { GraduationCap, Volume2, X, Settings, Sparkles, Heart } from 'lucide-react';

const apiKey = ""; 

const App = () => {
  const [val, setVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_~`\[\]()<>]/g, '').replace(/\n\n/g, '. ');
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(clean));
  };

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Expert counselor for GSS Garki. Create an 8-day study plan. Plain text only.";
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } }) 
      });
      const d = await r.json();
      return d.candidates[0].content.parts[0].text;
    } catch (e) { return "Connection failed."; } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <nav className="p-6 border-b border-white/10 flex justify-between items-center"><div className="flex items-center gap-3 font-black uppercase text-sm text-yellow-500"><GraduationCap/> Student Navigator</div></nav>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter">Success <span className="text-yellow-500 underline decoration-blue-500">Blueprint</span></h1>
        <div className="w-full max-w-xl bg-white/5 p-8 rounded-[40px] border border-white/10 space-y-6">
          <input value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-black/50 p-6 rounded-2xl text-center text-2xl outline-none" placeholder="e.g. Maths, Physics" />
          <button onClick={async () => { const res = await callAI(`Plan: ${val}`); setResult(res); setShowModal(true); }} className="w-full bg-blue-600 py-6 rounded-2xl font-black text-xl uppercase tracking-widest">Orchestrate</button>
        </div>
      </main>
      <footer className="bg-blue-900 h-20 border-t-8 border-yellow-500 flex items-center justify-between px-10">
        <p className="text-sm font-black uppercase">HighRise x GSS Garki</p><Heart className="text-yellow-500 fill-yellow-500 animate-pulse" />
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-yellow-500/40 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-yellow-500">Orchestrated Plan</h2>
              <div className="flex gap-4"><button onClick={() => speak(result)} className="bg-blue-600 px-8 py-2 rounded-xl font-bold flex items-center gap-2"><Volume2 size={20}/> Listen</button><button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl"><X/></button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap">{result}</div>
          </div>
        </div>
      )}
      {isProcessing && <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center font-black uppercase text-2xl animate-pulse">Orchestrating...</div>}
    </div>
  );
};
export default App;
