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
import { nanoid } from 'nanoid';

function CategoryListModal({modalOpen, title, options, apiPath}) {
    const { isOpen, onClose } = modalOpen;
    const [addClicked, setAddClicked] = useState(false);
    const [saveActivated, setSaveActivated] = useState(false);
    const [newCategory, setNewCategory] = useState({
        id: "",
        name: "",
        disabled: false,
    })
    const [newOptions, setNewOptions] = useState(options || []); 

    function openAdd() {
        setAddClicked(true)
        setNewCategory((prevState) => ({
            ...prevState,
            id: nanoid(15),
            name: "",
            disabled: false,
        }))
    }

    function enableEdit(option) {
        setNewCategory(option)
        setAddClicked(false)
    }
    
    function closeAdd() {
        clearNewCategory();
        setAddClicked(false);
    }

    function clearNewCategory() {
		setNewCategory((prevState) => ({
			...prevState,
            id: "",
            name: "",
			disabled: false,
		}));
	}

    function saveAdd() {
        if (JSON.stringify(newOptions[0]) == "{}") {
			newOptions.shift();
		}
        setNewOptions((newOptions) => [...newOptions, newCategory]);
        clearNewCategory();
        setAddClicked(false);

        if (!saveActivated) {
            setSaveActivated(true)
        }
    }
    
    function saveEdit() {
        setNewOptions(
            newOptions.map(option => 
                option.id == newCategory.id
                ? {...option, name: newCategory.name, disabled: newCategory.disabled}
                : option
            )
        )
        clearNewCategory()
        setSaveActivated(activateSave())
    }

    function InOriginal(newOption) {
        return options.some(option => option.name == newOption.name && option.disabled == newOption.disabled)
    }

    function activateSave() {
        return newOptions.every((newOption) => InOriginal(newOption))
    }

    function saveChanges() {
        let newArr = []
        let editArr = []
        newOptions.forEach((newOption) => {
            if (!InOriginal(newOption)) {
                if (options.find((option) => option.id == newOption.id)) 
                    editArr.push(newOption)
                else newArr.push(newOption)
            }
            
        })

        let categoryData = {
            additions: newArr,
            edits: editArr,
        }
        fetch(apiPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"            
            },
            body: JSON.stringify(categoryData)
        })
    
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
                    {newOptions.map((option, index) => {
                        if (option.id == newCategory.id) {
                            return (
                                <Tr key={index}>
                                    <Td><Switch isChecked={!newCategory.disabled} onChange={() => setNewCategory((prevState) => ({...prevState, disabled: !newCategory.disabled}))} alignSelf={"center"} /></Td>
                                    <Td display={"flex"} alignItems={"center"} gap={3}>
                                        <Input placeholder={option.name} value={newCategory.name} onChange={(e) => setNewCategory((prevState) => ({...prevState, name: e.target.value}))} />
                                        {newCategory.name != "" && newCategory.name != option.name || newCategory.disabled != option.disabled ? (
                                            <>
                                                <IconButton aria-label={"Cancel Edit"} icon={<CloseIcon />} onClick={() => clearNewCategory()}></IconButton>
                                                <IconButton aria-label={"Save Changes"} icon={<CheckIcon />} onClick={() => saveEdit()}></IconButton>
                                            </>
                                            ) : (<IconButton aria-label={"Cancel Edit"} icon={<CloseIcon />} onClick={() => clearNewCategory()}></IconButton>)
                                        }
                                    </Td>
                                </Tr> 
                            )
                        }
                        else 
                            return (
                                    <Tr key={index} onClick={() => enableEdit(option)} cursor={"pointer"}>
                                        { option.disabled == false ? (<Td color={"green.300"}>⬤</Td>) : (<Td color={"red.300"}>⬤</Td>)}
                                        <Td>{option.name}</Td>
                                    </Tr>
                            )
                    })}
                    { addClicked ? (
                        <>                        
                            <Tr key={index}>
                                <Td><Switch isChecked={!newCategory.disabled} onChange={() => setNewCategory((prevState) => ({...prevState, disabled: !newCategory.disabled}))} /></Td>
                                <Td display={"flex"} alignItems={"center"} gap={3}>
                                    <Input placeholder={`Enter New Option`} value={newCategory.name} onChange={(e) => setNewCategory((prevState) => ({...prevState, name: e.target.value}))} />
                                    {newCategory.name != "" ? (
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
              <Button variant='ghost' onClick={() => openAdd()}>Add Option</Button>
              {saveActivated ? (<Button variant='ghost' onClick={() => saveChanges()}>Save Changes</Button>) : (<></>)}

            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default CategoryListModal;