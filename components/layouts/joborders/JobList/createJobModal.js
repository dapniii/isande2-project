import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Flex,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    FormHelperText,
    Text,
    Select,
    Textarea,
    Grid,
    GridItem,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useDisclosure,
    Link,
    Container
} from '@chakra-ui/react';
import { 
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteList,
    AutoCompleteItem
} from "@choc-ui/chakra-autocomplete";
import { MdCheck } from 'react-icons/md';
import { DeleteIcon } from '@chakra-ui/icons';
import { SaveButton } from '@/components/buttons';

function CreateJobModal({modalOpen, options}) {
    const { isOpen, onClose } = modalOpen;
    const [jobName, setJobName] = React.useState("")
    const [category, setCategory] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [template, setTemplate] = React.useState({
        itemID: "",
        itemNumber: "",
        itemName: "",
        itemModel: "",
        quantity: 0,
    })
    const [selectedItems, setSelectedItems]  = React.useState("")
    const [partsList, dispatch] = React.useReducer((state, action) => {
        switch (action.type) {
            case "initialize": // Get item data from context
                return []
            case "edit": { // replace edited item at index and return edited array
                return state.map((row, i) => i === action.payload.index ? action.payload.item : row)
            } 
            case "add": {// add new item at end of array 
                return [...state, action.payload]
            }
            case "delete": // delete item at specified index from array 
                return state.filter((row, i) => {return i != action.payload})
            case "disable": { // set disable to true for item at specified index
                return state.map((row, i) => i == action.payload ? {...row, disabled: true} : row)
            }
            default: 
                return []
        }
    })

    // Initialize empty array for partsList
    // Clear template after updating partsList
    React.useEffect(() => {
        if (partsList == null) {
            dispatch({type: "initialize"})
        }
        clearTemplate()
    }, [partsList])



    // Function to clear template
    function clearTemplate() {
        setTemplate({
            itemID: "",
            itemNumber: "",
            itemName: "",
            itemModel: "",
            quantity: 0,
        })
        setSelectedItems("")
    }

    // Function to fill data template with item info after selecting from autocomplete
    function handleItemSelect(value) {
        let item = options.partItems.find(option => option.itemNumber == value)
        console.log("SELECTED ITEM")
        console.log(item)
        setTemplate((prevState) => ({
            ...prevState,
            itemID: item._id,
            itemNumber: item.itemNumber,
            itemName: item.itemName,
            itemModel: item.itemModel,
        }));
    }

    async function submitForm() {
        let jobItemData = {
            name: jobName,
            categoryID: category,
            description: description,
            partsList: partsList,
        }
        console.log(jobItemData)
        let result = await fetch("/api/joborders/jobItems/createJobItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jobItemData),
        }).then(result => {
            console.log(result.json())
            location.reload()
        })
    }

    if (partsList != null)
        return (
            <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Predefined Job</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} gap={5} py={5}>
                        {/* Job description */}
                        <Flex flexDirection={"column"} w={"30%"} gap={2}>
                            <FormControl isRequired>
                                <FormLabel>Job Name</FormLabel>
                                <Input name={"jobName"} value={jobName} onChange={(e) => setJobName(e.target.value)} />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Category</FormLabel>
                                <Select name={"category"} value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="" hidden disabled>Select Category</option>
                                    {options.specialties.map((category) => {
                                        if (category.disabled == false) {
                                            return (
                                                <option key={category.pubId} value={category.name}>
                                                    {category.name}
                                                </option>
                                            );
                                        }
                                    })}
                            </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Description</FormLabel>
                                <Textarea name={"description"} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </FormControl>
                        </Flex>
                        {/* Job items */}
                        <Flex w={"70%"} p={5}>
                            <Flex w={"100%"} boxShadow={"xl"} borderRadius={"0.5em"} flexDir={"column"}>
                                <Text fontSize={"lg"} fontWeight={"semibold"} mx={5} my={2}>Parts List</Text>
                                <Grid
                                    w={"100%"}
                                    templateColumns={"0.5fr 5fr 2fr 0.5fr"}
                                    autoFlow={"row"}
                                    gap={2}
                                    pb={3}
                                >
                                    {/* DETAILS HEADERS */}
                                    <GridItem colSpan={4}><hr /></GridItem>
                                    <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                                    <GridItem colStart={2}><Text fontWeight={"medium"}>Item</Text></GridItem>
                                    <GridItem colStart={3}><Text fontWeight={"medium"}>Quantity</Text></GridItem>
                                    <GridItem colSpan={4}><hr /></GridItem>

                                    {   partsList != null ? (
                                            partsList.map((row, index) => {
                                                return (
                                                    <>
                                                        <GridItem colStart={1} m={"auto"} fontWeight={"semibold"}><Text>{index + 1}</Text></GridItem>
                                                        <GridItem colStart={2} display={"flex"} alignItems={"center"} gap={"5em"}>
                                                            <Text>{row.itemNumber}</Text>
                                                            <Text>{row.itemName}</Text>
                                                            <Text>{row.itemModel}</Text>
                                                        </GridItem>
                                                        <GridItem colStart={3} display={"flex"} alignItems={"center"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.quantity}</Text></GridItem>
                                                        <GridItem colStart={4} display={"flex"} alignItems={"center"}>
                                                            <IconButton
                                                                variant='outline'
                                                                size={"sm"}
                                                                colorScheme='gray'
                                                                aria-label='Save Job Item'
                                                                icon={<DeleteIcon />}
                                                                onClick={() => dispatch({type: "delete", payload: index})}
                                                            />  
                                                        </GridItem>
                                                        <GridItem colSpan={6}><hr /></GridItem>
                                                    </>
                                                )})
                                        ) : (<></>)
                                    }

                                    <GridItem colStart={2} pr={3}>
                                        <AutoComplete 
                                            openOnFocus
                                            focusInputOnSelect={false}
                                            suggestWhenEmpty
                                            restoreOnBlurIfEmpty={false} 
                                            mx={2} 
                                            onChange={(value) => handleItemSelect(value)}
                                        >
                                            <AutoCompleteInput variant="outline" />
                                            <AutoCompleteList>
                                                {options.partItems.map((item) => (
                                                    <AutoCompleteItem
                                                        key={item.itemNumber}
                                                        value={item.itemNumber}
                                                    >
                                                        <Flex flexDirection={"column"}>
                                                            <Text fontWeight={"bold"}>{item.itemNumber}</Text>
                                                            <Text fontSize={"sm"}>{item.itemName} {item.itemModel}</Text>
                                                        </Flex>
                                                    </AutoCompleteItem>
                                                ))}
                                            </AutoCompleteList>
                                        </AutoComplete>
                                    </GridItem>
                                    <GridItem colStart={3}>
                                        <NumberInput min={0} max={1000} precision={0} value={template.quantity} onChange={(value) => setTemplate((prevState) => ({...prevState, quantity: value}))}>
                                            <NumberInputField  />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </GridItem>
                                    <GridItem colStart={4} display={"flex"} alignItems={"center"}>
                                        <IconButton
                                            variant='outline'
                                            size={"sm"}
                                            colorScheme='gray'
                                            aria-label='Save Job Item'
                                            icon={<MdCheck />}
                                            onClick={() => dispatch({type: "add", payload: template})}
                                        />  
                                    </GridItem>
                                </Grid>
                            </Flex>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <SaveButton title={"Save Job"} clickFunction={() => submitForm()} />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
}

export default CreateJobModal