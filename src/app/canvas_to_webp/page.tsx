"use client"
import {useRef, useEffect, RefObject} from 'react'
import styles from './page.module.css'

const drawClock = (clockCanvasElement: HTMLCanvasElement) => {
  const now = new Date();
  const ctx = clockCanvasElement.getContext('2d');
  if (!ctx) return

  ctx.save();
  ctx.clearRect(0, 0, 150, 150);
  ctx.translate(75, 75);
  ctx.scale(0.4, 0.4);
  ctx.rotate(-Math.PI / 2);

  ctx.beginPath();
  ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
  ctx.fillStyle = 'white';
  ctx.fill();

  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';

  // 文字盤の時
  ctx.save();
  for (var i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 6);
    ctx.moveTo(100, 0);
    ctx.lineTo(120, 0);
    ctx.stroke();
  }
  ctx.restore();

  // 文字盤の分
  ctx.save();
  ctx.lineWidth = 5;
  for (i = 0; i < 60; i++) {
    if (i % 5!= 0) {
      ctx.beginPath();
      ctx.moveTo(117, 0);
      ctx.lineTo(120, 0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI / 30);
  }
  ctx.restore();

  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hr  = now.getHours();
  hr = hr >= 12 ? hr - 12 : hr;

  ctx.fillStyle = 'black';

  // 時針
  ctx.save();
  ctx.rotate(hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) *sec);
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(80, 0);
  ctx.stroke();
  ctx.restore();

  // 分針
  ctx.save();
  ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(112, 0);
  ctx.stroke();
  ctx.restore();

  // 秒針
  ctx.save();
  ctx.rotate(sec * Math.PI / 30);
  ctx.strokeStyle = '#D40000';
  ctx.fillStyle = '#D40000';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(83, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#325FA2';
  ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
  ctx.stroke();

  ctx.restore();

  window.requestAnimationFrame(() => {
    drawClock(clockCanvasElement);
  });
}

export default function CanvasToWebp() {
  const clockCanvasRef = useRef<HTMLCanvasElement>(null);

  const onClickCreateWebp = async(clockCanvasRef: RefObject<HTMLCanvasElement>) => {
    if (!clockCanvasRef.current) return

    const clockCanvasElement = clockCanvasRef.current;

    let counter = 0
    console.log('record')
    const ms = new MediaStream();
    ms.addTrack(clockCanvasElement.captureStream().getTracks()[0]);
    const recorder = new MediaRecorder(ms);

    const rec: { data: Array<Blob>; type: string } = { data: [], type: "" };
    recorder.ondataavailable = (e) => {
      console.log('record ooo')
      rec.type = e.data.type;
      rec.data.push(e.data);
    };
    recorder.onstop = () => {
      console.log("onstop");
      const blob = new Blob(rec.data, { type: rec.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `movie.webm`;
      a.href = url;
      a.click();
    };
    recorder.start();

    const timerId = window.setInterval(function(){
      if (counter >= 5) {
        recorder.stop()
        window.clearInterval(timerId)
        return
      }

      counter++
    }, 1000)
  }

  useEffect(() => {
    if (!clockCanvasRef.current) return

    const clockCanvasElement = clockCanvasRef.current;
    window.requestAnimationFrame(() => {
      drawClock(clockCanvasElement);
    });
  })

  return (
    <>
      <main>
        <h1>
          canvasをwebpに
        </h1>
        <canvas ref={clockCanvasRef} width="150" height="150"></canvas>
        <div>↑canvas</div>
        <div>
          <button onClick={() => { onClickCreateWebp(clockCanvasRef) }}>動画作成</button>
        </div>
      </main>
    </>
  )
}
