'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  const [streaming, setStreaming] = useState(false);
  const [caption, setCaption] = useState('');
  const [imageData, setImageData] = useState('');
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef) videoRef.srcObject = stream;
    setStreaming(true);
  }

  function captureImage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!videoRef || !context) return;

    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    context.drawImage(videoRef, 0, 0);
    const data = canvas.toDataURL('image/png');
    setImageData(data);
  }

  async function uploadImage() {
    if (!imageData || !caption) return alert('Image + Caption required');
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ caption, image: imageData }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) alert('Uploaded!');
  }

  return (
    <main className="min-h-screen bg-cover bg-center flex items-center justify-center px-4" style={{ backgroundImage: "url('/assets/WorkoutGrassy.png')" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-yellow-100 p-6 rounded-3xl shadow-xl w-full max-w-md text-center"
      >
        <motion.h1
          className="font-mono text-3xl mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to RealFeed
        </motion.h1>

        <p className="mb-4 text-gray-600">Share your moments, connect with clubs, and more!</p>

        <video ref={(ref) => setVideoRef(ref)} autoPlay className="rounded-xl w-full mb-2 shadow" />

        <input
          type="text"
          placeholder="Add caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 mb-2 rounded border"
        />

        <div className="flex flex-col gap-2">
          {['Start Camera', 'Capture', 'Upload'].map((label, i) => {
            const actions = [startCamera, captureImage, uploadImage];
            return (
              <motion.button
                key={label}
                onClick={actions[i]}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-400 hover:bg-pink-500 transition-all text-white py-2 rounded shadow"
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
