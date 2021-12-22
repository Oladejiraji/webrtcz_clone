import { useState, useEffect } from 'react';

export default function useUserMedia(requestedMedia, currStream) {
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
          requestedMedia
        );
        setMediaStream(stream);
      } catch (err) {
        // Removed for brevity
      }
    }

    if (!mediaStream && !currStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, requestedMedia]);

  return currStream ? null : mediaStream;
}
