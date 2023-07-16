"use client"
import {useRef, useEffect, RefObject, useState} from 'react'
import styles from './page.module.css'

let recognition: SpeechRecognition
let mediaStream: MediaStream
let recorder: MediaRecorder

export default function SpeechToText() {
  const speechCanvasRef = useRef<HTMLCanvasElement>(null);

  const onClickRegStart = async(speechCanvasRef: RefObject<HTMLCanvasElement>) => {
    if (!speechCanvasRef.current) return
    const speechCanvasElement = speechCanvasRef.current
    if (!speechCanvasElement) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    mediaStream = new MediaStream();
    recorder = new MediaRecorder(mediaStream);

    mediaStream.addTrack(speechCanvasElement.captureStream().getTracks()[0]);
    const rec: { data: Array<Blob>; type: string } = { data: [], type: "" };
    recorder.ondataavailable = (e) => {
      rec.type = e.data.type;
      rec.data.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(rec.data, { type: rec.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `movie.webm`;
      a.href = url;
      a.click();
    };
    recorder.start();
    
    recognition.lang = "ja-JP";
    recognition.continuous = true;

    recognition.onresult = event => {
      const speechMessage = event.results[event.results.length - 1][0].transcript

      const ctx = speechCanvasElement.getContext('2d');
      if (!ctx) return

      ctx.save();
      ctx.clearRect(0, 0, speechCanvasElement.width, speechCanvasElement.height);
      ctx.font = '16px serif';
      ctx.strokeStyle = 'white';
      ctx.strokeText(speechMessage, 10, 50);
    };

    recognition.start();
  }

  const onClickRegStop = async(speechCanvasRef: RefObject<HTMLCanvasElement>) => {
    if (!speechCanvasRef.current) return

    recognition.stop();
    recorder.stop()
  }

  return (
    <>
      <main>
        <h1>
          会話の字幕補助
        </h1>
        <canvas
          ref={speechCanvasRef}
          width="300"
          height="200"
          style={{
            border: '1px solid white'
          }}>
          </canvas>
        <div>↑canvas</div>
        <div>
          <button onClick={() => { onClickRegStart(speechCanvasRef) }}>録音開始</button>
          <button onClick={() => { onClickRegStop(speechCanvasRef) }}>録音停止</button>
        </div>
      </main>
    </>
  )
}
