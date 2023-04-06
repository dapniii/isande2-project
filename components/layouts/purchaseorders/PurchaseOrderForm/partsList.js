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

export default function PurchaseOrderPartsList({options}) {
    const [editState, setEditState] = useState(false)
    const [partTemplate, setPartTemplate] = useState({
        itemID: "",
        itemNumber: "",
        itemName: "",
        itemModel: "",
        partNumber: "",
        brand: "",
        unitCost: 0.00,
        quantity: 0,
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
            clearTemplate()
        }
    }, [partsList])
    

    function clearTemplate() {
        setPartTemplate({
            itemNumber: "",
            itemName: "",
            itemModel: "",
            partNumber: "",
            brand: "",
            unitCost: 0.00,
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
                    templateColumns={"1fr 3fr 2fr 2fr 2fr 2fr 2fr 2fr"}
                    autoFlow={"row"}
                    gap={3}
                >
                    {/* Headers */}
                    <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                    <GridItem colStart={2}><Text>Item</Text></GridItem>
                    <GridItem colStart={3}><Text>Part Number</Text></GridItem>
                    <GridItem colStart={4}><Text>Brand</Text></GridItem>
                    <GridItem colStart={5}><Text>Unit Cost</Text></GridItem>
                    <GridItem colStart={6}><Text>Quantity</Text></GridItem>
                    <GridItem colStart={7}><Text>Subtotal</Text></GridItem>
                    <GridItem colStart={8}><Text>{" "}</Text></GridItem>
                    <GridItem colSpan={8}><hr /></GridItem>

                    {
                        partsList != null ? (
                            partsList.map((row, index) => {
                                return (
                                    <>
                                        {/* Sample */}
                                        <GridItem colStart={1} m={"auto"}><Text fontWeight={"semibold"}>{index + 1}</Text></GridItem>
                                        <GridItem colStart={2} my={"auto"}><Text>{row.itemName + " " + row.itemModel}</Text></GridItem>
                                        <GridItem colStart={3} my={"auto"}><Text>{row.partNumber}</Text></GridItem>
                                        <GridItem colStart={4} my={"auto"}><Text>{row.brand}</Text></GridItem>
                                        <GridItem colStart={5} my={"auto"}><Text>PHP {row.unitCost.toFixed(2)}</Text></GridItem>
                                        <GridItem colStart={6} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.quantity}</Text></GridItem>
                                        <GridItem colStart={7} my={"auto"}><Text>PHP {(row.unitCost * row.quantity).toFixed(2)}</Text></GridItem>
                                        <GridItem colStart={8}>
                                            <IconButton
                                                variant={"outline"}
                                                border={"1px solid white"}
                                                color={"red"}
                                                aria-label="Delete item"
                                                icon={<MdCancel />}
                                                onClick={() => dispatch({type: "delete", payload: index})}
                                            />
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

    function createRow(item, index) {
        
    }

    function handleItemSelect(value) {
        let item = options.partsList.find(option => option.itemNumber == value)
        setPartTemplate((prevState) => ({
            itemID: item._id,
            itemNumber: item.itemNumber,
            itemName: item.itemName,
            itemModel: item.itemModel,
            partNumber: "",
            brand: "",
        }));
    }

    function handleDetailSelect(value) {
        let select = value.split("/")

        setPartTemplate((prevState) => ({
            ...prevState,
            partNumber: select[0],
            brand: select[1]
        }))
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
                <GridItem colStart={3} colSpan={2}>
                    <AutoComplete 
                        openOnFocus
                        focusInputOnSelect={false}
                        suggestWhenEmpty
                        restoreOnBlurIfEmpty={false} 
                        mx={2} 
                        onChange={(value) => handleDetailSelect(value)} 
                    >
                        <AutoCompleteInput 
                            border={"2px solid #9F9F9F"} 
                            variant="outline" 
                            value={partTemplate.partNumber}
                        />
                        <AutoCompleteList>
                            { partTemplate.itemNumber != "" ? (
                                options.partsList.find(option => option.itemNumber == partTemplate.itemNumber).details.map((item) => (
                                    <AutoCompleteItem
                                        key={item._id}
                                        value={item.partNumber + "/" + item.itemBrandID.name}
                                    >
                                        <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                                            <Flex flexDirection={"column"}>
                                                <Text fontWeight={"bold"}>{item.itemBrandID.name}</Text>
                                                <Text fontSize={"sm"}>{item.partNumber}</Text>
                                            </Flex>
                                            <Flex>
                                            <Text fontSize={"lg"} fontWeight={"bold"}>{item.quantity}</Text>
                                        </Flex>
                                        </Flex>
                                    </AutoCompleteItem>
                                ))
                            ) : (<></>) }

                        </AutoCompleteList>
                    </AutoComplete>
                </GridItem>
                <GridItem colStart={5}>
                    <NumberInput  
                        min={0} max={1000} 
                        precision={2}
                        value={partTemplate.unitCost} o
                        onChange={(value) => setPartTemplate((prevState) => ({...prevState, unitCost: parseFloat(value)}))} 
                    >
                        <NumberInputField  border={"2px solid #9F9F9F"} />
                        <NumberInputStepper >
                            <NumberIncrementStepper  />
                            <NumberDecrementStepper  />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem colStart={6}>
                    {
                        partTemplate.partNumber != "" ? (
                            <NumberInput 
                            min={0} 
                            max={
                                options
                                .partsList.find(option => option.itemNumber == partTemplate.itemNumber)
                                .details.find(detail => detail.partNumber == partTemplate.partNumber)
                                .quantity
                            } 
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
                        ) : (<></>)
                    }

                </GridItem>
                <GridItem colStart={8} display={"flex"} alignItems={"center"}>
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
