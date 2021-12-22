import React, { useState, useRef, useEffect } from 'react';
import Measure from 'react-measure';
import { useUserMedia, useCardRatio } from '../../../Hooks';
import { Video, Wrapper, Container } from './styles';

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: 'environment' }
};

const Camera = (props) => {
  const {
    isVideoPlaying,
    setIsVideoPlaying,
    handleMediaStream,
    mediaStream
  } = props;
  const videoRef = useRef();

  const [container, setContainer] = useState({ width: 0, height: 0 });

  const currStream = useUserMedia(CAPTURE_OPTIONS);
  const [aspectRatio, calculateRatio] = useCardRatio(1);

  if (currStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = currStream;
  }
  useEffect(() => {
    if (currStream) {
      handleMediaStream(currStream);
    }
  }, [currStream]);

  function handleResize(contentRect) {
    setContainer({
      width: contentRect.bounds.width,
      height: Math.round(contentRect.bounds.width / aspectRatio)
    });
  }

  function handleCanPlay() {
    calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
    setIsVideoPlaying(true);
    videoRef.current.play();
  }

  if (!currStream) {
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
              ref={videoRef}
              hidden={!isVideoPlaying}
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

export default Camera;
