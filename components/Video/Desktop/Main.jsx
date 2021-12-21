import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import Spring from './Spring';
import Camera from './Camera';
import Screen from './Screen';
import SmallCamera from './SmallCamera';
import { Box, Drawer } from '@chakra-ui/react';

let lastPoint;
let originPoint;

let prevStartX = 0;
let prevStartY = 0;

let prevWidth = 0;
let prevHeight = 0;

let midPointX;
let midPointY;
let radius;

let nowColor = 'black';

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
  const [activeRemoteCanvas, setActiveRemoteCanvas] = useState(true);
  const remoteRef = useRef();
  const canvasRef = useRef();
  const canvasOverlayRef = useRef();
  const [canvasContext, setCanvasContext] = useState(null);
  const [canvasOverlayContext, setCanvasOverlayContext] = useState(null);
  const [currColor, setCurrColor] = useState('blue');

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

  const onPeerCanvas = (data) => {
    if (data.tool === 'pencil') draw(data);
    else if (data.tool === 'rectangle') drawRect(data);
    else if (data.tool === 'circle') drawCircle(data);
  };

  // Test Cancal
  const move = (e) => {
    const { clientX, clientY } = e.changedTouches[0];
    if (!originPoint) {
      originPoint = { x: clientX, y: clientY };
      return;
    }
    let origin = {
      x: Math.min(originPoint.x, clientX),
      y: Math.min(originPoint.y, clientY)
    };
    drawRect({
      type: 'canvas',
      event: 'drawRect',
      origin: origin,
      color: 'red',
      tool: 'rectangle',
      width: Math.abs(originPoint.x - clientX),
      height: Math.abs(originPoint.y - clientY)
    });
  };

  const clearCanvas = () => {
    canvasOverlayContext.clearRect(
      0,
      0,
      canvasOverlayRef.current.width,
      canvasOverlayRef.current.height
    );
    prevStartX = null;
    prevStartY = null;
    prevHeight = null;
    prevWidth = null;
    radius = null;
    midPointX = null;
    midPointY = null;
    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const endRect = () => {
    canvasOverlayContext.strokeStyle = nowColor;
    canvasOverlayContext.strokeRect(
      prevStartX,
      prevStartY,
      prevWidth,
      prevHeight
    );
  };

  const endCircle = () => {
    canvasOverlayContext.beginPath();
    canvasOverlayContext.arc(midPointX, midPointY, radius, 0, 2 * Math.PI);
    canvasOverlayContext.strokeStyle = nowColor;
    canvasOverlayContext.stroke();
  };

  const draw = (data) => {
    canvasOverlayContext.beginPath();
    canvasOverlayContext.moveTo(
      transX(data.lastPoint.x),
      transY(data.lastPoint.y)
    );
    canvasOverlayContext.lineTo(transX(data.x), transY(data.y));
    canvasOverlayContext.strokeStyle = data.color;
    canvasOverlayContext.lineCap = 'round';
    canvasOverlayContext.stroke();
    nowColor = data.color;
    setCurrColor(data.color);
  };

  const drawRect = (data) => {
    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    let width = Math.abs(transX(data.originPoint.x) - transX(data.x));
    let height = Math.abs(transY(data.originPoint.y) - transY(data.y));

    canvasContext.strokeStyle = data.color;
    canvasContext.strokeRect(
      transX(data.origin.x),
      transY(data.origin.y),
      width,
      height
    );
    nowColor = data.color;
    setCurrColor(data.color);

    prevStartX = transX(data.origin.x);
    prevStartY = transY(data.origin.y);

    prevWidth = width;
    prevHeight = height;
  };

  const drawCircle = (data) => {
    radius = getDistance(
      transX(data.midPointX),
      transY(data.midPointY),
      transX(data.mouseX),
      transY(data.mouseY)
    );
    midPointY = transY(data.midPointY);
    midPointX = transX(data.midPointX);
    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    canvasContext.beginPath();
    canvasContext.arc(
      transX(data.midPointX),
      transY(data.midPointY),
      radius,
      0,
      2 * Math.PI
    );

    canvasContext.strokeStyle = data.color;
    canvasContext.stroke();

    nowColor = data.color;
    setCurrColor(data.color);
  };

  const getDistance = (p1X, p1Y, p2X, p2Y) => {
    return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2));
  };

  useEffect(() => {
    if (!activeRemoteCanvas) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setCanvasContext(context);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.lineWidth = 3;

    const canvasOverlay = canvasOverlayRef.current;
    const overlayContext = canvasOverlay.getContext('2d');
    setCanvasOverlayContext(overlayContext);
    canvasOverlay.width = window.innerWidth;
    canvasOverlay.height = window.innerHeight;
    overlayContext.lineWidth = 3;
  }, [activeRemoteCanvas]);

  const transX = (value) => {
    const newValue = value * window.innerWidth;
    return newValue;
  };

  const transY = (value) => {
    const { top, bottom } = document
      .querySelector('.des_screen')
      .getBoundingClientRect();
    if (value < 0) {
      const newValue = top + -value * top;
      return newValue;
    } else {
      const newValue = top + value * (bottom - top);
      return newValue;
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
      {activeRemoteCanvas && (
        <Box
          pos="absolute"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          zIndex="3"
          onTouchMove={move}
        >
          <Box position="relative" w="100vw" h="100vh">
            <canvas className="mob_canvas" ref={canvasOverlayRef}></canvas>
            <canvas className="mob_canvas" ref={canvasRef}></canvas>
          </Box>
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
        onPeerCanvas={onPeerCanvas}
        endRect={endRect}
        endCircle={endCircle}
        clearCanvas={clearCanvas}
      />
    </div>
  );
};

export default Main;
