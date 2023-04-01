import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Icon,
  Flex,
  HStack,
  Center,
} from "@chakra-ui/react";
import { SaveButton, BackButton, CancelButton } from "@/components/buttons";
import { MdCheckCircle } from "react-icons/md";
import { generateID } from "@/lib/dataHandler";
import { fuelAPI } from "@/lib/routes";

const AddFuelEntry = ({ creatorID, submitFunc, isOpen, onClose }) => {
  //insert fuelInCount

  const [refuelType, setRefuelType] = useState("");
  const [showRefuelDetails, setShowRefuelDetails] = useState(false);

  const [fuelInID, setFuelInID] = useState(generateID(fuelInCount, 15));
  const [fRecordDateTime, setFRecordDateTime] = useState("");
  const [fUnitCost, setFUnitCost] = useState("");
  const [fLiters, setFLiters] = useState("");
  const [fFuelIn, setFFuelIn] = useState("");
  //const [fFuelInPercent, setFFuelInPercent] = useState("");

  const [fuelOutID, setFuelOutID] = useState(generateID(fuelInCount, 15));
  const [oRecordDateTime, setORecordDateTime] = useState("");
  const [oDriverID, setODriverID] = useState("");
  const [oUserID, setOUserID] = useState("");
  const [oPlateNumber, setOPlateNumber] = useState("");
  const [ofLiters, setOLiters] = useState("");
  const [oFuelOut, setOFuelOut] = useState("");
  const [oPreviousRoute, setOPreviousRoute] = useState("");
  // const [fuelOutPercent, setFuelOutPercent] = useState("");

  //CONTINUE HERE
  useEffect(() => {
    submitFunc(passSubmitFunc);
  }, []);

  function passSubmitFunc() {
    return submitForm;
  }

  function clear() {
    setFuelInID("");
    setFRecordDateTime("");
    setFUnitCost("");
    setFLiters("");
    setFFuelIn("");
    setFuelOutID("");
    setORecordDateTime("");
    setODriverID("");
    setOUserID("");
    setOPlateNumber("");
    setOLiters("");
    setOFuelOut("");
    setOPreviousRoute("");
  }

  async function submitForm() {
    if (refuelType == "tank") {
      let fuelInData = {
        fuelInID: fuelInID,
        fRecordDateTime: fRecordDateTime,
        fUnitCost: fUnitCost,
        fLiters: fLiters,
        fFuelIn: fFuelIn,
        creatorID: creatorID
      }
      console.log(fuelInData)
      //EDIT FUELINAPI
      await fetch(fuelAPI.create_fuelIn,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fuelInData),
      }).then(result => result.json())
      .then(data => {
          if(data.error != null)
            console.log(data.error)
          clear()
      })
    }
    else {
      let fuelOutData = {
        fuelOutID: fuelOutID,
        oRecordDateTime: oRecordDateTime,
        oDriverID: oDriverID,
        oUserID: oUserID,
        oPlateNumber:oPlateNumber,
        oLiters: ofLiters,
        oPreviousRoute: oPreviousRoute,
        oFuelOut: oFuelOut,
        creatorID: creatorID
      }
      console.log(fuelOutData)
      await fetch(fuelAPI.create_fuelOut, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(fuelOutData),
      }).then(result => result.json())
      .then(data => {
          if(data.error != null)
            console.log(data.error)
          clear()
      })
    }
  }

  const handleRefuelTypeChange = (e) => {
    setRefuelType(e.target.value);
  };

  const handleConfirmRefuelType = () => {
    setShowRefuelDetails(true);
  };

  const handleConfirmRefuelDetails = () => {
    console.log("Refuel details confirmed!");
  };

  const handleCancel = () => {
    setShowRefuelDetails(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Refuel Type</ModalHeader>
        <ModalBody>
          {!showRefuelDetails && (
            <FormControl>
              <FormLabel>Select Refuel Type</FormLabel>
              <Select
                placeholder="Select refuel type"
                onChange={handleRefuelTypeChange}
              >
                <option value="tank">Refuel Tank</option>
                <option value="truck">Refuel Truck</option>
              </Select>
            </FormControl>
          )}
          {showRefuelDetails && (
            <>
              {refuelType === "tank" && (
                <>
                  <FormControl mt={4}>
                    <FormLabel>Date and Time</FormLabel>
                    <Input type="datetime-local" value={fRecordDateTime} onChange={(e) =>
                    setFRecordDateTime(e.target.value)}/>
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Quantity</FormLabel>
                    <Input value={fLiters} onChange={(e) =>
                    setFLiters(e.target.value)}/>
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Cost</FormLabel>
                    <Input value={fUnitCost} onChange={(e) =>
                    setFUnitCost(e.target.value)}/>
                  </FormControl>
                </>
              )}
              {refuelType === "truck" && (
                <>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Date and Time</FormLabel>
                    <Input type="datetime-local" value={oRecordDateTime} onChange={(e) =>
                    setORecordDateTime(e.target.value)}/>
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Driver Name</FormLabel>
                    <Input  value={oDriverID} onChange={(e) =>
                    setODriverID(e.target.value)}/>
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Plate Number</FormLabel>
                    <Input value={oPlateNumber} onChange={(e) =>
                    setOPlateNumber(e.target.value)}/>
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Quantity</FormLabel>
                    <Input value={ofLiters} onChange={(e) => 
                    setOLiters(e.target.value)}/>
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Previous Route</FormLabel>
                    <Input value={oPreviousRoute} onChange={(e) =>
                    setOPreviousRoute(e.target.value)}/>
                  </FormControl>
                </>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {refuelType ? (
            showRefuelDetails ? (
              <HStack spacing={4}>
                <SaveButton
                  title={"Confirm Fuel Entry"}
                  clickFunction={handleConfirmRefuelDetails}
                />
                <CancelButton title={"Cancel"} clickFunction={handleCancel} />
              </HStack>
            ) : (
              <Button
                bg={"green.400"}
                color={"white"}
                px={"0.7em"}
                size={"sm"}
                borderRadius={"0.4em"}
                leftIcon={<Icon as={MdCheckCircle} boxSize={"1.3em"} />}
                onClick={handleConfirmRefuelType}
                disabled={!refuelType}
              >
                Confirm
              </Button>
            )
          ) : (
            <Button
              bg={"green.400"}
              color={"white"}
              px={"0.7em"}
              size={"sm"}
              borderRadius={"0.4em"}
              leftIcon={<Icon as={MdCheckCircle} boxSize={"1.3em"} />}
              disabled
            >
              Confirm
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFuelEntry;
