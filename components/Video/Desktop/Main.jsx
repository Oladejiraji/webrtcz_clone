import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import Spring from './Spring';
import Camera from './Camera';
import Screen from './Screen';
import SmallCamera from './SmallCamera';
import { Box } from '@chakra-ui/react';
import videoCanvas from 'video-canvas';

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
  const [activeRemoteCanvas, setActiveRemoteCanvas] = useState(false);
  const [psCanvas, setPsCanvas] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  const [speer, setSpeer] = useState(null);
  const remoteRef = useRef();
  const canvasRef = useRef();
  const realCanvasRef = useRef();
  const realDrawCanvasRef = useRef();

  useEffect(() => {
    if (remoteStream && activeRemoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
    if (canvasStream && activeRemoteCanvas) {
      console.log(canvasStream);
      canvasRef.current.srcObject = canvasStream;
    }
  }, [remoteStream, activeRemoteStream, canvasStream, activeRemoteCanvas]);

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

  const createCanvas = () => {
    if (realCanvasRef.current) {
      videoCanvas(canvasRef.current, {
        canvas: realCanvasRef.current
      });
      drawVideo();
    }
  };

  const drawVideo = () => {
    let width = canvasRef.current.videoWidth;
    let height = canvasRef.current.videoHeight;
    let ctx = realCanvasRef.current.getContext('2d');
    let backContext = realDrawCanvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, width > 0 ? width : 500, height > 0 ? height : 500);
    ctx.drawImage(
      canvasRef.current,
      0,
      0,
      width > 0 ? width : 500,
      height > 0 ? height : 500
    );
    const iData = ctx.getImageData(
      0,
      0,
      width > 0 ? width : 500,
      height > 0 ? height : 500
    );
    const data = iData.data;
    for (let i = 0; i < data.length; i += 4) {
      let red = data[i];
      let green = data[i + 1];
      let blue = data[i + 2];
      let alpha = data[i + 3];
      if (red == 0 && green == 0 && blue == 0) {
        iData.data[i + 3] = 0;
      }
    }
    backContext.putImageData(iData, 0, 0);
    requestAnimationFrame(drawVideo);
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
  const setConnect = () => {};
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    background: '#f0f0f0'
  };
  return (
    <div className="main">
      <video
        className="mob_canvas"
        ref={canvasRef}
        autoPlay
        playsInline
        muted
        onCanPlay={createCanvas}
      ></video>
      <canvas
        className="real_canvas"
        ref={realCanvasRef}
        style={{ border: '1px solid blue', zIndex: '-3' }}
      ></canvas>
      {canvasStream && activeRemoteCanvas && (
        <Box
          pos="absolute"
          top="0"
          lef="0"
          w="100vw"
          h="100vh"
          zIndex="10000000"
        >
          <canvas
            className="real_draw_canvas"
            ref={realDrawCanvasRef}
            style={{ border: '1px solid red', width: '100vw', height: '100vh' }}
          ></canvas>
        </Box>
      )}
      {remoteStream && activeRemoteStream && (
        <Rnd
          onResize={null}
          style={style}
          default={{
            x: 700,
            y: 0,
            width: 320,
            height: 320
          }}
        >
          <video
            className="small_mob_video"
            ref={remoteRef}
            autoPlay
            playsInline
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
        setActiveRemoteCanvas={setActiveRemoteCanvas}
        setIsConnect={setIsConnect}
        isConnect={isConnect}
        setSpeer={setSpeer}
        speer={speer}
      />
    </div>
  );
};

export default Main;
