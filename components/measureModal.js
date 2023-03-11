import React, { useState } from 'react';
import {
    Button,
    Text,
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
    Tr,
    Th,
    Td,
    Switch, 
    Input,
    IconButton,
  } from '@chakra-ui/react';
import { CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { nanoid, customAlphabet } from 'nanoid';
import { numbers } from 'nanoid-dictionary';

function MeasureListModal({modalOpen, title, options, apiPath}) {
    const nanoid = customAlphabet(numbers, 5) // id generator
    const { isOpen, onClose } = modalOpen;
    const [addClicked, setAddClicked] = useState(false);
    const [saveActivated, setSaveActivated] = useState(false);
    const [newCategory, setNewCategory] = useState({
        id: "",
        name: "",
        abbreviation: "", // abbreviation
        disabled: false,
    })
    const [newOptions, setNewOptions] = useState(options || []); 

    function openAdd() {
        setAddClicked(true)
        setNewCategory((prevState) => ({
            ...prevState,
            id: "",
            name: "",
            abbreviation: "",
            disabled: false,
        }))
    }

    function enableEdit(option) {
        setNewCategory((prevState) => ({
            ...prevState,
            id: option.pubId,
            name: option.name,
            abbreviation: option.abbreviation,
            disabled: option.disabled,
        }))
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
            abbreviation: "",
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
                option.pubId == newCategory.id
                ? {...option, name: newCategory.name, abbreviation: newCategory.abbreviation, disabled: newCategory.disabled}
                : option
            )
        )
        clearNewCategory()
        if (!saveActivated) {
            setSaveActivated(true)
        }
    }

    async function saveChanges() {
        let newArr = []
        let editArr = []

        for (var i=0; i < newOptions.length; i++) {
            if (i < options.length && (newOptions[i].name != options[i].name || newOptions[i].disabled != options[i].disabled)) 
                editArr.push(newOptions[i])
            else if (i >= options.length) {
                newOptions[i].id = nanoid()
                newArr.push(newOptions[i])
            }
                
            
        }

        let categoryData = {
            additions: newArr,
            edits: editArr,
        }
        console.log(categoryData)
        await fetch(apiPath, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"            
            },
            body: JSON.stringify(categoryData)
        }).then( result => {
            console.log(result.json())
            location.reload() // TEMP ONLY
        })

        
    }

    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
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
                        <Th>Abbv.</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {options.length == 0 ? (
                        <Text>No records to show</Text>
                        ) : (<></>)}
                    {newOptions.map((option, index) => {
                        if (option.pubId == newCategory.id) {
                            return (
                                <Tr key={option.pubId}>
                                    <Td><Switch isChecked={!newCategory.disabled} onChange={() => setNewCategory((prevState) => ({...prevState, disabled: !newCategory.disabled}))} alignSelf={"center"} /></Td>
                                    <Td><Input placeholder={option.name} value={newCategory.name} onChange={(e) => setNewCategory((prevState) => ({...prevState, name: e.target.value}))} /></Td>
                                    <Td display={"flex"} alignItems={"center"} gap={3}>

                                        <Input placeholder={option.abbreviation} value={newCategory.abbreviation} onChange={(e) => setNewCategory((prevState) => ({...prevState, abbreviation: e.target.value}))} />
                                        {newCategory.name != "" && newCategory.name != option.name || 
                                            newCategory.disabled != option.disabled ||
                                            newCategory.abbreviation != option.abbreviation ? (
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
                                    <Tr key={option.pubId} onClick={() => enableEdit(option)} cursor={"pointer"}>
                                        { option.disabled == false ? (<Td color={"green.300"}>⬤</Td>) : (<Td color={"red.300"}>⬤</Td>)}
                                        <Td>{option.name}</Td>
                                        <Td>{option.abbreviation}</Td>
                                    </Tr>
                            )
                    })}
                    { addClicked ? (
                        <>                        
                            <Tr key={"New Option"}>
                                <Td><Switch isChecked={!newCategory.disabled} onChange={() => setNewCategory((prevState) => ({...prevState, disabled: !newCategory.disabled}))} /></Td>
                                <Td><Input placeholder={`Enter New Option`} value={newCategory.name} onChange={(e) => setNewCategory((prevState) => ({...prevState, name: e.target.value}))} /></Td>
                                <Td display={"flex"} alignItems={"center"} gap={3}>
                                
                                    <Input placeholder={`Enter Abbreviation`} value={newCategory.abbreviation} onChange={(e) => setNewCategory((prevState) => ({...prevState, abbreviation: e.target.value}))} />
                                    {newCategory.name != "" && newCategory.abbreviation != "" ? (
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

export default MeasureListModal;