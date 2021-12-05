import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import Spring from './Spring';
import Camera from './Camera';
import Screen from './Screen';
import SmallCamera from './SmallCamera';

const Main = () => {
  const [isCamera, setIsCamera] = useState(false);
  const [isScreen, setIsScreen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isScreenPlaying, setIsScreenPlaying] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [screenStream, setScreenStream] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [canvasStream, setCanvasStream] = useState(null);
  const [activeRemoteStream, setActiveRemoteStream] = useState(false);
  const remoteRef = useRef();

  useEffect(() => {
    if (remoteStream && activeRemoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, activeRemoteStream]);

  const handleRemoteStream = (stream) => {
    if (stream !== undefined) {
      setRemoteStream(stream);
    }
  };

  const handleCanvasStream = (stream) => {
    if (stream !== undefined) {
      setCanvasStream(stream);
    }
  };

  const onClear = () => {
    console.log('cleared');
  };
  const onCapture = () => {
    console.log('captured');
  };
  const handleScreenStream = (screenStream) => {
    // console.log(screenStream);
    setScreenStream(screenStream);
  };
  const handleMediaStream = (mediaStream) => {
    // console.log(mediaStream);
    setMediaStream(mediaStream);
  };
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    background: '#f0f0f0'
  };
  return (
    <div className="main">
      {remoteStream && activeRemoteStream && (
        <Rnd
          onResize={null}
          style={style}
          default={{
            x: 400,
            y: 0,
            width: 240,
            height: 240
          }}
        >
          <video
            className="small_mob_video"
            ref={remoteRef}
            autoPlay
            playsInline
            muted
          ></video>
        </Rnd>
      )}
      {isScreen && (
        <Screen
          isScreenPlaying={isScreenPlaying}
          setIsScreenPlaying={setIsScreenPlaying}
          isCanvasEmpty={isCanvasEmpty}
          setIsCanvasEmpty={setIsCanvasEmpty}
          onClear={onClear}
          onCapture={onCapture}
          isScreen={isScreen}
          setIsScreen={setIsScreen}
          handleScreenStream={handleScreenStream}
        />
      )}
      {isCamera && !isScreen && (
        <Camera
          isVideoPlaying={isVideoPlaying}
          setIsVideoPlaying={setIsVideoPlaying}
          isCanvasEmpty={isCanvasEmpty}
          setIsCanvasEmpty={setIsCanvasEmpty}
          onClear={onClear}
          onCapture={onCapture}
          handleMediaStream={handleMediaStream}
        />
      )}
      {isCamera && isScreen && (
        <>
          <Rnd
            onResize={null}
            style={style}
            default={{
              x: 0,
              y: 0,
              width: 320,
              height: 320
            }}
          >
            <SmallCamera
              isVideoPlaying={isVideoPlaying}
              setIsVideoPlaying={setIsVideoPlaying}
              isCanvasEmpty={isCanvasEmpty}
              setIsCanvasEmpty={setIsCanvasEmpty}
              onClear={onClear}
              onCapture={onCapture}
              setIsCamera={setIsCamera}
              handleMediaStream={handleMediaStream}
            />
          </Rnd>
        </>
      )}
      <Spring
        isCanvasEmpty={isCanvasEmpty}
        isVideoPlaying={isVideoPlaying}
        isCamera={isCamera}
        setIsCamera={setIsCamera}
        isScreen={isScreen}
        setIsScreen={setIsScreen}
        screenStream={screenStream}
        mediaStream={mediaStream}
        handleRemoteStream={handleRemoteStream}
        setActiveRemoteStream={setActiveRemoteStream}
        handleCanvasStream={handleCanvasStream}
      />
    </div>
  );
};

export default Main;
