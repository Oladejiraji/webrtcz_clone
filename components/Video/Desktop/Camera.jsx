import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import Measure from 'react-measure';
import { useUserMedia, useCardRatio, useOffsets } from '../../../Hooks';
import { Video, Wrapper, Container, Button } from './styles';

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: 'environment' }
};

const Camera = forwardRef((props, ref) => {
  const {
    onCapture,
    onClear,
    isVideoPlaying,
    setIsVideoPlaying,
    isCanvasEmpty,
    setIsCanvasEmpty
  } = props;
  const canvasRef = useRef();
  const videoRef = useRef();
  //   console.log(videoRef.current.play());

  const [container, setContainer] = useState({ width: 0, height: 0 });

  const [isFlashing, setIsFlashing] = useState(false);

  const mediaStream = useUserMedia(CAPTURE_OPTIONS);
  const [aspectRatio, calculateRatio] = useCardRatio(1.9);
  const offsets = useOffsets(
    videoRef.current && videoRef.current.videoWidth,
    videoRef.current && videoRef.current.videoHeight,
    container.width,
    container.height
  );

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

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

  if (!mediaStream) {
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
            // style={{
            //   height: `${container.height}px`
            // }}
          >
            <Video
              ref={videoRef}
              hidden={!isVideoPlaying}
              onCanPlay={handleCanPlay}
              autoPlay
              playsInline
              muted
              // style={{
              //   top: `-${offsets.y}px`,
              //   left: `-${offsets.x}px`
              // }}
            />
          </Container>
        </Wrapper>
      )}
    </Measure>
  );
});

export default Camera;
