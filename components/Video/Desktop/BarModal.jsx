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
  Box
} from '@chakra-ui/react';
import reduce from '../../../helper/helper';

const BarModal = (props) => {
  const { isOpen, onClose, mediaStream, screenStream } = props;
  const [qr, setQr] = useState(null);
  useEffect(() => {
    let streamData = [];
    if (mediaStream && !screenStream) {
      streamData = [mediaStream];
    } else if (!mediaStream && screenStream) {
      streamData = [screenStream];
    } else if (mediaStream && screenStream) {
      streamData = [mediaStream, screenStream];
      console.log(streamData);
    }
    const peer = new Peer({
      initiator: true,
      trickle: true
    });
    streamData.forEach((value) => {
      peer.addStream(value);
    });
    peer.on('signal', (data) => {
      const reducedSdp = reduce(data);
      if (reducedSdp !== undefined) {
        console.log(reducedSdp);
        setQr(reducedSdp);
      }
    });
  }, [mediaStream, screenStream]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scan Barcode</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display="flex" justifyContent="center">
            {qr && <QRCode value={qr} />}
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
