import './style.css'

/* 
// Face detection */
import * as faceapi from 'face-api.js';
const video = document.querySelector('video');
let hasDetection = false;
async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
  startVideo();
}
async function startVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    if (detections.length > 0 && !hasDetection) {
      hasDetection = true;
      // Maak een canvas element en voeg deze toe aan de pagina
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);

      // Verkrijg een 2D context van de canvas
      const ctx = canvas.getContext('2d');

      // Kies de positie en kleur van de bol
      const x = 100; // vervang door gewenste x-coördinaat
      const y = 100; // vervang door gewenste y-coördinaat
      const r = 50; // straal van de bol
      const color = 'red'; // vervang door gewenste kleur

      // Teken de bol
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    } else if (detections.length === 0) {
      hasDetection = false;
    }
    console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 2000);
});
loadModels();