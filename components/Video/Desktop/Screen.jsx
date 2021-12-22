import React, { useState, useRef, useEffect } from 'react';
import Measure from 'react-measure';
import { useDisplayMedia, useCardRatio } from '../../../Hooks';
import { Video, Wrapper, Container } from './styles';

const CAPTURE_OPTIONS = {
  audio: false
};

const Screen = (props) => {
  const {
    isScreenPlaying,
    setIsScreenPlaying,
    handleScreenStream,
    screenStream
  } = props;
  const videoRef = useRef();

  const [container, setContainer] = useState({ width: 0, height: 0 });

  const mediaStream = useDisplayMedia(CAPTURE_OPTIONS);
  console.log(mediaStream);
  useEffect(() => {
    if (mediaStream) {
      handleScreenStream(mediaStream);
    }
  }, [mediaStream]);
  const [aspectRatio, calculateRatio] = useCardRatio(1.9);

  if (screenStream && videoRef.current && !videoRef.current.srcObject) {
    console.log('.');
    console.log(screenStream);
    videoRef.current.srcObject = screenStream;
  }

  function handleResize(contentRect) {
    setContainer({
      width: contentRect.bounds.width,
      height: Math.round(contentRect.bounds.width / aspectRatio)
    });
  }

  function handleCanPlay() {
    calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
    setIsScreenPlaying(true);
    videoRef.current.play();
  }

  if (!screenStream) {
    return null;
  }

  return (
    <Measure bounds onResize={handleResize}>
      {({ measureRef }) => (
        <Wrapper>
          <Container
            ref={measureRef}
            maxHeight={videoRef.current && videoRef.current.videoHeight}
            maxWidth={videoRef.current && videoRef.current.videoWidth}
          >
            <Video
              className="des_screen"
              ref={videoRef}
              hidden={!isScreenPlaying}
              onCanPlay={handleCanPlay}
              autoPlay
              playsInline
              muted
            />
          </Container>
        </Wrapper>
      )}
    </Measure>
  );
};

export default Screen;
