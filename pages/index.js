import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import * as faceapi from "face-api.js";

import { useEffect, useRef } from "react";
import { FaceDetection } from "face-api.js";

import { LoadModels } from "../utils/LoadModels";

export default function Home() {
  const videoRef = useRef();

  const canvasRef = useRef();

  useEffect(() => {
    startVideo();

    videoRef && loadModels();
  }, []);
  const loadModels = () => {
    LoadModels().then(() => {
      faceDetection();
    });
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => console.log(err));
  };

  const faceDetection = async () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );

      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650,
      });

      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);

      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);

      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    }, 1000);
  };
  return (
    <div className={styles.app}>
      <h1>AI FACE DETECTION</h1>
      <div className={styles.app_video}>
        <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
      </div>
      <canvas
        ref={canvasRef}
        width="940"
        height="650"
        className={styles.app_canvas}
      ></canvas>
    </div>
  );
}
