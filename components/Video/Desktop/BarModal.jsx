import React, { useState, useEffect } from 'react';
import Peer from 'simple-peer';
import QRCode from 'qrcode.react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Input,
  useToast
} from '@chakra-ui/react';
import { reduce } from '../../../helper/helper';
import { supabase } from '../../../supabase/supabaseClient';

const BarModal = (props) => {
  const toast = useToast();
  const {
    isOpen,
    onClose,
    mediaStream,
    screenStream,
    handleRemoteStream,
    setActiveRemoteStream,
    handleCanvasStream
  } = props;
  const [qr, setQr] = useState(null);
  const [speer, setSpeer] = useState(null);
  const [manualQr, setManualQr] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [desktopStream, setDesktopStream] = useState([]);
  const [resStreamId, setResStreamId] = useState(null);

  useEffect(() => {
    if (resStreamId && desktopStream.length > 0) {
      desktopStream.forEach((value) => {
        resStreamId.forEach((child) => {
          if (value.id === child.stream) {
            if (child.type === 'camera') {
              handleRemoteStream(value);
              console.log(child.type);
            } else if (child.type === 'canvas') {
              console.log(child.type);
              handleCanvasStream(value);
            }
          }
        });
      });
    }
  }, [resStreamId, desktopStream]);

  const generateQr = () => {
    if (!mediaStream && !screenStream) return;
    let streamData = [];
    let streamId = [];
    if (mediaStream && !screenStream) {
      streamData = [mediaStream];
      streamId = [{ type: 'camera', stream: mediaStream.id }];
    } else if (!mediaStream && screenStream) {
      streamData = [screenStream];
      streamId = [{ type: 'screen', stream: screenStream.id }];
    } else if (mediaStream && screenStream) {
      streamData = [mediaStream, screenStream];
      streamId = [
        { type: 'camera', stream: mediaStream.id },
        { type: 'screen', stream: screenStream.id }
      ];
    }
    console.log(streamData);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      streams: streamData,
      objectMode: true,
      answerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true }
    });
    peer.on('signal', (peerData) => {
      insertSdp(peerData, peer, streamId);
    });
    peer.on('connect', () => {
      toast({
        description: 'Connected successfully',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
      onClose();
    });
    peer.on('stream', (stream) => {
      console.log(stream);
      setDesktopStream((prev) => {
        return [...prev, stream];
      });
    });
    peer.on('data', (data) => {
      if (data === 'conn') {
        setActiveRemoteStream(true);
      }
    });
    console.log(streamData);
    peer.on('error', (err) => {
      console.log(err);
    });
  };

  const insertSdp = async (peerData, peer, streamId) => {
    const { data, error } = await supabase
      .from('session_info')
      .insert([{ sdp: { type: 'offer', peerData }, stream: streamId }]);
    setSessionId(data[0].id);
    console.log(data[0].id);
    // Get sdp answer from db
    const sdpInt = setInterval(async () => {
      const { data: secondData, error } = await supabase
        .from('session_info')
        .select()
        .eq('id', data[0].id);
      console.log(secondData[0].sdp.resStream);
      if (
        secondData[0].sdp.type === 'answer' &&
        secondData[0].resStream.length > 0
      ) {
        clearInterval(sdpInt);
        console.log(secondData[0].sdp.peerData);
        peer.signal(secondData[0].sdp.peerData);
        setResStreamId(secondData[0].resStream);
        console.log(true);
      } else {
        console.log(false);
      }
    }, 5000);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scan Barcode</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" justifyContent="center">
            {sessionId && <QRCode value={`${sessionId}`} size={300} />}
          </Box>
          {!sessionId && (
            <Box display="flex" justifyContent="center">
              <Button onClick={generateQr}>Generate QR</Button>
            </Box>
          )}
          {/* <Box display="none" mt="10px">
            <Input
              type="text"
              onChange={(e) => setManualQr(e.target.value)}
              placeholder="Enter Qr code"
            />
            <Button onClick={handleSubmit}>submit</Button>
          </Box> */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BarModal;
