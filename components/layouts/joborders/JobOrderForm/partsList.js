import { 
    Grid, 
    GridItem, 
    Text,
    ButtonGroup,
    Button,
    IconButton,
    Input,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Link,
    useDisclosure,
    Card,
    CardHeader,
    CardBody,
    Flex
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState, useEffect, useReducer } from "react";
import { AddButton, CancelButton, SaveButton } from "@/components/buttons";
import { MdOutlineCancel, MdOutlineSave } from "react-icons/md";
import { 
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteList,
    AutoCompleteItem
} from "@choc-ui/chakra-autocomplete";

export default function CreateJobOrderPartsList({options, selectedJobs, setSubmitArray}) {
    const [cachedJobs, setCachedJobs] = useState(selectedJobs)
    const [template, setTemplate] = useState({
        jobList: [],
        itemID: "",
        itemNumber: "",
        itemName: "",
        itemModel: "",
        quantity: 0,
        manualQty: 0,
    })
    const [partsList, dispatch] = useReducer((state, action) => {
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
            case "add quantity based on job select": {
                return state.map((row, i) => i == action.payload.index && row.itemNumber == action.payload.itemNumber
                    ? {...row, quantity: row.quantity + action.payload.addedQuantity}
                    : row
                )
            }
            case "minus quantity based on job select": {
                return state.map((row, i) => i == action.payload.index && row.itemNumber == action.payload.itemNumber
                    ? {...row, quantity: row.quantity - action.payload.quantity}
                    : row
                )
            }
            default: 
                return []
        }
    })



    // Initialize empty array for partsList
    // Clear template after updating partsList
    useEffect(() => {
        if (partsList == null) {
            dispatch({type: "initialize"})
        }

        if (partsList != null) {
            partsList.map((item, index) => {
                if (item.quantity == 0){
                    dispatch({type: "delete", payload: index})
                }
            })
        }
        setSubmitArray(partsList)
        clearTemplate()
    }, [partsList])

    // Print items of selected jobs
    useEffect(() => {
        if (selectedJobs.length > cachedJobs.length) {
            for (let i=cachedJobs.length; i<selectedJobs.length; i++) {
                let jobObjects = options.jobItems.filter(option => option.jobID.name == selectedJobs[i])
            
                jobObjects.map(object => {
                    let itemIndex = partsList.findIndex(item => item.itemNumber == object.itemID.itemNumber)
                    if (itemIndex == -1) {
                        dispatch({type: "add", payload: {
                            itemID: object.itemID._id,
                            itemNumber: object.itemID.itemNumber,
                            itemName: object.itemID.itemName,
                            itemModel: object.itemID.itemModel,
                            quantity: object.recommendedQty,
                            manualQty: 0,
                        }})
                    }
                    else if (itemIndex != -1 && partsList[itemIndex].quantity >= object.recommendedQty) {
                        dispatch({type: "add quantity based on job select", payload: {
                            index: itemIndex,
                            itemNumber: object.itemID.itemNumber,
                            addedQuantity: object.recommendedQty
                        }})
                    }
                    else if (partsList[itemIndex].quantity < object.recommendedQty) {
                        console.log("Not enough of this item available")
                    }
                })
            } 
        }
        else if (selectedJobs.length < cachedJobs.length) {
            for (let i=0; i<cachedJobs.length; i++) {
                let jobObjects = options.jobItems.filter(option => option.jobID.name == cachedJobs[i])

                jobObjects.map((object, index) => {
                    let jobIndex = selectedJobs.findIndex(job => object.jobID.name == job)
                    if (jobIndex == -1) {
                        let itemIndex = partsList.findIndex(item => object.itemID.itemNumber == item.itemNumber)
                        dispatch({type: "minus quantity based on job select", payload: {
                            index: itemIndex,
                            itemNumber: object.itemID.itemNumber,
                            quantity: object.recommendedQty
                        }})
                    }
                })
            }
        }
        setCachedJobs(selectedJobs)
    }, [selectedJobs])

    // Function to clear template
    function clearTemplate() {
        setTemplate({
            itemID: "",
            itemNumber: "",
            itemName: "",
            itemModel: "",
            quantity: 0,
            manualQty: 0,
        })
    }

    // Function to fill data template with item info after selecting from autocomplete
    function handleItemSelect(value) {
        let item = options.partItems.find(option => option.itemNumber == value)
        setTemplate((prevState) => ({
            itemID: item._id,
            itemNumber: item.itemNumber,
            itemName: item.itemName,
            itemModel: item.itemModel,
            quantity: prevState.quantity,
            manualQty: prevState.manualQty
        }));
    }



    if (partsList != null)
        return (
            <Card variant={"outline"} >
                <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                    <Text fontSize={"xl"} fontWeight={"bold"}>Parts List</Text>
                </CardHeader>
                <CardBody px={0}>
                    <Grid 
                        borderRadius={"5px"}
                        templateColumns={"0.7fr 1.5fr 1.5fr 4fr 1fr 1fr"}
                        autoFlow={"row"}
                        gap={2}
                    >
                        {/* DETAILS HEADERS */}
                        <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                        <GridItem colStart={2} colSpan={3}><Text fontWeight={"medium"}>Item</Text></GridItem>
                        {/* <CategoryListModal modalOpen={brandModalOpen} options={data.brands} title={"Spare Parts Brands"} apiPath={sparePartsAPI.modify_brand}></CategoryListModal> */}
                        <GridItem colStart={5}><Text fontWeight={"medium"}>Quantity</Text></GridItem>
                        <GridItem colSpan={6} ><hr /></GridItem>

                        {   partsList != null ? (
                                partsList.map((row, index) => {
                                    return (
                                        <>
                                            <GridItem colStart={1} m={"auto"} fontWeight={"semibold"}><Text>{index + 1}</Text></GridItem>
                                            <GridItem colStart={2} display={"flex"} alignItems={"center"} >
                                                <Text>{row.itemNumber}</Text>
                                            </GridItem>
                                            <GridItem colStart={3} display={"flex"} alignItems={"center"} >
                                                <Text>{row.itemName}</Text>
                                            </GridItem>
                                            <GridItem colStart={4} display={"flex"} alignItems={"center"} >
                                                <Text>{row.itemModel}</Text>
                                            </GridItem>
                                            <GridItem colStart={5} display={"flex"} alignItems={"center"}><Text fontSize={"lg"} fontWeight={"bold"}>{parseInt(row.quantity) + parseInt(row.manualQty)}</Text></GridItem>
                                            <GridItem colStart={6} display={"flex"} alignItems={"center"}>
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
                        <GridItem colSpan={6} minH={"0.3em"}></GridItem>
                        {rowInput()}
                    </Grid>
                </CardBody>
            </Card>
        )

    function createRow(item, index) {
        return (
            <>
                <GridItem colStart={1} m={"auto"} py={2}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
                <GridItem colStart={2} py={2}><Text>{item.partNumber}</Text></GridItem>
                <GridItem colStart={3} py={2}><Text>{item.itemBrandID}</Text></GridItem>
                <GridItem colStart={4} py={2}><Text>{item.quantity}</Text></GridItem>
                <GridItem colStart={5} py={2}><Text>Php {item.unitPrice}</Text></GridItem>
            </>
        )
    }

    function rowInput() {
        return (
        <>
            <GridItem colStart={1} m={"auto"} fontWeight={"semibold"}><Text>{partsList.length + 1}</Text></GridItem>
            <GridItem colStart={2} colSpan={4}>
                <Flex gap={10}>
                    <Flex w={"50%"}>
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
                    </Flex>
                    <Flex gap={5} alignItems={"center"}>
                        <Text fontWeight={"semibold"}>Qty</Text>
                        <NumberInput min={0} max={1000} precision={0} value={template.manualQty} onChange={(value) => setTemplate((prevState) => ({...prevState, manualQty: value}))}>
                            <NumberInputField  />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <AddButton title={"Add Item"} clickFunction={() => dispatch({type: "add", payload: template})} />
                    </Flex>
                    
                </Flex>
            </GridItem>
        </>

        )
    }
}