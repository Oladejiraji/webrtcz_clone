import React, { useState } from 'react';
import { Box, Icon } from '@chakra-ui/react';
import { AiOutlineCamera } from 'react-icons/ai';
import { BiCameraOff } from 'react-icons/bi';
import { CgScreen } from 'react-icons/cg';
import { ImConnection } from 'react-icons/im';
import { MdDesktopAccessDisabled } from 'react-icons/md';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { Button } from '@chakra-ui/react';
import 'react-spring-bottom-sheet/dist/style.css';

const Spring = (props) => {
  const {
    isCanvasEmpty,
    isVideoPlaying,
    isScreenPlaying,
    isCamera,
    setIsCamera,
    isScreen,
    setIsScreen
  } = props;
  const [open, setOpen] = useState(false);
  function onDismiss() {
    setOpen(false);
  }

  return (
    <div>
      <button className="openSpring" onClick={() => setOpen(true)}>
        Open
      </button>
      <BottomSheet
        open={open}
        onDismiss={onDismiss}
        snapPoints={({ minHeight }) => minHeight}
      >
        <Box display="flex" justifyContent="center" py="5px">
          <Box mr="40px" ml="40px">
            <button
              className="camera_btn"
              // onClick={isCanvasEmpty ? proxyHandleCapture : proxyHandleClear}
              onClick={() => setIsCamera(!isCamera)}
            >
              {isCamera ? (
                <Icon as={BiCameraOff} w={23} h={23} />
              ) : (
                <Icon as={AiOutlineCamera} w={23} h={23} />
              )}

              {/* {isCanvasEmpty && <Icon as={AiOutlineCamera} w={23} h={23} />} */}
            </button>
          </Box>
          <Box mr="40px" ml="40px">
            <button
              className="camera_btn"
              // onClick={isCanvasEmpty ? proxyHandleCapture : proxyHandleClear}
              onClick={() => setIsScreen(!isScreen)}
            >
              {isScreen ? (
                <Icon as={MdDesktopAccessDisabled} w={23} h={23} />
              ) : (
                <Icon as={CgScreen} w={23} h={23} />
              )}

              {/* {isCanvasEmpty && <Icon as={AiOutlineCamera} w={23} h={23} />} */}
            </button>
          </Box>
          <Box mr="40px" ml="40px">
            <Icon as={ImConnection} w={23} h={23} />
          </Box>
        </Box>
      </BottomSheet>
    </div>
  );
};

export default Spring;
