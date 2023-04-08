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
    AutoCompleteItem,
    AutoCompleteCreatable
} from "@choc-ui/chakra-autocomplete";
import { MdCancel, MdCheckCircle, MdEdit } from "react-icons/md";
import { EditIcon } from "@chakra-ui/icons";

export default function PurchaseOrderDetailedPartsList({user, initialData, options, setSubmitArray}) {
    const [editState, setEditState] = useState(false);
    const [isCreatable, setIsCreatable] = useState(true)
    const [partTemplate, setPartTemplate] = useState({
        index: -1,
        detailID: "",
        partNumber: "",
        brand: "",
        unitCost: 0.00,
        quantity: 0,
    })
    
    const [partsList, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "initialize": // Get item data from context
                return initialData.partsList
            case "edit": { // replace edited item at index and return edited array
                return state.map((row, i) => i === action.payload.index ? {
                    ...row,
                    detailID: action.payload.detailID,
                    partNumber: action.payload.partNumber,
                    brand: action.payload.brand,
                    unitCost: action.payload.unitCost,
                } : row)
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
            setSubmitArray(partsList)
        }
    }, [partsList])
    

    function clearTemplate() {
        setPartTemplate({
            index: -1,
            detailID: "",
            partNumber: "",
            brand: "",
            unitCost: 0.00,
        })
    }

    function handleOnChange(index, item, field) {
        if (item.creatable) {
            setPartTemplate((prevState) => ({
                ...prevState,
                index: index,
                detailID: "",
                [field]: item.value
            }))
        }
        else {
            setPartTemplate((prevState) => ({
                ...prevState,
                index: index,
                detailID: item.originalValue._id,
                partNumber: item.originalValue.partNumber,
                brand: item.originalValue.itemBrandID.name,
                unitCost: item.originalValue.unitPrice.$numberDecimal,
            }))
        }
    }

    function handleAutoSelect(index, value, params) {
        if (!params.isNewInput) {
            setPartTemplate({
                index: index,
                detailID: value._id,
                partNumber: value.partNumber,
                brand: value.itemBrandID.name,
                unitCost: value.unitPrice.$numberDecimal,
            })
            setIsCreatable(false)
        }
    }

    function handleInputChange(index, value, field) {
        setPartTemplate((prevState) => ({
            ...prevState,
            index: index,
            detailID: "",
            [field]: value
        }))
    }

    function handleEditClick(row, index) {
        dispatch({type: "edit", payload: {
            index: index,
            detailID: null,
            partNumber: "",
            brand: "",
            unitCost: 0.00,
        }})
    }

    return (
        <Card variant={"outline"} >
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Parts List</Text>
            </CardHeader>
            <CardBody px={0}>
                <Grid
                    templateColumns={
                        initialData.statusID.name == "Approved" 
                        ? ("1fr 3fr 2fr 2fr 1.5fr 2fr 1fr") 
                        : ("0.7fr 7fr 2fr 1fr")
                    }
                    autoFlow={"row"}
                    gap={3}
                >
                    {/* Headers */}
                    {
                        initialData.statusID.name == "Approved" 
                        ? (
                        <>
                            <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                            <GridItem colStart={2}><Text fontWeight={"semibold"}>Item</Text></GridItem>
                            <GridItem colStart={3}><Text fontWeight={"semibold"}>Part Number</Text></GridItem>
                            <GridItem colStart={4}><Text fontWeight={"semibold"}>Brand</Text></GridItem>
                            <GridItem colStart={5}><Text fontWeight={"semibold"}>Unit Cost</Text></GridItem>
                            <GridItem colStart={6}><Text fontWeight={"semibold"}>Requested Qty</Text></GridItem>
                            <GridItem colStart={7}><Text fontWeight={"semibold"}></Text></GridItem>
                            <GridItem colSpan={7}><hr /></GridItem>
                        </>) 
                        : (
                        <>
                            <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                            <GridItem colStart={2}><Text>Item</Text></GridItem>
                            <GridItem colStart={3}><Text>Requested Qty</Text></GridItem>
                            <GridItem colStart={4}><Text>{" "}</Text></GridItem>
                            <GridItem colSpan={4}><hr /></GridItem>
                        </>
                        )
                    }


                    {
                        partsList != null ? (
                            partsList.map((row, index) => {
                                if (initialData.statusID.name == "Approved") {
                                    return (
                                        <>
                                            {/* Sample */}
                                            <GridItem colStart={1} m={"auto"}><Text fontWeight={"semibold"}>{index + 1}</Text></GridItem>
                                            <GridItem colStart={2} my={"auto"}><Text>{row.itemID.itemName + " " + row.itemID.itemModel}</Text></GridItem>
                                            {
                                                row.detailID != null ? (
                                                    <>
                                                        <GridItem colStart={3} my={"auto"}>
                                                            {row.detailID.partNumber != null ? (<Text>{row.detailID.partNumber}</Text>) : (<></>)}
                                                            {row.partNumber != null ? (<Text>{row.partNumber}</Text>) : (<></>)}
                                                        </GridItem>
                                                        <GridItem colStart={4} my={"auto"}>
                                                            {row.detailID.itemBrandID != null ? (<Text>{row.detailID.itemBrandID.name}</Text>) : (<></>)}
                                                            {row.brand != null ? (<Text>{row.brand}</Text>) : (<></>)}
                                                        </GridItem>
                                                        <GridItem colStart={5} my={"auto"}>
                                                            {row.unitCost != null ? (<Text>{row.unitCost}</Text>) : (<></>)}
                                                        </GridItem>
                                                        <GridItem colStart={6} display={"flex"} justifyContent={"end"} alignItems={"center"} pr={"25%"}>
                                                            <Flex gap={1} alignItems={"baseline"}>
                                                                <Text fontWeight={"bold"} fontSize={"2xl"}>{row.requestedQty}</Text>
                                                                <Text color={"gray"}>pcs</Text>
                                                            </Flex>
                                                        </GridItem>
                                                        <GridItem colStart={7}>
                                                            
                                                            <IconButton
                                                                variant={"outline"}
                                                                color={"gray"}
                                                                aria-label="Delete item"
                                                                icon={<EditIcon />}
                                                                onClick={() => handleEditClick(row, index)}
                                                            />
                                                        </GridItem>
                                                    </>
                                                ) : ( rowInput(row, index) )
    
                                            }
                                            
                                        </>
                                    )
                                }

                                else {
                                    return (
                                        <>
                                            {/* Sample */}
                                            <GridItem colStart={1} m={"auto"}><Text fontWeight={"semibold"}>{index + 1}</Text></GridItem>
                                            <GridItem colStart={2} my={"auto"}><Text>{row.itemID.itemName + " " + row.itemID.itemModel}</Text></GridItem>
                                            <GridItem colStart={3} display={"flex"} justifyContent={"end"} alignItems={"center"} pr={"35%"}>
                                                <Flex gap={1} alignItems={"baseline"}>
                                                    <Text fontWeight={"bold"} fontSize={"xl"}>{row.requestedQty}</Text>
                                                    <Text color={"gray"}>pcs</Text>
                                                </Flex>
                                            </GridItem>
    
                                            {/* <GridItem colStart={4}>
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
    
                                            </GridItem> */}
                                        </>
                                    )
                                }
                                
                            })
                        ) : (<></>)
                    }
                    { user.role == "Purchasing" && initialData.statusID.name == "Approved" ? (
                        editState ? (rowInput()) : (<></>)
                    ) : (<></>)}

                </Grid>
            </CardBody>
        </Card>
    )

    function rowInput(row, index) {
        return (
            <>
                <GridItem colStart={3}>
                    <AutoComplete 
                        openOnFocus
                        focusInputOnSelect={false}
                        suggestWhenEmpty
                        restoreOnBlurIfEmpty={false} 
                        creatable={isCreatable}
                        mx={2}
                        value={partTemplate.index == index ? (partTemplate.partNumber) : ("")} 
                        onChange={(value, item) => handleOnChange(index, item, "partNumber")}
                        onOptionFocus={(params) => {
                            if (params.item == null) {
                                setIsCreatable(true)
                            }
                        }}
                        onSelectOption={(params) => {handleAutoSelect(index, params.item.originalValue, params)}}
                    >
                        <AutoCompleteInput 
                            border={"2px solid #9F9F9F"} 
                            variant="outline"
                            value={partTemplate.index == index ? (partTemplate.partNumber) : ("")} 
                            onChange={(e) => handleInputChange(index, e.target.value, "partNumber")} 
                        />
                        <AutoCompleteList>
                        {
                            options.partsList.find(option => option.itemNumber == row.itemID.itemNumber).details.map((item) => (
                                <AutoCompleteItem
                                    key={item._id}
                                    label={item.partNumber}
                                    value={item}
                                >
                                    <Text fontSize={"sm"}>{item.partNumber}</Text>
                                </AutoCompleteItem>
                            ))
                        }
                        {
                            isCreatable ? (
                                <AutoCompleteCreatable>
                                {({ value }) => <Text fontSize={"sm"}>Add {value}</Text>}
                                </AutoCompleteCreatable>
                            ) : (<></>)
                        }
                        </AutoCompleteList>
                    </AutoComplete>
                </GridItem>
                <GridItem colStart={4}>
                    <AutoComplete 
                        openOnFocus
                        focusInputOnSelect={false}
                        suggestWhenEmpty
                        restoreOnBlurIfEmpty={false} 
                        creatable={isCreatable}
                        mx={2}
                        value={partTemplate.index == index ? (partTemplate.brand) : ("")} 
                        onChange={(value, item) => handleOnChange(index, item, "brand")}
                        onOptionFocus={(params) => {                                                 
                            if (params.item == null) {
                                setIsCreatable(true)
                            }
                        }}
                        onSelectOption={(params) => {handleAutoSelect(index, params.item.originalValue, params)}}
                    >
                        <AutoCompleteInput 
                            border={"2px solid #9F9F9F"} 
                            variant="outline"
                            value={partTemplate.index == index ? (partTemplate.brand) : ("")} 
                            onChange={(e) => handleInputChange(index, e.target.value, "brand")} 
                        />
                        <AutoCompleteList>
                        {
                            options.partsList.find(option => option.itemNumber == row.itemID.itemNumber).details.map((item) => (
                                <AutoCompleteItem
                                    key={item._id}
                                    label={item.itemBrandID.name}
                                    value={item}
                                >
                                    <Text>{item.itemBrandID.name}</Text>
                                </AutoCompleteItem>
                            ))
                        }
                        {
                            isCreatable ? (
                                <AutoCompleteCreatable>
                                {({ value }) => <Text fontSize={"sm"}>Add {value}</Text>}
                                </AutoCompleteCreatable>
                            ) : (<></>)
                        }

                        </AutoCompleteList>
                    </AutoComplete>
                </GridItem>
                <GridItem colStart={5}>
                    <NumberInput  
                        min={0} 
                        max={1000} 
                        precision={2}
                        step={0.1}
                        value={partTemplate.index == index ? (partTemplate.unitCost) : ("")} 
                        onChange={(value) => handleInputChange(index, parseFloat(value), "unitCost")} 
                    >
                        <NumberInputField 
                            border={"2px solid #9F9F9F"} 
                            inputMode={"text"}
                            type={"text"}
                        />
                        <NumberInputStepper >
                            <NumberIncrementStepper  />
                            <NumberDecrementStepper  />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem colStart={6} display={"flex"} justifyContent={"end"} alignItems={"center"} pr={"25%"}>
                    <Flex gap={1} alignItems={"baseline"}>
                        <Text fontWeight={"bold"} fontSize={"2xl"}>{row.requestedQty}</Text>
                        <Text color={"gray"}>pcs</Text>
                    </Flex>
                </GridItem>
                <GridItem colStart={7}>
                    <IconButton
                        variant={"outline"}
                        color={"gray"}
                        aria-label="Delete item"
                        icon={<MdCheckCircle />}
                        onClick={() => dispatch({type: "edit", payload: partTemplate})}
                    />
                </GridItem>
            </>
        )
    }
}
