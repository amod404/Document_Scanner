import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const ImageProcessor = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [mode, setMode] = useState(null); // 'upload' or 'camera'
  const [loading, setLoading] = useState(false);


  const videoConstraints = {
    width: 320,
    height: 240,
    facingMode: "user"
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setCapturedImage(imageURL);

    const formData = new FormData();
    formData.append("file", file);

    await sendToServer(formData);
  };

  const captureFromCamera = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);

    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");

    await sendToServer(formData);
  };

  const sendToServer = async (formData) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/process-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const resultBlob = await response.blob();
      const resultURL = URL.createObjectURL(resultBlob);
      setProcessedImage(resultURL);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setProcessedImage(null);
    setMode(null);
  };

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      {!mode && (
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={() => setMode('upload')}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload Image
          </button>
          <button
            onClick={() => setMode('camera')}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Use Webcam
          </button>
        </div>
      )}

      {mode === 'upload' && !capturedImage && (
        <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2"
            />
          </div>
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            Reset
          </button>
        </div>
      )}

      {mode === 'camera' && !capturedImage && (
        <div className="flex flex-col items-center space-y-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded shadow-md"
          />
          <div className='flex flex-col md:flex-row gap-4'>
            <button
              onClick={captureFromCamera}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Capture Image
            </button>
            
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <>
          <div className="flex flex-col md:flex-row gap-16 items-center justify-center">
            <div>
              <h4 className="text-lg font-medium text-center">Original</h4>
              <img src={capturedImage} alt="Captured" className="w-80 rounded border shadow" />
            </div>
            <div>
              {processedImage ? (<>
                <h4 className="text-lg font-medium text-center">Processed</h4>
                <img src={processedImage} alt="Processed" className="w-80 rounded border shadow" />
                
              </>
              ) : (
                <div className="flex justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-10">
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Reset
            </button>

            {processedImage && (
                <a href={processedImage} download="processed.jpg">
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >Download
                  </button>
                </a>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageProcessor;
