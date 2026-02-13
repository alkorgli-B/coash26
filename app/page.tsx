"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Play, Shield, Zap, Activity, Eye, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Coash26() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [status, setStatus] = useState('OFFLINE');
  const [log, setLog] = useState('نظام Senku جاهز. وجه الكاميرا نحو الشاشة.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
      setLog(text);
    }
  };

  const startEngine = async () => {
    setIsStarted(true);
    setStatus('تحميل عقل المدرب...');
    
    try {
      const model = await cocossd.load();
      setStatus('AI READY');

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setStatus('ONLINE');
      setIsAnalyzing(true);
      speak("تم تفعيل مدرب سنكو الذكي. أنا الآن أحلل المباراة مباشرة.");

      const detect = async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const predictions = await model.detect(videoRef.current);
          
          predictions.forEach(p => {
            if (p.class === 'sports ball' && p.score > 0.6) {
               // منطق التحليل هنا
            }
          });
        }
        requestAnimationFrame(detect);
      };
      detect();

    } catch (err) {
      setStatus('ERROR');
      setLog("تأكد من إعطاء صلاحيات الكاميرا والمايك.");
    }
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-hidden">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.2]" />

      <div className="relative z-10 flex flex-col h-screen p-6 justify-between pointer-events-none">
        <div className="flex justify-between items-start pt-4">
          <div className="bg-black/80 border border-cyan-500/50 p-4 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <h1 className="text-cyan-400 font-black text-xl italic">COACH 26 AI</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-widest">{status}</span>
            </div>
          </div>
          {isAnalyzing && (
            <div className="bg-red-500/20 border border-red-500 p-2 rounded-lg flex items-center gap-2 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              <Eye size={14} className="text-red-500" />
              <span className="text-[10px] font-bold">ANALYSIS ACTIVE</span>
            </div>
          )}
        </div>

        {!isStarted && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={startEngine}
            className="pointer-events-auto self-center bg-gradient-to-br from-cyan-400 to-blue-600 text-black px-12 py-6 rounded-3xl font-black text-xl shadow-[0_0_50px_rgba(6,182,212,0.5)] flex flex-col items-center gap-2"
          >
            <Play fill="black" size={24} />
            <span>START SENKU AI</span>
          </motion.button>
        )}

        <div className="mb-6 space-y-4">
          <AnimatePresence>
            {isStarted && (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/90 border-t-4 border-cyan-500 p-6 backdrop-blur-3xl rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
                <div className="flex gap-4 mb-4 overflow-x-auto no-scrollbar">
                   <div className="min-w-[120px] bg-cyan-500/10 border border-cyan-500/30 p-2 rounded-lg text-cyan-400 text-[10px] font-bold flex items-center gap-2 uppercase tracking-tighter"><Activity size={12}/> Vision Engine</div>
                   <div className="min-w-[120px] bg-blue-500/10 border border-blue-500/30 p-2 rounded-lg text-blue-400 text-[10px] font-bold flex items-center gap-2 uppercase tracking-tighter"><Zap size={12}/> Voice Sync</div>
                </div>
                <div className="p-4 bg-cyan-950/20 border-r-4 border-cyan-500 rounded-xl text-cyan-100 text-sm leading-relaxed italic">
                  &gt; {log}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none border-[1px] border-cyan-500/10" />
    </main>
  );
}
