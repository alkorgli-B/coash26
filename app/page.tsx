"use client";

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Camera, Mic, Play, Shield, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ملاحظة: نحتاج تثبيت المكتبات التالية:
// npm install lucide-react framer-motion

export default function Coash26() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [status, setStatus] = useState('OFFLINE');
  const [log, setLog] = useState('نظام Senku جاهز للعمل. وجه الكاميرا نحو الشاشة.');
  const [synergy, setSynergy] = useState(100);

  // دالة النطق الصوتي (Text to Speech)
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    window.speechSynthesis.speak(utterance);
    setLog(text);
  };

  // تشغيل النظام
  const startEngine = async () => {
    setIsStarted(true);
    setStatus('INITIALIZING AI...');
    
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
      
      // هنا يبدأ تحليل الصوت
      startVoiceRecognition();
    } catch (err) {
      setStatus('ERROR: ACCESS DENIED');
      console.error(err);
    }
  };

  // محرك التعرف على الكلام
  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = true;
      recognition.onresult = (event: any) => {
        const text = event.results[event.results.length - 1][0].transcript;
        if (text.includes("هدف") || text.includes("قووول")) {
          setSynergy(prev => Math.min(prev + 10, 100));
          speak("هدف أسطوري! التناغم زاد بينكم يا وحوش.");
        } else if (text.includes("خسارة") || text.includes("غلطة")) {
          setSynergy(prev => Math.max(prev - 15, 0));
          speak("مش وقت اللوم، ركزوا في المرتدة الجاية.");
        }
      };
      recognition.start();
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      <Head>
        <title>Coash26 | Senku AI</title>
      </Head>

      {/* خلفية الكاميرا مع فلتر نيون */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[0.5] contrast-[1.2]"
      />

      {/* طبقة الواجهة (UI Overlay) */}
      <div className="relative z-10 flex flex-col h-screen p-6 justify-between pointer-events-none">
        
        {/* Header: حالة النظام */}
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-black/60 border border-cyan-500 p-4 rounded-xl backdrop-blur-md"
          >
            <h1 className="text-cyan-400 font-bold text-xl tracking-tighter">PROJECT SENKU</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-[10px] text-gray-300">{status}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-black/60 border border-blue-500 p-4 rounded-xl backdrop-blur-md text-right"
          >
            <div className="text-[10px] text-blue-400">SYNERGY LEVEL</div>
            <div className="text-2xl font-black text-white">{synergy}%</div>
          </motion.div>
        </div>

        {/* Center: زر التشغيل */}
        {!isStarted && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startEngine}
            className="pointer-events-auto self-center bg-cyan-500 text-black px-10 py-5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center gap-3"
          >
            <Play fill="black" /> ACTIVATE AI
          </motion.button>
        )}

        {/* Bottom: سجل البيانات والتحليل */}
        <div className="space-y-4">
          <AnimatePresence>
            {isStarted && (
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-t-2 border-cyan-500 p-6 backdrop-blur-xl rounded-t-3xl"
              >
                <div className="flex gap-6 overflow-x-auto pb-2">
                  <StatCard icon={<Shield size={16}/>} label="DEFENSE" value="STABLE" />
                  <StatCard icon={<Zap size={16}/>} label="ATTACK" value="HIGH" />
                  <StatCard icon={<TrendingUp size={16}/>} label="POSSESSION" value="55%" />
                </div>
                <div className="mt-4 text-cyan-200 text-sm italic">
                  &gt; {log}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/*装饰: نيون نويز */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-cyan-500/10" />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="min-w-[100px] bg-black/40 p-3 rounded-lg border border-white/10">
      <div className="text-gray-400 flex items-center gap-1 text-[9px] mb-1">
        {icon} {label}
      </div>
      <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}
