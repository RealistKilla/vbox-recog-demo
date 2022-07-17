import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef();

  useEffect(() => {
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
    </div>
  );
}
