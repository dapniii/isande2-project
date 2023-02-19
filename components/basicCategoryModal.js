import React, { useState } from 'react';
import {
    Button,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Switch, 
    Input,
    IconButton,
    Link,
  } from '@chakra-ui/react';
import { CloseIcon, CheckIcon } from '@chakra-ui/icons';


function CategoryListModal({modalOpen, title, options}) {
    const { isOpen, onClose } = modalOpen;
    const [isAdd, setIsAdd] = useState(false);
    const [addName, setAddName] = useState("");
    const [addStatus, setAddStatus] = useState(false);

    const [isEdit, setIsEdit] = useState("")
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState(false);
    const [numChanges, setNumChanges] = useState(0);

    function closeAdd() {
        setAddName("");
        setAddStatus(false)
        setIsAdd(false);
    }

    // TO-DO
    function saveAdd() {
        setAddName("");
        setAddStatus(false)
        setIsAdd(false);
        setNumChanges(numChanges+1);
    }

    function enableEdit(option) {
        setIsEdit(option.name);
        setEditStatus(option.disabled)
    }
    
    function closeEdit() {
        setIsEdit("");
        setEditName("");
    }

    // TO-DO
    function saveEdit() {
        setIsEdit("");
        setEditName("");
        setNumChanges(numChanges+1);
    }

    // TO-DO
    function saveChanges() {
        console.log("Save changes to backend")
    }

    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Table variant='striped'>
                <Thead>
                    <Tr>
                        <Th w={"5%"}>Status</Th>
                        <Th>Name</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {options.map((option) => {
                        if (option.name == isEdit) {
                            return (
                                <Tr>
                                    <Td><Switch isChecked={!editStatus} onChange={() => setEditStatus(!editStatus)} alignSelf={"center"} /></Td>
                                    <Td display={"flex"} alignItems={"center"} gap={3}>
                                        <Input placeholder={option.name} value={editName} onChange={(e) => setEditName(e.target.value)} />
                                        {editName != "" ? (
                                            <>
                                                <IconButton aria-label={"Cancel Edit"} icon={<CloseIcon />} onClick={() => closeEdit()}></IconButton>
                                                <IconButton aria-label={"Save Changes"} icon={<CheckIcon />} onClick={() => saveEdit()}></IconButton>
                                            </>
                                            ) : (<IconButton aria-label={"Cancel Edit"} icon={<CloseIcon />} onClick={() => closeEdit()}></IconButton>)
                                        }
                                    </Td>
                                </Tr> 
                            )
                        }
                        else 
                            return (
                                    <Tr onClick={() => enableEdit(option)} cursor={"pointer"}>
                                        { option.disabled == false ? (<Td color={"green.300"}>⬤</Td>) : (<Td color={"red.300"}>⬤</Td>)}
                                        <Td>{option.name}</Td>
                                    </Tr>
                            )
                    })}
                    { isAdd ? (
                        <>                        
                            <Tr>
                                <Td><Switch isChecked={!addStatus} onChange={() => setAddStatus(!addStatus)} /></Td>
                                <Td display={"flex"} alignItems={"center"} gap={3}>
                                    <Input placeholder={`Enter New Option`} value={addName} onChange={(e) => setAddName(e.target.value)} />
                                    {addName != "" ? (
                                        <>
                                            <IconButton aria-label={"Cancel Edit"} icon={<CloseIcon />} onClick={() => closeAdd()}></IconButton>
                                            <IconButton aria-label={"Save Changes"} icon={<CheckIcon />} onClick={() => saveAdd()}></IconButton>
                                        </>
                                        ) : (<IconButton aria-label={"Cancel Edit"} icon={<CloseIcon />} onClick={() => closeAdd()}></IconButton>)
                                    }
                                </Td>
                            </Tr>
                        </>
                    )
                    : (<></>)
                    }

                </Tbody>
              </Table>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost' onClick={() => setIsAdd(true)}>Add Option</Button>
              {numChanges > 0 ? (<Button variant='ghost' onClick={() => saveChanges()}>Save Changes</Button>) : (<></>)}

            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default CategoryListModal;