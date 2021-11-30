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

const BarModal = (props) => {
  const toast = useToast();
  const { isOpen, onClose, mediaStream, screenStream } = props;
  const [qr, setQr] = useState(null);
  const [speer, setSpeer] = useState(null);
  const [manualQr, setManualQr] = useState({});
  useEffect(() => {
    if (!mediaStream && !screenStream) return;
    let streamData = [];
    if (mediaStream && !screenStream) {
      streamData = [mediaStream];
    } else if (!mediaStream && screenStream) {
      streamData = [screenStream];
    } else if (mediaStream && screenStream) {
      streamData = [mediaStream, screenStream];
    }
    const peer = new Peer({
      initiator: true,
      trickle: true,
      streams: streamData
    });
    peer.on('signal', (data) => {
      const reducedSdp = reduce(data);
      if (reducedSdp !== undefined) {
        // console.log(JSON.stringify(data));
        // console.log(reducedSdp);
        setQr(reducedSdp);
      }
    });
    peer.on('error', (err) => console.log(err));
    peer.on('connect', () => {
      toast({
        description: 'Connected successfully',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
      onClose();
    });
    setSpeer(peer);
  }, [mediaStream, screenStream]);
  const handleSubmit = () => {
    speer.signal(JSON.parse(manualQr));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scan Barcode</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" justifyContent="center">
            {qr && <QRCode value={qr} size={300} />}
          </Box>
          <Box display="none" mt="10px">
            <Input
              type="text"
              onChange={(e) => setManualQr(e.target.value)}
              placeholder="Enter Qr code"
            />
            <Button onClick={handleSubmit}>submit</Button>
          </Box>
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
