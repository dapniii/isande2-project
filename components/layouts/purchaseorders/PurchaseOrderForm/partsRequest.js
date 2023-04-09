import { useReducer, useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Text,
    Grid,
    GridItem,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    IconButton,
    Flex,
    ButtonGroup
} from "@chakra-ui/react"
import { 
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteList,
    AutoCompleteItem
} from "@choc-ui/chakra-autocomplete";
import { AddButton } from "@/components/buttons";
import { MdCancel, MdCheckCircle } from "react-icons/md";

function PurchaseOrderPartsRequestList({options, setSubmitArray, initialData}) {
    const [editState, setEditState] = useState(false)
    const [partTemplate, setPartTemplate] = useState({
        itemID: "",
        itemNumber: "",
        itemName: "",
        itemModel: "",
        quantity: 0,
    })

    const [partsList, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "initialize": // Get item data from context
                return initialData
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
                return initialData.partsList
        }
    })

    // Initialize empty array for partsList
    // Clear template after updating partsList
    useEffect(() => {
        if (partsList == null) {
            dispatch({type: "initialize"})            
        }

        if (partsList != null) {
            clearTemplate()
            setEditState(false)
            setSubmitArray(partsList)
        }
    }, [partsList])
    

    function clearTemplate() {
        setPartTemplate({
            itemID: "",
            itemNumber: "",
            itemName: "",
            itemModel: "",
            quantity: 0,
        })
    }

    
    return (
        <Card variant={"outline"} >
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Parts List</Text>
            </CardHeader>
            <CardBody px={0}>
                <Grid
                    templateColumns={"0.7fr 7fr 2fr 1fr"}
                    autoFlow={"row"}
                    gap={3}
                >
                    {/* Headers */}
                    <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                    <GridItem colStart={2}><Text>Item</Text></GridItem>
                    <GridItem colStart={3}><Text>Requested Qty</Text></GridItem>
                    <GridItem colStart={4}><Text>{" "}</Text></GridItem>
                    <GridItem colSpan={4}><hr /></GridItem>

                    {
                        partsList != null ? (
                            partsList.map((row, index) => {
                                return (
                                    <>
                                        {/* Sample */}
                                        <GridItem colStart={1} m={"auto"}><Text fontWeight={"semibold"}>{index + 1}</Text></GridItem>
                                        <GridItem colStart={2} my={"auto"}><Text>{row.itemName + " " + row.itemModel}</Text></GridItem>
                                        <GridItem colStart={3} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.quantity}</Text></GridItem>

                                        <GridItem colStart={4}>
                                            {
                                                initialData == null ? (                                                
                                                    <IconButton
                                                        variant={"outline"}
                                                        border={"1px solid white"}
                                                        color={"red"}
                                                        aria-label="Delete item"
                                                        icon={<MdCancel />}
                                                        onClick={() => dispatch({type: "delete", payload: index})}
                                                    />) : (<></>) 
                                            }

                                        </GridItem>
                                    </>
                                )
                            })
                        ) : (<></>)
                    }

                    { 
                        editState ? 
                            ( rowInput() ) 
                            : 
                            (
                                <GridItem colStart={2}>
                                    <AddButton title={"Add Item"} clickFunction={() => setEditState(true)} />
                                </GridItem>
                            )
                    }

                </Grid>
            </CardBody>
        </Card>
    )

    function handleItemSelect(value) {
        let item = options.partsList.find(option => option.itemNumber == value)
        setPartTemplate((prevState) => ({
            itemID: item._id,
            itemNumber: item.itemNumber,
            itemName: item.itemName,
            itemModel: item.itemModel,
        }));
    }

    function rowInput() {
        return (
            <>
                <GridItem colStart={1} m={"auto"}><Text fontWeight={"semibold"}>{partsList != null ? (partsList.length + 1) : (<></>)} </Text></GridItem>
                <GridItem colStart={2}>
                    <AutoComplete 
                        openOnFocus
                        focusInputOnSelect={false}
                        suggestWhenEmpty
                        restoreOnBlurIfEmpty={false} 
                        mx={2} 
                        onChange={(value) => handleItemSelect(value)}
                    >
                        <AutoCompleteInput 
                            border={"2px solid #9F9F9F"} 
                            value={partTemplate.itemNumber} 
                            variant="outline" 
                        />
                        <AutoCompleteList maxH={"15em"}>
                            {options.partsList.map((item) => (
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
                    <NumberInput 
                        min={0} 
                        precision={0}
                        value={partTemplate.quantity}
                        onChange={(value) => setPartTemplate((prevState) => ({...prevState, quantity: parseInt(value)}))}
                    >
                        <NumberInputField  border={"2px solid #9F9F9F"} 
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem colStart={4} display={"flex"} alignItems={"center"}>
                    <ButtonGroup gap={0} >
                        <IconButton
                            border={"1px solid #9F9F9F"}
                            variant={"outline"}
                            size={"sm"}
                            color={"gray"}
                            aria-label="Delete item"
                            icon={<MdCancel />}
                            onClick={() => setEditState(false)}
                        />
                        <IconButton 
                            border={"1px solid #9F9F9F"}
                            variant={"outline"}
                            size={"sm"}
                            color={"green"}
                            aria-label="Add item"
                            icon={<MdCheckCircle />}
                            onClick={() => dispatch({type: "add", payload: partTemplate})}
                        />
                    </ButtonGroup>
                </GridItem>
            </>
        )
    }
}

export default PurchaseOrderPartsRequestList