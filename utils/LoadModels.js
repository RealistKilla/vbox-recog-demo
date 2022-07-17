import React from "react";

import * as faceapi from "face-api.js";

export const LoadModels = (anonfunction) => {
  return Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),

    faceapi.nets.ageGenderNet.loadFromUri("/models"),
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  ]);
};
