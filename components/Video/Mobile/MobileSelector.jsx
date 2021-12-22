import React, { useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';

const MobileSelector = (props) => {
  const {
    cameraStream,
    screenStream,
    selfPhoneStream,
    setSelfPhoneStream,
    selfDesktopStream,
    setSelfDesktopStream,
    showRear,
    currStream,
    isScreen,
    isCamera
  } = props;
  const cameraRef = useRef();
  const smallCameraRef = useRef();
  const screenRef = useRef();
  const smallSelf = useRef();
  const bigSelf = useRef();
  useEffect(() => {
    if (
      cameraStream &&
      isCamera &&
      !isScreen &&
      !screenStream &&
      !selfDesktopStream
    ) {
      cameraRef.current.srcObject = cameraStream;
    } else if (
      !cameraStream &&
      screenStream &&
      !isCamera &&
      isScreen &&
      !selfDesktopStream
    ) {
      if (showRear) {
        cameraRef.current.srcObject = currStream;
      } else {
        cameraRef.current.srcObject = screenStream;
      }
    } else if (cameraStream && screenStream && isCamera && isScreen) {
      console.log('heeee');
      smallCameraRef.current.srcObject = cameraStream;
      if (showRear) {
        screenRef.current.srcObject = currStream;
      } else if (!showRear && selfDesktopStream) {
        bigSelf.current.srcObject = screenStream;
      } else {
        screenRef.current.srcObject = screenStream;
      }
    }
    if (selfPhoneStream && !selfDesktopStream && !showRear) {
      smallSelf.current.srcObject = selfPhoneStream;
    } else if (!selfPhoneStream && selfDesktopStream && !showRear) {
      bigSelf.current.srcObject = selfDesktopStream;
    }
  }, [
    cameraStream,
    screenStream,
    selfPhoneStream,
    selfDesktopStream,
    showRear,
    currStream
  ]);
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    background: '#f0f0f0'
  };
  return (
    <>
      {selfPhoneStream && !selfDesktopStream && !showRear && (
        <Rnd
          onResize={null}
          style={style}
          default={{
            x: 100,
            y: 100,
            width: 180,
            height: 180
          }}
        >
          <video
            className="small_mob_video"
            ref={smallSelf}
            autoPlay
            playsInline
            muted
          ></video>
        </Rnd>
      )}
      {selfDesktopStream && !showRear && (
        <video
          className="mob_screen"
          ref={bigSelf}
          autoPlay
          playsInline
          muted
        ></video>
      )}
      {cameraStream && screenStream && isCamera && isScreen && (
        <div className="mob_wrap">
          <Rnd
            onResize={null}
            style={style}
            default={{
              x: 0,
              y: 0,
              width: 180,
              height: 180
            }}
          >
            <video
              className="small_mob_video"
              ref={smallCameraRef}
              autoPlay
              playsInline
              muted
            ></video>
          </Rnd>
          {!selfDesktopStream && (
            <video
              className="mob_screen_select"
              ref={screenRef}
              autoPlay
              playsInline
              muted
            ></video>
          )}
          {selfDesktopStream && showRear && (
            <video
              className="mob_screen_select"
              ref={screenRef}
              autoPlay
              playsInline
              muted
            ></video>
          )}
        </div>
      )}
      {cameraStream &&
        !screenStream &&
        isCamera &&
        !isScreen &&
        !selfDesktopStream && (
          <video
            className="mob_video"
            ref={cameraRef}
            autoPlay
            playsInline
            muted
          ></video>
        )}
      {!cameraStream &&
        screenStream &&
        !isCamera &&
        isScreen &&
        !selfDesktopStream && (
          <video
            className="mob_screen_select"
            ref={cameraRef}
            autoPlay
            playsInline
            muted
          ></video>
        )}
    </>
  );
};

export default MobileSelector;
