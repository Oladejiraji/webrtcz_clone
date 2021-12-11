import React, { useRef, useState, useEffect } from 'react';
import {
  Button,
  Text,
  Icon,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Select,
  Option,
  Input
} from '@chakra-ui/react';
import SelectSearch from 'react-select-search';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { BiVideo } from 'react-icons/bi';
import { BiVideoOff } from 'react-icons/bi';
import { AiOutlineAudio } from 'react-icons/ai';
import { BsFillPenFill, BsPen } from 'react-icons/bs';
import { BiMicrophoneOff } from 'react-icons/bi';
import { VscDebugDisconnect } from 'react-icons/vsc';
import { BiUndo } from 'react-icons/bi';
import { BiRedo } from 'react-icons/bi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { MdClear } from 'react-icons/md';
import { GrFormAdd } from 'react-icons/gr';
import { Tools } from '../../../react-sketch';
import { SketchPicker } from 'react-color';

const options = [
  { name: 'Choose device type', value: '', key: 1 },
  { name: 'Phone', value: 'phone', key: 2 },
  { name: 'Desktop', value: 'desktop', key: 3 }
];

const MobileSpring = (props) => {
  const {
    open,
    setOpen,
    sketchRef,
    setCurrTool,
    lineColor,
    setLineColor,
    selfPhoneStream,
    setSelfPhoneStream,
    selfDesktopStream,
    setSelfDesktopStream,
    streamId,
    showRear,
    setShowRear,
    currStream,
    setCurrStream,
    setSelectValue,
    selectValue,
    speer,
    isPen,
    setIsPen,
    setIsConnect,
    setIsQr
  } = props;
  const focusRef = useRef();
  const [addTextValue, setAddTextValue] = useState('');
  const [isProjector, setIsProjector] = useState(false);
  const [audioEn, setAudioEn] = useState(true);
  const [videoType, setVideoType] = useState('environment');
  useEffect(() => {
    if (streamId) {
      streamId.forEach((value) => {
        if (value.type === 'screen') {
          setIsProjector(true);
        }
      });
    }
  }, [streamId]);
  function onDismiss() {
    setOpen(false);
  }
  const handleChange = async (...args) => {
    setSelectValue(args[0]);
    if (args[0] === '') return;
    // console.log('ARGS:', args);

    console.log(args);
    if (args[0] === 'phone') {
      console.log('phone');
      setSelfDesktopStream(null);
      setSelfPhoneStream(currStream);
    } else if (args[0] === 'desktop') {
      console.log('desktop');
      setSelfDesktopStream(currStream);
      setSelfPhoneStream(null);
    }
  };

  const undo = () => {
    sketchRef.current.undo();
  };

  const redo = () => {
    sketchRef.current.redo();
  };

  const clear = () => {
    sketchRef.current.clear();
  };

  const addText = () => {
    sketchRef.current.addText(addTextValue);
  };

  const handleToolsChange = (e) => {
    setCurrTool(e.target.value);
  };

  const handleColorChange = (color) => {
    setLineColor();
  };

  const toggleAudio = async () => {
    const copyCurrStream = currStream;
    const audioTrack = copyCurrStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setCurrStream(copyCurrStream);
    setAudioEn(!audioEn);
  };

  const switchCamera = async () => {
    const oldTrack = currStream.getVideoTracks()[0];
    currStream.getVideoTracks()[0].stop();
    if (videoType === 'environment') {
      const myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: 'user' }
      });
      const newTrack = myStream.getVideoTracks()[0];
      speer.replaceTrack(oldTrack, newTrack, currStream);
      currStream.removeTrack(oldTrack);
      currStream.addTrack(newTrack);
      setVideoType('user');
    } else if (videoType === 'user') {
      const myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: 'environment' }
      });
      const newTrack = myStream.getVideoTracks()[0];
      speer.replaceTrack(oldTrack, newTrack, currStream);
      currStream.removeTrack(oldTrack);
      currStream.addTrack(newTrack);
      setVideoType('environment');
    }
  };

  const toggleShowRear = async () => {
    setShowRear(!showRear);
  };

  const streamDecision = (stream) => {
    if (selectValue === 'phone') {
      setSelfDesktopStream(null);
      setSelfPhoneStream(stream);
    } else if (selectValue === 'desktop') {
      setSelfDesktopStream(stream);
      setSelfPhoneStream(null);
    }
  };

  const togglePen = () => {
    setIsPen(!isPen);
    if (isPen === false) {
      console.log(false);
      speer.send('truePen');
    } else if (isPen === true) {
      console.log(true);
      speer.send('falsePen');
    }
  };

  const closePeer = () => {
    speer.send('close-conn');
    setIsConnect(false);
    setIsQr(false);
    speer.destroy('close-conn');
    setIsPen(false);
  };
  return (
    <Box>
      <BottomSheet
        open={open}
        onDismiss={onDismiss}
        initialFocusRef={focusRef}
        snapPoints={({ maxHeight }) => maxHeight / 2}
        footer={
          <Box textAlign="center">
            <Button onClick={closePeer} className="w-full">
              <Icon as={VscDebugDisconnect} w={8} h={8} color="red" />
            </Button>
          </Box>
        }
      >
        <Box display="flex" justifyContent="center" py="5px" mb="10px">
          <SelectSearch
            options={options}
            value=""
            name="device"
            onChange={handleChange}
          />
        </Box>
        <Box display="flex" justifyContent="center" mb="10px" mt="10px">
          {isProjector && (
            <>
              {showRear ? (
                <Icon
                  as={BiVideoOff}
                  w={8}
                  h={8}
                  mr="60px"
                  onClick={toggleShowRear}
                />
              ) : (
                <Icon
                  as={BiVideo}
                  w={8}
                  h={8}
                  mr="60px"
                  onClick={toggleShowRear}
                />
              )}
            </>
          )}
          {(selectValue === 'phone' || showRear) && (
            <Icon
              as={HiOutlineSwitchHorizontal}
              w={8}
              h={8}
              mr="60px"
              onClick={switchCamera}
            />
          )}
          {audioEn ? (
            <Icon as={BiMicrophoneOff} w={8} h={8} onClick={toggleAudio} />
          ) : (
            <Icon as={AiOutlineAudio} w={8} h={8} onClick={toggleAudio} />
          )}
          <Icon as={BsPen} w={8} h={8} ml="60px" onClick={togglePen} />
        </Box>
        <Box>
          {isPen && (
            <Accordion allowMultiple ref={focusRef}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" display="flex" alignItems="center">
                      <Icon as={BsFillPenFill} w={5} h={5} mr="10px" />
                      <Text>Click here to see sketch options</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box display="flex" justifyContent="center" gridGap={10}>
                    <Icon as={BiUndo} w={8} h={8} onClick={undo} />
                    <Icon as={BiRedo} w={8} h={8} onClick={redo} />
                    <Icon as={MdClear} w={8} h={8} onClick={clear} />
                  </Box>
                  <Box display="flex" justifyContent="center">
                    <SketchPicker
                      color={lineColor}
                      onChangeComplete={(color) => setLineColor(color.hex)}
                    />
                  </Box>
                  <Box display="flex" mt="8px">
                    <Input
                      placeholder="Add Text..."
                      value={addTextValue}
                      onChange={(e) => setAddTextValue(e.target.value)}
                      variant="flushed"
                      size="sm"
                    />
                    <Icon as={GrFormAdd} w={8} h={8} onClick={addText} />
                  </Box>
                  <Box display="flex" mt="8px">
                    <Select
                      // placeholder="Select Canvas Tool"
                      onChange={handleToolsChange}
                      variant="flushed"
                    >
                      <option value={Tools.Pencil}>Pencil</option>
                      <option value={Tools.Rectangle}>Rectangle</option>
                      <option value={Tools.Arrow}>Arrow</option>
                      <option value={Tools.Circle}>Circle</option>
                    </Select>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}
        </Box>
      </BottomSheet>
    </Box>
  );
};

export default MobileSpring;
