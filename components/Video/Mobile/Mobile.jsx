import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, Icon, Input } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { FiSettings } from 'react-icons/fi';
import MobileSpring from './MobileSpring';
import Peer from 'simple-peer';
import { expand } from '../../../helper/helper';
import { SketchField, Tools } from '../../../react-sketch';

const QrReader = dynamic(() => import('react-qr-scanner'), {
  ssr: false
});

const Mobile = () => {
  const [cameraStream, setCameraStream] = useState(null);
  const cameraRef = useRef();
  const sketchRef = useRef();
  const [open, setOpen] = useState(false);
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');
  const [isQr, setIsQr] = useState(false);
  const [currTool, setCurrTool] = useState(Tools.Pencil);
  const [lineColor, setLineColor] = useState('#000');
  const previewStyle = {
    width: '100vw',
    height: '100vh'
  };
  const [manualQr, setManualQr] = useState({});
  const handleSubmit = () => {
    // const decodeExpand = expand(manuaQr);
    // console.log(JSON.parse(decodeExpand));
    const peer = new Peer({
      initiator: false,
      trickle: false
    });
    peer.on('signal', (data) => {
      console.log(JSON.stringify(data));
    });
    peer.on('stream', (stream) => {
      console.log(stream);
      setCameraStream(stream);
      cameraRef.current.srcObject = stream;
      console.log(cameraRef.current);
    });
    peer.on('connect', () => console.log('connected'));
    peer.on('error', (err) => console.log(err));
    peer.signal(JSON.parse(manualQr));
  };
  const handlePlay = () => {
    console.log('play');
    cameraRef.current.play();
  };
  useEffect(() => {
    // const decoded =
    //   '';
    // const decodeExpand = expand(decoded);
    // console.log(decodeExpand);
    // const peer = new Peer({
    //   initiator: false,
    //   trickle: false
    // });
    // peer.on('stream', (stream) => console.log(stream));
    // peer.signal(decodeExpand);
  }, []);
  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100vw"
      h="100vh"
      bg="#000"
    >
      {cameraStream !== null && (
        <div>
          <video
            ref={cameraRef}
            autoPlay
            playsInline
            muted
            onCanPlay={handlePlay}
          ></video>
        </div>
      )}
      <button className="openSpring" onClick={() => setOpen(true)}>
        <Icon as={FiSettings} />
      </button>
      {!isQr && (
        <Button colorScheme="teal" onClick={() => setIsQr(true)}>
          Scan
        </Button>
      )}
      {isQr && (
        <Box
          w="100%"
          h="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="#fff"
        >
          {/* <QrReader
            delay={delay}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
          <Text color="white">{result}</Text> */}
          <Input
            type="text"
            onChange={(e) => setManualQr(e.target.value)}
            placeholder="Enter Qr object"
          />
          <Button colorScheme="teal" onClick={handleSubmit}>
            submit
          </Button>
          {/* <SketchField
            tool={currTool}
            lineColor="black"
            lineWidth={3}
            ref={sketchRef}
            lineColor={lineColor}
            forceValue
          /> */}
        </Box>
      )}
      <MobileSpring
        open={open}
        setOpen={setOpen}
        sketchRef={sketchRef}
        setCurrTool={setCurrTool}
        lineColor={lineColor}
        setLineColor={setLineColor}
      />
    </Box>
  );
};

export default Mobile;
