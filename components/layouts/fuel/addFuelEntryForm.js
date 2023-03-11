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
} from "@chakra-ui/react";
import { SaveButton, BackButton, CancelButton } from "@/components/buttons";

const AddFuelEntry = ({ isOpen, onClose }) => {
  const [refuelType, setRefuelType] = useState("");
  const [showRefuelDetails, setShowRefuelDetails] = useState(false);

  const handleRefuelTypeChange = (e) => {
    setRefuelType(e.target.value);
  };

  const handleConfirmRefuelType = () => {
    setShowRefuelDetails(true);
  };

  const handleConfirmRefuelDetails = () => {
    console.log("Refuel details confirmed!");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              {refuelType === "truck" && (
                <>
                  <FormControl mt={4}>
                    <FormLabel>Date and Time</FormLabel>
                    <Input type="datetime-local" />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Quantity</FormLabel>
                    <Input />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Unit Price</FormLabel>
                    <Input />
                  </FormControl>
                </>
              )}
              {refuelType === "tank" && (
                <>
                  <FormControl mt={4}>
                    <FormLabel>Date and Time</FormLabel>
                    <Input type="datetime-local" />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Driver Name</FormLabel>
                    <Input />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Plate Number</FormLabel>
                    <Input />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Quantity</FormLabel>
                    <Input />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Previous Route</FormLabel>
                    <Input />
                  </FormControl>
                </>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {refuelType === "truck" && (
            <SaveButton title={"Confirm Fuel Entry"} clickFunction={handleConfirmRefuelType} />
          )}
          {refuelType === "tank" && (
            <SaveButton title={"Confirm Fuel Entry"} clickFunction={handleConfirmRefuelType} />
          )}
          <CancelButton title={"Cancel"} clickFunction={onClose} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddFuelEntry;
