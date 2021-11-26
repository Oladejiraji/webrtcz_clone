import React, { useRef } from 'react';
import {
  Button,
  Text,
  Icon,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react';
import SelectSearch from 'react-select-search';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { BiVideo } from 'react-icons/bi';
import { AiOutlineAudio } from 'react-icons/ai';
import { BsFillPenFill } from 'react-icons/bs';
import { VscDebugDisconnect } from 'react-icons/vsc';

const options = [
  { name: 'Phone', value: 'phone' },
  { name: 'Desktop', value: 'desktop' }
];

const MobileSpring = (props) => {
  const { open, setOpen } = props;
  const focusRef = useRef();
  function onDismiss() {
    setOpen(false);
  }
  const handleChange = (...args) => {
    // searchInput.current.querySelector("input").value = "";
    console.log('ARGS:', args);

    console.log('CHANGE:');
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
            <Button onClick={onDismiss} className="w-full">
              <Icon as={VscDebugDisconnect} w={8} h={8} color="red" />
            </Button>
          </Box>
        }
      >
        <Box display="flex" justifyContent="center" mb="10px" mt="10px">
          <Icon as={BiVideo} w={8} h={8} mr="60px" />
          <Icon as={AiOutlineAudio} w={8} h={8} />
        </Box>
        <Box display="flex" justifyContent="center" py="5px" mb="10px">
          <SelectSearch
            options={options}
            value=""
            name="device"
            placeholder="Choose device type"
            onChange={handleChange}
          />
        </Box>
        <Box>
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </BottomSheet>
    </Box>
  );
};

export default MobileSpring;
