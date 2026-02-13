"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mic, Play, Shield, Zap, TrendingUp, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Coash26() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [status, setStatus] = useState('OFFLINE');
  const [log, setLog] = useState('نظام Senku جاهز. وجه الكاميرا نحو الشاشة.');
  const [synergy, setSynergy] = useState(100);

  // دالة النطق الصوتي
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // إلغاء أي صوت سابق
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
      setLog(text);
    }
  };

  const startEngine = async () => {
    setIsStarted(true);
    setStatus('INITIALIZING...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setStatus('ONLINE');
      speak("تم تفعيل مدرب سنكو. أنا الآن أراقب الأداء التكتيكي لثنائي بليستيشن 5.");
      startVoiceRecognition();
    } catch (err) {
      setStatus('ERROR');
      setLog("يرجى السماح بالوصول للكاميرا والمايك.");
    }
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const text = event.results[event.results.length - 1][0].transcript;
        if (text.includes("هدف") || text.includes("قوول") || text.includes("جول")) {
          setSynergy(prev => Math.min(prev + 10, 100));
          speak("هدف أسطوري! التناغم زاد بينكم يا وحوش.");
        } else if (text.includes("خسارة") || text.includes("غلطة") || text.includes("حي علينا")) {
          setSynergy(prev => Math.max(prev - 15, 0));
          speak("مش وقت اللوم، ركزوا في المرتدة الجاية.");
        }
      };
      
      recognition.onerror = () => {
        setTimeout(() => recognition.start(), 1000); // إعادة التشغيل عند الخطأ
      };

      recognition.start();
    }
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* كاميرا الموبايل */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale-[0.3]"
      />

      {/* واجهة المستخدم */}
      <div className="relative z-10 flex flex-col h-screen p-6 justify-between pointer-events-none">
        
        {/* العلوي: معلومات الحالة */}
        <div className="flex justify-between items-start pt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black/70 border border-cyan-500/50 p-4 rounded-2xl backdrop-blur-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <h1 className="text-cyan-400 font-black text-xl italic tracking-widest">COACH 26</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-mono text-cyan-200/70 tracking-widest">{status}</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black/70 border border-blue-500/50 p-4 rounded-2xl backdrop-blur-xl text-right">
            <div className="text-[9px] text-blue-400 font-bold mb-1 tracking-tighter uppercase">Synergy Level</div>
            <div className="text-3xl font-black text-white italic">{synergy}%</div>
          </motion.div>
        </div>

        {/* المنتصف: زر التفعيل */}
        <AnimatePresence>
          {!isStarted && (
            <motion.button
              exit={{ scale: 0, opacity: 0 }}
              onClick={startEngine}
              className="pointer-events-auto self-center bg-gradient-to-br from-cyan-400 to-blue-600 text-black px-12 py-6 rounded-2xl font-black text-xl shadow-[0_0_40px_rgba(6,182,212,0.5)] flex flex-col items-center gap-2"
            >
              <Play fill="black" size={32} />
              <span>ACTIVATE SENKU</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* السفلي: لوحة البيانات */}
        <div className="space-y-4 mb-4">
          <AnimatePresence>
            {isStarted && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-black/80 border-t-2 border-cyan-500 p-6 backdrop-blur-2xl rounded-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                  <StatItem icon={<Shield size={14}/>} label="DEF" value="STABLE" color="text-green-400" />
                  <StatItem icon={<Zap size={14}/>} label="ATK" value="AGGRESSIVE" color="text-orange-400" />
                  <StatItem icon={<Activity size={14}/>} label="LIVE" value="ANALYZING" color="text-cyan-400" />
                </div>
                <motion.div 
                  key={log}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-6 p-4 bg-cyan-950/30 border-r-4 border-cyan-500 rounded text-cyan-100 text-sm font-medium leading-relaxed"
                >
                  {log}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* تأثيرات جمالية نيون */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(6,182,212,0.1)] border-[1px] border-white/5" />
    </main>
  );
}

function StatItem({ icon, label, value, color }: any) {
  return (
    <div className="min-w-[120px] bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
      <div className="text-gray-500 flex items-center gap-2 text-[10px] font-bold mb-1 uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className={`text-xs font-black tracking-tight ${color}`}>{value}</div>
    </div>
  );
}
