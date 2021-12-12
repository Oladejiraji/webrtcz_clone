import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Text,
  Icon,
  Input,
  useToast,
  CircularProgress
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { FiSettings } from 'react-icons/fi';
import MobileSpring from './MobileSpring';
import Peer from 'simple-peer';
import { expand } from '../../../helper/helper';
import { supabase } from '../../../supabase/supabaseClient';
import { SketchField, Tools } from '../../../react-sketch';
import MobileSelector from './MobileSelector';

const QrReader = dynamic(() => import('react-qr-scanner'), {
  ssr: false
});

const Mobile = () => {
  const toast = useToast();
  const [mobileStream, setMobileStream] = useState([]);
  const cameraRef = useRef();
  const sketchRef = useRef();
  const [open, setOpen] = useState(false);
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');
  const [isQr, setIsQr] = useState(false);
  const [currTool, setCurrTool] = useState(Tools.Pencil);
  const [lineColor, setLineColor] = useState('#000');
  const [isConnect, setIsConnect] = useState(false);
  const [loadBtn, setLoadBtn] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [selfPhoneStream, setSelfPhoneStream] = useState(null);
  const [selfDesktopStream, setSelfDesktopStream] = useState(null);
  const [showRear, setShowRear] = useState(false);
  const [currStream, setCurrStream] = useState(null);
  const [selectValue, setSelectValue] = useState('');
  const [speer, setSpeer] = useState(null);
  const [actRemotePeer, setActRemotePeer] = useState(false);
  const [retId, setRetId] = useState([]);
  const [isPen, setIsPen] = useState(false);
  const [canvasStream, setCanvasStream] = useState(null);
  const [scanReady, setScanReady] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const previewStyle = {
    width: '100%',
    height: 'auto',
    outline: '5px dashed #fff',
    outlineOffset: '-30px'
  };

  // Appending the streams to their ids
  useEffect(() => {
    if (streamId && mobileStream.length > 0) {
      mobileStream.forEach((value) => {
        streamId.forEach((child) => {
          if (value.id === child.stream) {
            if (child.type === 'camera') {
              setCameraStream(value);
              console.log(child.type);
            } else if (child.type === 'screen') {
              console.log(child.type);
              setScreenStream(value);
            }
          }
        });
      });
    }
  }, [streamId, mobileStream]);
  // Tell remote peer to activate camera
  useEffect(() => {
    if (selfPhoneStream || selfDesktopStream || showRear) {
      if (!actRemotePeer) {
        speer.send('conn');
        setActRemotePeer(true);
      }
    }
  }, [selfDesktopStream, selfPhoneStream, showRear]);

  const startConn = async (manualQr) => {
    setLoadBtn(true);
    const myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: 'environment' }
    });
    setCurrStream(myStream);
    const myCanStream = document.querySelector('.lower-canvas').captureStream();
    setCanvasStream(myCanStream);
    updateResId(myStream, myCanStream, manualQr);
    const streamData = [myCanStream, myStream];

    // console.log(streamData);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      streams: streamData,
      objectMode: true,
      offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true }
    });
    peer.addTransceiver('video', undefined);
    peer.addTransceiver('audio', undefined);
    console.log(manualQr);
    const { data, error } = await supabase
      .from('session_info')
      .select()
      .eq('id', manualQr);
    peer.signal(data[0].sdp.peerData);
    setStreamId(data[0].stream);
    peer.on('signal', (data) => {
      console.log(data);
      if (data.type !== 'answer') return;
      console.log(data);
      updateSdp(data, manualQr);
    });
    peer.on('connect', () => {
      setIsConnect(true);
      setLoadBtn(false);
      setScanReady(false);
      setQrLoading(false);
      toast({
        description: 'Connected successfully',
        status: 'success',
        duration: 9000,
        position: 'top',
        isClosable: true
      });
    });
    peer.on('negotiate', (data) => {
      console.log(data);
      console.log('yoooo');
    });
    peer.on('stream', (stream) => {
      console.log(stream);
      setMobileStream((prev) => {
        return [...prev, stream];
      });
    });
    setSpeer(peer);
    peer.on('error', (err) => {
      setScanReady(false);
      errorConn();
      setQrLoading(false);
    });
    console.log('fhrhfhrhfhrh');
  };

  const handleScan = (qrData) => {
    if (qrData !== null && !scanReady) {
      const qrNo = parseInt(qrData.text);
      console.log(qrNo);
      startConn(qrNo);
      setScanReady(true);
      setQrLoading(true);
    }
  };

  const errorConn = () => {
    setIsConnect(false);
    setIsQr(false);
    setIsPen(false);
  };

  const updateResId = async (myStream, myCanStream, manualQr) => {
    const streamId = [
      { type: 'camera', stream: myStream.id },
      { type: 'canvas', stream: myCanStream.id }
    ];
    const { data, error } = await supabase
      .from('session_info')
      .update({ resStream: streamId })
      .eq('id', manualQr);
    console.log(data);
  };

  const updateSdp = async (peerData, manualQr) => {
    const { data, error } = await supabase
      .from('session_info')
      .update({ sdp: { type: 'answer', peerData } })
      .eq('id', manualQr);
    console.log(data);
  };

  const handleError = (err) => {
    console.error(err);
  };
  return (
    <Box>
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        w="100vw"
        h="100vh"
        bg="#fff"
      >
        {mobileStream.length > 0 && isConnect && !isPen && (
          <>
            <MobileSelector
              cameraStream={cameraStream}
              screenStream={screenStream}
              selfPhoneStream={selfPhoneStream}
              setSelfPhoneStream={setSelfPhoneStream}
              selfDesktopStream={selfDesktopStream}
              setSelfDesktopStream={setSelfDesktopStream}
              showRear={showRear}
              currStream={currStream}
            />
          </>
        )}
        {isQr && isConnect && (
          <button className="openSpringPrime" onClick={() => setOpen(true)}>
            <Icon as={FiSettings} />
          </button>
        )}
        {!isQr && (
          <Button colorScheme="teal" onClick={() => setIsQr(true)}>
            Scan
          </Button>
        )}
        {isQr && !isConnect && (
          <Box
            w="100%"
            h="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="#fff"
          >
            <Box w="100vw" h="100%">
              {qrLoading ? (
                <Box
                  w="100vw"
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CircularProgress isIndeterminate value={80} />
                </Box>
              ) : (
                <Box
                  w="100vw"
                  h="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <QrReader
                    delay={1000}
                    style={previewStyle}
                    constraints={{
                      video: {
                        facingMode: 'environment'
                      }
                    }}
                    onError={handleError}
                    onScan={handleScan}
                  />
                  <Text color="white">{result}</Text>
                </Box>
              )}
            </Box>
            {/* <Input
              type="text"
              onChange={(e) => setManualQr(e.target.value)}
              placeholder="Enter Qr object"
            />
            <Button
              isLoading={loadBtn ? true : false}
              colorScheme="teal"
              onClick={handleSubmit}
            >
              submit
            </Button> */}
          </Box>
        )}
        <MobileSpring
          open={open}
          setOpen={setOpen}
          sketchRef={sketchRef}
          setCurrTool={setCurrTool}
          lineColor={lineColor}
          setLineColor={setLineColor}
          selfPhoneStream={selfPhoneStream}
          setSelfPhoneStream={setSelfPhoneStream}
          selfDesktopStream={selfDesktopStream}
          setSelfDesktopStream={setSelfDesktopStream}
          streamId={streamId}
          showRear={showRear}
          setShowRear={setShowRear}
          currStream={currStream}
          setCurrStream={setCurrStream}
          selectValue={selectValue}
          setSelectValue={setSelectValue}
          speer={speer}
          isPen={isPen}
          setIsPen={setIsPen}
          setIsConnect={setIsConnect}
          setIsQr={setIsQr}
        />
      </Box>
      {isQr && (
        <span
          style={
            isPen
              ? { ...sketchStyle, visibility: 'visible' }
              : { ...sketchStyle, visibility: 'hidden', pointerEvents: 'none' }
          }
        >
          <>
            <SketchField
              tool={currTool}
              lineColor="black"
              lineWidth={3}
              ref={sketchRef}
              lineColor={lineColor}
            />
          </>
        </span>
      )}
    </Box>
  );
};

export default Mobile;

const sketchStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '90vh',
  zIndex: '3'
};
