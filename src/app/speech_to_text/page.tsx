"use client"
import {useRef, useEffect, RefObject} from 'react'
import styles from './page.module.css'
import 'regenerator-runtime'
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

let recorder: MediaRecorder

export default function SpeechToText() {
  const speechCanvasRef = useRef<HTMLCanvasElement>(null);
  const { transcript, listening } = useSpeechRecognition();

  const onClickRegStart = async(speechCanvasRef: RefObject<HTMLCanvasElement>) => {
    if (!speechCanvasRef.current) return
    const speechCanvasElement = speechCanvasRef.current
    if (!speechCanvasElement) return

    const ctx = speechCanvasElement.getContext('2d');
    if (!ctx) return
    ctx.save();
    ctx.clearRect(0, 0, speechCanvasElement.width, speechCanvasElement.height);

    const mediaStream = new MediaStream();
    recorder = new MediaRecorder(mediaStream);

    mediaStream.addTrack(speechCanvasElement.captureStream().getTracks()[0]);
    const audioStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    })
    mediaStream.addTrack(audioStream.getTracks()[0]);
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
    
    SpeechRecognition.startListening({ continuous: true, language: 'ja-JP' });
  }

  const onClickRegStop = async(speechCanvasRef: RefObject<HTMLCanvasElement>) => {
    if (!speechCanvasRef.current) return

    SpeechRecognition.stopListening()
    recorder.stop()
  }

  useEffect(() => {
    if (!speechCanvasRef.current) return
    const speechCanvasElement = speechCanvasRef.current
    if (!speechCanvasElement) return

    const ctx = speechCanvasElement.getContext('2d');
    if (!ctx) return

    const results: string[] = [];
    let tmp = "";
    transcript.split("").forEach((row) => {
      tmp = tmp + row;
      // 16文字の場合に配列に入れる
      if (tmp.length === 16) {
        results.push(tmp);
        // 文字カウント用の変数をクリア
        tmp = "";
      }
    });
    const length = results.join("").length;
    results.push(transcript.slice(length));
  
    ctx.save();
    ctx.clearRect(0, 0, speechCanvasElement.width, speechCanvasElement.height);
    ctx.font = '16px serif';
    ctx.strokeStyle = 'white';
    results.map((result, index) => {
      // 16px*インデックス でY軸を指定する
      ctx.strokeText(result, 0, 30 + (16 * index));
    });
  })

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
          <button onClick={() => { onClickRegStart(speechCanvasRef)}} disabled={listening}>録音開始</button>
          <button onClick={() => { onClickRegStop(speechCanvasRef) }} disabled={!listening}>録音停止</button>
        </div>
      </main>
    </>
  )
}
