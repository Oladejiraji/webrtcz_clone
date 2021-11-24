import React, { useState } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const QrReader = dynamic(() => import('react-qr-scanner'), {
  ssr: false
});

const Mobile = () => {
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');
  const [isQr, setIsQr] = useState(false);
  const previewStyle = {
    width: '100vw',
    height: '100vh'
  };
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
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100vw"
      h="100vh"
      bg="#000"
    >
      {!isQr && (
        <Button colorScheme="teal" onClick={() => setIsQr(true)}>
          Scan
        </Button>
      )}
      {isQr && (
        <Box w="100vw" h="100vh" justifyContent="center" alignItems="center">
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
          <Text color="white">{result}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Mobile;
