import { useState, useEffect, useRef } from "react";
import { useDisclosure } from "@chakra-ui/react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  CircularProgress,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Icon,
  Flex,
  HStack,
  Center,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Box,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { SaveButton, BackButton, CancelButton } from "@/components/Buttons";
import { MdCheckCircle } from "react-icons/md";
import { generateID } from "@/lib/dataHandler";
import { fuelAPI } from "@/lib/routes";
import { useRouter } from "next/router";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
  AutoCompleteTag,
  AutoCompleteCreatable,
} from "@choc-ui/chakra-autocomplete";

const AddFuelEntry = ({
  creatorID,
  fuelInCount,
  fuelOutCount,
  isOpen,
  onClose,
  data,
  total,
}) => {
  const { reload } = useRouter();
  const { isOpen: Open, onOpen, onClose: Close } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef();

  const [refuelType, setRefuelType] = useState("");
  const [showRefuelDetails, setShowRefuelDetails] = useState(false);

  const [fuelInID, setFuelInID] = useState(generateID(fuelInCount, 15));
  const [fRecordDateTime, setFRecordDateTime] = useState("");
  const [fUnitCost, setFUnitCost] = useState("");
  const [fLiters, setFLiters] = useState("");

  const [fuelOutID, setFuelOutID] = useState(generateID(fuelOutCount, 15));
  const [oRecordDateTime, setORecordDateTime] = useState("");
  const [oDriver, setODriver] = useState("");
  //const [oUserID, setOUserID] = useState("");
  const [oPlateNumber, setOPlateNumber] = useState("");
  const [ofLiters, setOLiters] = useState("");
  const [oPreviousRoute, setOPreviousRoute] = useState("");

  const format = (val) => `₱` + val;
  const parse = (val) => {
    if (typeof val === "string") {
      return val.replace(/^\₱/, "");
    }
    return val;
  };

  function clear() {
    setFuelInID("");
    setFRecordDateTime("");
    setFUnitCost("");
    setFLiters("");
    setFuelOutID("");
    setORecordDateTime("");
    setODriver("");
    // setOUserID("");
    setOPlateNumber("");
    setOLiters("");
    setOPreviousRoute("");
  }

  async function submitForm() {
    setIsLoading(true);
    if (refuelType == "tank") {
      const fuelInData = {
        fuelInID: fuelInID,
        fRecordDateTime: fRecordDateTime,
        fUnitCost: fUnitCost,
        fLiters: fLiters,
        creatorID: creatorID,
      };
      //EDIT FUELINAPI
      await fetch(fuelAPI.create_fuelIn, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fuelInData),
      })
        .then((result) => result.json())
        .then((data) => {
          if (data.error != null) console.error(data.error);
          reload();
        })
        .finally(() => setIsLoading(false));
    } else {
      let fuelOutData = {
        fuelOutID: fuelOutID,
        oRecordDateTime: oRecordDateTime,
        oDriver: oDriver,
        //oUserID: oUserID,
        oPlateNumber: oPlateNumber,
        ofLiters: ofLiters,
        oPreviousRoute: oPreviousRoute,
        creatorID: creatorID,
      };
      console.log(fuelOutData);
      await fetch(fuelAPI.create_fuelOut, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fuelOutData),
      })
        .then((result) => result.json())
        .then((data) => {
          if (data.error != null) console.log(data.error);
          reload();
        })
        .finally(() => setIsLoading(false));
    }
  }

  const handleRefuelTypeChange = (e) => {
    setRefuelType(e.target.value);
  };

  const handleConfirmRefuelType = () => {
    setShowRefuelDetails(true);
  };

  const handleCancel = () => {
    setShowRefuelDetails(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontWeight="bold" textAlign="center">
          Add Fuel Entry
        </ModalHeader>
        <ModalBody>
          {!showRefuelDetails && (
            <FormControl>
              <FormLabel>Select Refuel Type</FormLabel>
              <Select
                placeholder="Select Refuel Type"
                onChange={handleRefuelTypeChange}
              >
                <option value="tank" disabled={total === 64000}>
                  Refuel Tank
                </option>
                <option value="truck" disabled={total === 0}>
                  Refuel Truck
                </option>
              </Select>
            </FormControl>
          )}
          {showRefuelDetails && (
            <>
              {refuelType === "tank" && (
                <>
                  <ModalHeader fontWeight="bold">
                    Fuel Entry Details (Refuel Tank)
                  </ModalHeader>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Date and Time</FormLabel>
                    <Input
                      type="datetime-local"
                      value={fRecordDateTime}
                      onChange={(e) => setFRecordDateTime(e.target.value)}
                    />
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Quantity</FormLabel>
                    <NumberInput
                      precision={2}
                      step={0.01}
                      min={1}
                      value={isNaN(fLiters) ? 0 : fLiters}
                      max={64000 - total}
                      onChange={(_, value) => setFLiters(value)}
                    >
                      <NumberInputField inputMode="decimal" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl mt={4} isRequired>
                    <FormLabel>Unit Cost</FormLabel>
                    <NumberInput
                      step={0.01}
                      min={1}
                      value={format(fUnitCost)}
                      onChange={(_, value) => setFUnitCost(parse(value))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </>
              )}
              {refuelType === "truck" && (
                <>
                  <ModalHeader fontWeight="bold">
                    Fuel Entry Details (Refuel Truck)
                  </ModalHeader>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Date and Time</FormLabel>
                    <Input
                      type="datetime-local"
                      value={oRecordDateTime}
                      onChange={(e) => setORecordDateTime(e.target.value)}
                    />
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Driver Name</FormLabel>

                    <AutoComplete
                      openOnFocus
                      suggestWhenEmpty
                      value={oDriver}
                      onChange={setODriver}
                    >
                      <AutoCompleteInput variant="outline" />
                      <AutoCompleteList w={"100%"}>
                        {data.users
                          ?.filter((item) => item.roleID.name === "Driver")
                          .map((item) => (
                            <AutoCompleteItem
                              key={`${item.firstName} ${item.lastName}`}
                              value={`${item.firstName} ${item.lastName}`}
                            >
                              <Flex gap={5}>
                                <Image
                                  src={item.imageID.secure_url}
                                  alt={item.firstName}
                                  objectFit={"cover"}
                                  borderRadius={"15"}
                                  w={"5em"}
                                />
                                <Flex flexDirection={"column"}>
                                  <Text fontWeight={"bold"}>
                                    {item.firstName} {item.lastName}
                                  </Text>
                                  <Text>{item.roleID.name}</Text>
                                </Flex>
                              </Flex>
                            </AutoCompleteItem>
                          ))}
                      </AutoCompleteList>
                    </AutoComplete>
                    {/* <Input
                      value={oDriver}
                      onChange={(e) => setODriver(e.target.value)}
                    /> */}
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Plate Number</FormLabel>
                    {/*********************TO EDIT *********************/}
                    <AutoComplete
                      openOnFocus
                      suggestWhenEmpty
                      value={oPlateNumber}
                      onChange={setOPlateNumber}
                    >
                      <AutoCompleteInput variant="outline" />
                      <AutoCompleteList w={"100%"}>
                        {data.vehicles?.map((item) => (
                          <AutoCompleteItem
                            key={item.plateNumber}
                            value={item.plateNumber}
                          >
                            <Flex gap={5}>
                              <Image
                                src={item.imageID.secure_url}
                                alt={item.plateNumber}
                                objectFit={"cover"}
                                borderRadius={"15"}
                                w={"5em"}
                              />
                              <Flex flexDirection={"column"}>
                                <Text fontWeight={"bold"}>
                                  {item.plateNumber}
                                </Text>
                                <Text>
                                  {item.brandID.name} {item.vehicleTypeID.name}
                                </Text>
                              </Flex>
                            </Flex>
                          </AutoCompleteItem>
                        ))}
                      </AutoCompleteList>
                    </AutoComplete>
                    {/* <Input
                      value={oPlateNumber}
                      onChange={(e) => setOPlateNumber(e.target.value)}
                    /> */}
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Quantity</FormLabel>
                    <NumberInput
                      step={0.01}
                      min={1}
                      value={isNaN(ofLiters) ? 0 : ofLiters}
                      max={total < 550 ? total : 550}
                      onChange={(_, value) => setOLiters(value)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {/* <Input
                      value={ofLiters}
                      onChange={(e) => setOLiters(e.target.value)}
                    /> */}
                  </FormControl>
                  <FormControl mt={4} isRequired>
                    <FormLabel>Previous Route</FormLabel>
                    <Input
                      value={oPreviousRoute}
                      onChange={(e) => setOPreviousRoute(e.target.value)}
                    />
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
                <SaveButton title={"Save Fuel Entry"} clickFunction={onOpen} />
                <AlertDialog
                  isOpen={Open}
                  leastDestructiveRef={cancelRef}
                  onClose={Close}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Confirm fuel entry details!
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Box mr={2}>
                          <SaveButton
                            title={"Save Fuel Entry"}
                            clickFunction={submitForm}
                          />
                        </Box>{" "}
                        {isLoading ? (
                          <CircularProgress
                            size="30px"
                            isIndeterminate
                            color="green.400"
                          />
                        ) : (
                          <Box>
                            <CancelButton
                              title={"Cancel"}
                              clickFunction={Close}
                            />
                          </Box>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
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
