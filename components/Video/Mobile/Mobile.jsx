import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Text, Icon, Input, useToast } from '@chakra-ui/react';
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
  const previewStyle = {
    width: '100vw',
    height: '100vh'
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
  const [manualQr, setManualQr] = useState({});
  const handleSubmit = async () => {
    // const decodeExpand = expand(manuaQr);
    // console.log(JSON.parse(decodeExpand));
    setLoadBtn(true);
    const myStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: 'environment' }
    });
    setCurrStream(myStream);
    const myCanStream = document
      .querySelector('.upper-canvas')
      .captureStream(25);
    setCanvasStream(myCanStream);
    updateResId(myStream, myCanStream);
    const streamData = [myStream, myCanStream];

    console.log(streamData);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      streams: streamData,
      objectMode: true,
      offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true }
    });
    peer.addTransceiver('video', undefined);
    // peer.addStream(myCanStream);

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
      updateSdp(data);
    });
    peer.on('connect', () => {
      setIsConnect(true);
      setLoadBtn(false);
      toast({
        description: 'Connected successfully',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    });
    peer.on('stream', (stream) => {
      console.log(stream);
      setMobileStream((prev) => {
        return [...prev, stream];
      });
    });
    setSpeer(peer);
    peer.on('err', (err) => {
      console.log(err);
    });
    console.log('fhrhfhrhfhrh');
  };

  const updateResId = async (myStream, myCanStream) => {
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

  const updateSdp = async (peerData) => {
    const { data, error } = await supabase
      .from('session_info')
      .update({ sdp: { type: 'answer', peerData } })
      .eq('id', manualQr);
    console.log(data);
  };

  // const handleScan = async (qrData) => {
  //   setResult(qrData);
  //   if (result && result !== 'No result') {
  //     const peer = new Peer({
  //       initiator: false,
  //       trickle: false
  //     });
  //     const { data, error } = await supabase
  //       .from('session_info')
  //       .select()
  //       .eq('id', qrData);
  //     peer.signal(data[0].sdp.peerData);
  //     setStreamId(data[0].stream);
  //     // if (mobileStream.length > 0) console.log(1);
  //     peer.on('signal', (data) => {
  //       updateSdp(data);
  //     });
  //     peer.on('connect', () => {
  //       setIsConnect(true);
  //       setLoadBtn(false);
  //       toast({
  //         description: 'Connected successfully',
  //         status: 'success',
  //         duration: 9000,
  //         isClosable: true
  //       });
  //     });
  //     peer.on('stream', (stream) => {
  //       console.log(stream);
  //       setMobileStream((prev) => {
  //         return [...prev, stream];
  //       });
  //     });
  //   }
  // };
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
      {isQr && (
        <span style={isPen ? { display: 'block' } : { display: 'none' }}>
          <SketchField
            tool={currTool}
            lineColor="black"
            lineWidth={3}
            width={500}
            height={500}
            ref={sketchRef}
            lineColor={lineColor}
          />
        </span>
      )}
      <button className="openSpring" onClick={() => setOpen(true)}>
        <Icon as={FiSettings} />
      </button>
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
          {/* <Box w="100vw" h="100%">
            <QrReader
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            />
            <Text color="white">{result}</Text>
          </Box> */}
          <Input
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
          </Button>
          {/* {isQr && (
            <span style={{ display: 'block' }}>
              <SketchField
                tool={currTool}
                lineColor="black"
                lineWidth={3}
                ref={sketchRef}
                lineColor={lineColor}
              />
            </span>
          )} */}
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
      />
    </Box>
  );
};

export default Mobile;
