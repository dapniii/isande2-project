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

function JobDetailsModal({modalOpen, options, data}) {
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

    if (data != "")
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Job Details - {data.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody display={"flex"} flexDir={"column"} gap={5} py={5}>
                    <Flex gap={10}>
                        <Flex flexDir={"column"}>
                            <Text fontWeight={"bold"}>Job Name</Text>
                            <Text mb={"1em"}>{data.name}</Text>
                            
                            <Text fontWeight={"bold"}>Category</Text>
                            <Text>{data.categoryID.name}</Text>
                        </Flex>
                        <Flex flexDir={"column"}>
                            <Text fontWeight={"bold"}>Description</Text>
                            <Text>{data.description}</Text>
                        </Flex>
                    </Flex>


                    <Flex w={"100%"} boxShadow={"2xl"} borderRadius={"0.5em"} flexDir={"column"}>
                        <Text fontSize={"lg"} fontWeight={"bold"} p={2}>Parts List</Text>
                        <Grid
                            w={"100%"}
                            templateColumns={"1fr 5fr 2fr"}
                            autoFlow={"row"}
                            gap={2}
                            pb={"1em"}
                        >
                            {/* DETAILS HEADERS */}
                            <GridItem colSpan={3}><hr /></GridItem>
                            <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                            <GridItem colStart={2}><Text fontWeight={"medium"}>Item</Text></GridItem>
                            <GridItem colStart={3}><Text fontWeight={"medium"}>Quantity</Text></GridItem>
                            <GridItem colSpan={3}><hr /></GridItem>
                            {
                                data.jobItems.map((item, index) => {
                                    return (
                                        <>
                                            <GridItem colStart={1} fontWeight={"bold"} m={"auto"}><Text>{index + 1}</Text></GridItem>
                                            <GridItem colStart={2} display={"flex"} gap={"4em"}>
                                                <Text>{item.itemID.itemNumber}</Text>
                                                <Text>{item.itemID.itemName}</Text>
                                                <Text>{item.itemID.itemModel}</Text>
                                            </GridItem>
                                            <GridItem colStart={3} display={"flex"} alignItems={"baseline"} gap={1}>
                                                <Text fontSize={"lg"} fontWeight={"bold"}>{item.recommendedQty}</Text>
                                                <Text fontSize={"sm"} color={"gray"}>{item.itemID.unitID.abbreviation}</Text>
                                            </GridItem>
                                        </>

                                    )
                                })
                            }
                        </Grid>
                    </Flex>
      
                </ModalBody>
                <ModalFooter>
                    {/* <SaveButton title={"Save Job"} clickFunction={() => submitForm()} /> */}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default JobDetailsModal