"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Play, Shield, Zap, Activity, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Coash26() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [status, setStatus] = useState('OFFLINE');
  const [log, setLog] = useState('نظام Senku جاهز. وجه الكاميرا نحو الشاشة.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // دالة النطق
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
      setLog(text);
    }
  };

  // تشغيل المحرك والذكاء الاصطناعي
  const startEngine = async () => {
    setIsStarted(true);
    setStatus('LOADING AI MODELS...');
    
    try {
      // 1. تحميل موديل الرؤية
      const model = await cocossd.load();
      setStatus('AI MODEL LOADED');

      // 2. تشغيل الكاميرا
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setStatus('ONLINE');
      setIsAnalyzing(true);
      speak("تم تفعيل عيون سنكو. أنا الآن أرى الملعب وأسمع صوتكم.");

      // 3. بدء حلقة التحليل (Detection Loop)
      const detect = async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const predictions = await model.detect(videoRef.current);
          
          // منطق تكتيكي بسيط: البحث عن الكرة أو اللاعبين
          predictions.forEach(p => {
            if (p.class === 'sports ball' && p.score > 0.6) {
              console.log("الكرة مرصودة!");
              // هنا نقدر نبرمج ردود فعل لو الكرة قريبة من المرمى
            }
          });
        }
        requestAnimationFrame(detect);
      };
      detect();

    } catch (err) {
      setStatus('ERROR');
      setLog("تأكد من إعطاء صلاحيات الكاميرا.");
    }
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-hidden">
      <video ref={videoRef} autoPlay playsinline muted className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.2]" />

      <div className="relative z-10 flex flex-col h-screen p-6 justify-between pointer-events-none">
        <div className="flex justify-between items-start pt-4">
          <div className="bg-black/80 border border-cyan-500/50 p-4 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <h1 className="text-cyan-400 font-black text-xl italic tracking-tighter">COACH 26 AI</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-[10px] font-mono text-cyan-200 tracking-widest">{status}</span>
            </div>
          </div>
          {isAnalyzing && (
            <div className="bg-red-500/20 border border-red-500 p-2 rounded-lg flex items-center gap-2 animate-pulse">
              <Eye size={14} className="text-red-500" />
              <span className="text-[10px] font-bold">LIVE ANALYSIS</span>
            </div>
          )}
        </div>

        {!isStarted && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startEngine}
            className="pointer-events-auto self-center bg-cyan-500 text-black px-12 py-6 rounded-2xl font-black text-xl shadow-[0_0_50px_rgba(6,182,212,0.6)]"
          >
            START AI COACH
          </motion.button>
        )}

        <div className="mb-6 space-y-4">
          <AnimatePresence>
            {isStarted && (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/90 border-t-4 border-cyan-500 p-6 backdrop-blur-3xl rounded-3xl">
                <div className="flex gap-4 overflow-hidden mb-4">
                   <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold"><Activity size={14}/> VISION ACTIVE</div>
                   <div className="flex items-center gap-2 text-blue-400 text-xs font-bold"><Zap size={14}/> VOICE SYNC</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-cyan-100 text-sm leading-relaxed italic">
                  &gt; {log}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none border-[1px] border-cyan-500/20" />
    </main>
  );
}
