import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BrainCircuit, Volume2, 
  Download, QrCode, X, ArrowLeft, ArrowRight,
  ShieldCheck, Heart, Settings, Sparkles
} from 'lucide-react';

const apiKey = ""; // Provided at runtime

const App = () => {
  const [val, setVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Expert academic counselor for GSS Garki students. Create an 8-day intensive study plan. Use plain human-friendly text only. No markdown.";
    
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: sys }] }
        }) 
      });
      const d = await r.json();
      return d.candidates[0].content.parts[0].text;
    } catch (e) {
      return "Orchestration interrupted. Please check your connection.";
    } finally {
      setIsProcessing(false);
    }
  };

  const runOrchestration = async () => {
    if (!val) return;
    const res = await callAI(`Plan for: ${val}`);
    setResult(res);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      {/* Header */}
      <nav className="p-6 border-b border-white/10 bg-black/40 backdrop-blur-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-yellow-500" />
          <span className="font-black tracking-widest uppercase text-sm">Success Navigator</span>
        </div>
        <div className="text-[10px] font-bold text-blue-400 tracking-[0.3em] uppercase">GSS Garki Edition</div>
      </nav>

      {/* Main UI */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Orchestrate Your <br/><span className="text-yellow-500 italic">Academic Future</span>
          </h1>
          <p className="text-xl text-slate-400">Enter your subjects or target exam (JAMB/WAEC) to generate your personalized 8-day success blueprint.</p>
        </div>

        <div className="w-full max-w-xl bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-2xl space-y-6">
          <input 
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full bg-black/50 p-6 rounded-2xl text-white text-center text-2xl outline-none border border-white/10 focus:border-blue-500 transition-all"
            placeholder="e.g. Maths, Physics, Biology"
          />
          <button 
            onClick={runOrchestration}
            className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Sparkles size={24}/> Orchestrate Blueprint
          </button>
        </div>

        <div className="flex gap-8 items-center bg-blue-900/20 p-6 rounded-3xl border border-blue-500/20">
            <div className="bg-white p-2 rounded-xl"><QrCode size={80} className="text-black"/></div>
            <div className="text-left">
                <p className="font-black text-white uppercase text-sm">Share with Classmates</p>
                <p className="text-yellow-500 font-bold text-xs uppercase tracking-widest">bit.ly/GarkiStudentAI</p>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 h-20 border-t-8 border-yellow-500 flex items-center justify-between px-10">
        <div className="flex items-center gap-4">
          <Settings className="text-yellow-500 animate-spin-slow" size={24} />
          <p className="text-sm lg:text-lg font-black text-white uppercase">The Rotary Club of Abuja HighRise</p>
        </div>
        <Heart className="text-yellow-500 fill-yellow-500 animate-pulse" />
      </footer>

      {/* Result Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-yellow-500/40 rounded-[40px] w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white uppercase">Your Success Blueprint</h2>
              <div className="flex gap-3">
                <button onClick={() => window.speechSynthesis.speak(new SpeechSynthesisUtterance(result))} className="bg-blue-600 p-3 rounded-xl text-white"><Volume2/></button>
                <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl text-white"><X/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
              {result}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center space-y-6">
          <div className="h-20 w-20 border-8 border-t-yellow-500 border-white/5 rounded-full animate-spin"></div>
          <p className="text-xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Calculating Path...</p>
        </div>
      )}

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
