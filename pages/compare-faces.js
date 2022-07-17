import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "../styles/CompareFaces.module.css";
import Tyler from "../public/images/Tyler-cr.jpg";
import Chris from "../public/images/Chris-cr.jpg";
import { LoadModels } from "../utils/LoadModels";

import * as faceapi from "face-api.js";

const CompareFaces = () => {
  const images = [
    {
      name: "Tyler",
      img: Tyler,
      value: "tyler",
    },
    {
      name: "Chris",
      img: Chris,
      value: "chris",
    },
  ];

  const [img1, setImg1] = useState(Tyler);
  const [img2, setImg2] = useState(Chris);

  const [euclideanDistance, setEuclideanDistance] = useState({
    face_1: "",
    face_2: "",
  });

  const { face_1, face_2 } = euclideanDistance;

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = () => {
    LoadModels().then(() => alert("loaded"));
  };

  const populateImages = () => {
    return images.map((prop) => {
      <option value={prop.value}>{prop.name}</option>;
    });
  };

  const handleSetEuclideanDistance = (descriptor, fieldName) => {
    console.log(fieldName);
    setEuclideanDistance({
      ...euclideanDistance,
      [fieldName]: descriptor.descriptor,
    });
  };

  const detection = async (image, fieldName) => {
    const detections = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptor();
    console.log(detections);
    handleSetEuclideanDistance(detections, fieldName);
  };

  const convertImage = async (img, fieldName) => {
    console.log("this is the img", img);
    const imageBlob = await fetch(img.src).then((res) => {
      return res.blob();
    });

    const image = await faceapi.bufferToImage(imageBlob);

    detection(image, fieldName);
  };

  const handlePictureChange = (prop, select) => {
    if (select === "person_1")
      return setImg1(prop.img), convertImage(prop.img, "face_1");
    if (select === "person_2")
      return setImg2(prop.img), convertImage(prop.img, "face_2");
  };

  const compareFaces = () => {
    const distance = faceapi.euclideanDistance(face_1, face_2);

    const distInverse = (1 - distance) * 100;

    alert(`Faces are ${distInverse}% identical`);
    console.log("comparing", distInverse, euclideanDistance);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.person}>
        <Image src={img1} />
        <label htmlFor="person_2">Choose a person:</label>
        <select name="person_2" id="person_2">
          {images.map((prop, key) => {
            return (
              <option
                value={prop.value}
                key={key}
                onClick={() => handlePictureChange(prop, "person_1")}
              >
                {prop.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className={styles.person}>
        <Image src={img2} />
        <label htmlFor="person_2">Choose a person:</label>
        <select name="person_2" id="person_2">
          {images.map((prop, key) => {
            return (
              <option
                value={prop.value}
                key={key}
                onClick={() => handlePictureChange(prop, "person_2")}
              >
                {prop.name}
              </option>
            );
          })}
        </select>
      </div>
      <button
        onClick={() => {
          compareFaces();
        }}
      >
        Compare
      </button>
    </div>
  );
};

export default CompareFaces;
