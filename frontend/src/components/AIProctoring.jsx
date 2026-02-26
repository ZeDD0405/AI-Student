
// import React, { useRef, useEffect } from "react";
// import Webcam from "react-webcam";
// import { FaceMesh } from "@mediapipe/face_mesh";
// import { Camera } from "@mediapipe/camera_utils";

// const AIProctoring = ({ onViolation, isActive }) => {
//   const webcamRef = useRef(null);
//   const cameraRef = useRef(null);

//   const noFaceCounter = useRef(0);
//   const multiFaceCounter = useRef(0);

//   useEffect(() => {
//     if (!isActive) return;

//     let interval;

//     const startDetection = () => {
//       const video = webcamRef.current?.video;

//       if (!video || video.readyState !== 4) {
//         return;
//       }

//       console.log("✅ Proctoring Started");

//       const faceMesh = new FaceMesh({
//         locateFile: (file) =>
//           `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
//       });

//       faceMesh.setOptions({
//         maxNumFaces: 2,
//         refineLandmarks: true,
//         minDetectionConfidence: 0.5,
//         minTrackingConfidence: 0.5,
//       });

//       faceMesh.onResults((results) => {
//         const faces = results.multiFaceLandmarks;

//         if (!faces || faces.length === 0) {
//           noFaceCounter.current++;

//           if (noFaceCounter.current > 25) {
//             console.log("🚨 NO FACE");
//             onViolation("NO_FACE");
//             noFaceCounter.current = 0;
//           }
//           return;
//         }

//         noFaceCounter.current = 0;

//         if (faces.length > 1) {
//           multiFaceCounter.current++;

//           if (multiFaceCounter.current > 15) {
//             console.log("🚨 MULTIPLE FACE");
//             onViolation("MULTIPLE_FACE");
//             multiFaceCounter.current = 0;
//           }
//         } else {
//           multiFaceCounter.current = 0;
//         }
//       });

//       cameraRef.current = new Camera(video, {
//         onFrame: async () => {
//           await faceMesh.send({ image: video });
//         },
//         width: 640,
//         height: 480,
//       });

//       cameraRef.current.start();

//       clearInterval(interval);
//     };

//     interval = setInterval(startDetection, 1000);

//     return () => {
//       console.log("🛑 Proctoring Stopped");

//       if (cameraRef.current) {
//         cameraRef.current.stop();
//       }

//       if (webcamRef.current?.video?.srcObject) {
//         webcamRef.current.video.srcObject
//           .getTracks()
//           .forEach((track) => track.stop());
//       }
//     };
//   }, [isActive, onViolation]);

//   if (!isActive) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         bottom: 10,
//         right: 10,
//         zIndex: 9999,
//         border: "2px solid #007bff",
//         borderRadius: "8px",
//         overflow: "hidden",
//       }}
//     >
//       <Webcam
//         ref={webcamRef}
//         width={220}
//         height={160}
//         audio={false}
//       />
//     </div>
//   );
// };

// export default AIProctoring;

import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const AIProctoring = ({ onViolation, isActive }) => {
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);
  const startedRef = useRef(false);

  const noFaceCounter = useRef(0);
  const multiFaceCounter = useRef(0);

  useEffect(() => {
    if (!isActive) {
      stopCamera();
      return;
    }

    if (startedRef.current) return; // prevent multiple start
    startedRef.current = true;

    let faceMesh;

    const start = async () => {
      const video = webcamRef.current?.video;
      if (!video) return;

      console.log("🎥 Proctoring Started");

      faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 2,
        refineLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      faceMesh.onResults((results) => {
        const faces = results.multiFaceLandmarks;

        if (!faces || faces.length === 0) {
          noFaceCounter.current++;

          if (noFaceCounter.current > 40) {
            console.log("🚨 NO FACE");
            onViolation("NO_FACE");
            noFaceCounter.current = 0;
          }
          return;
        }

        noFaceCounter.current = 0;

        if (faces.length > 1) {
          multiFaceCounter.current++;

          if (multiFaceCounter.current > 25) {
            console.log("🚨 MULTIPLE FACE");
            onViolation("MULTIPLE_FACE");
            multiFaceCounter.current = 0;
          }
        } else {
          multiFaceCounter.current = 0;
        }
      });

      cameraRef.current = new Camera(video, {
        onFrame: async () => {
          if (faceMesh) {
            await faceMesh.send({ image: video });
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current.start();
    };

    const timer = setTimeout(start, 1200);

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [isActive]);

  const stopCamera = () => {
    console.log("🛑 Proctoring Stopped");

    startedRef.current = false;

    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }

    const video = webcamRef.current?.video;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        zIndex: 9999,
        border: "2px solid #007bff",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <Webcam
        ref={webcamRef}
        width={220}
        height={160}
        audio={false}
        mirrored={true}
        videoConstraints={{
          facingMode: "user",
        }}
      />
    </div>
  );
};

export default AIProctoring;