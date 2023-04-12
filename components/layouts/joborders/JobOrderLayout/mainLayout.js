import React from 'react'
import { 
    Flex, 
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
    Grid,
    GridItem,
    Stack,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react'
import { MdInput, MdOutlineCancel, MdCheckCircleOutline } from 'react-icons/md'
import { 
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteList,
    AutoCompleteItem
} from "@choc-ui/chakra-autocomplete";
import { joPartStatusIndicator } from '@/components/statusIndicators';
import { AddButton, RequestReviewButton } from '@/components/buttons';
import { jobOrderAPI } from '@/lib/routes';

function JobOrderMainLayout({user, initialData, categoryList, setFormState, setSubmitArray}) {
    const [showSaveReturn, setShowSaveReturn] = React.useState(false)
    const [detailTemplate, setDetailTemplate] = React.useState({
        itemBrandID: {
            name: ""
        },
        partNumber: "",
        quantity: 0,
    })
    const [returnTemplate, setReturnTemplate] = React.useState({
        _id: "",
        itemID: "",
        itemNumber: "",
        itemName: "",
        itemModel: "",
        detailID: "",
        brand: "",
        partNumber: "",
        returnQty: 0,
        requestQty: 0,
    })
    const [editState, switchState] = React.useReducer((state, action) => {
        switch(action.type) {
            case "handover": {
                return {
                    index: action.payload.index,
                    info: action.payload.item,
                    options: categoryList.itemDetails.filter(option => {
                        return option.itemID.itemNumber == action.payload.item.itemID.itemNumber
                    }),
                    mode: "handover"
                }
            }
            case "return": {
                return {
                    mode: "return"
                }
            }
            default: {
                return {
                    index: -1,
                    mode: "none"
                }
            }
        }
    })
    const [partsList, plDispatch] = React.useReducer((state, action) => {
        switch(action.type) {
            case "initialize": // Get item data from context
                return action.payload
            case "specify details": {
                return state.map((row, i) => i == action.payload.index ? {...row, 
                    detailID: {
                        partNumber: action.payload.detail.partNumber,
                        itemBrandID: {
                            name: action.payload.detail.itemBrandID.name
                        }
                    },
                    receivedQty: action.payload.detail.quantity
                } : row)
            }
        }
    })
    const [returnList, rlDispatch] = React.useReducer((state, action) => {
        switch(action.type) {
            case "initialize": // Get item data from context
                return action.payload
            case "add": {
                return [...state, action.payload]
            }
            case "delete": {
                return state.filter((item, index) => index != action.payload)
            }
            case "edit": {
                return state.map((row, i) => row._id == action.payload._id ? {...row, returnQty: row.returnQty + action.payload.returnQty} : row)
            }
        }
    })

    // Initialize data
    React.useEffect(() => {
        if (initialData != null) {
            
            switchState({type: "default"})
            plDispatch({type: "initialize", payload: initialData.partsList})
            if (initialData.partsList != null) {
                rlDispatch({type: "initialize", payload: initialData.partsList.filter(item => {return item.returnQty == item.receivedQty})})
                console.log(initialData.partsList.filter(item => {return item.returnQty == item.receivedQty}))

            }

        }
    }, [initialData])

    React.useEffect(() => {
        if (editState != null) {
            setFormState(editState.mode)
        }
    }, [editState])

    React.useEffect(() => {
        switchState("reset")
        clearDetailTemplate()
        setSubmitArray((prevState) => ({
            ...prevState,
            partsList: partsList
        }))
    }, [partsList])

    React.useEffect(() => {
        if (returnList != null) {
            setShowSaveReturn(returnList.filter(item => item.partNumber != null && item.brand != null).length > 0)
        }
    }, [returnList])

    function handleDetailSelect(row, value) {
        let select = value.split("/")
        let detail = categoryList.itemDetails.find(option => option.partNumber == select[1] && option.itemBrandID.name == select[0])
        setDetailTemplate((prevState) => ({
            ...prevState,
            itemBrandID: {
                name: detail.itemBrandID.name
            },
            partNumber: detail.partNumber,
        }))
    }

    function clearDetailTemplate() {
        setDetailTemplate({
            itemBrandID: {
                name: ""
            },
            partNumber: "",
            quantity: 0,
        })
    }

    function clearReturnTemplate() {
        switchState({type: "reset"})
        setReturnTemplate({
            _id: "",
            itemID: "",
            itemNumber: "",
            itemName: "",
            itemModel: "",
            detailID: "",
            brand: "",
            partNumber: "",
            requestQty: 0,
            returnQty: 0
        })
    }

    
    function handleReturnSelect(item) {
        setReturnTemplate({
            _id: item._id,
            itemID: item.itemID._id,
            itemNumber: item.itemID.itemNumber,
            itemName: item.itemID.itemName,
            itemModel: item.itemID.itemModel,
            detailID: item.detailID._id,
            brand: item.detailID.itemBrandID.name,
            partNumber: item.detailID.partNumber,
            requestQty: item.requestQty,
            new: true,
        })
    }
    

    function handleSaveReturn() {
        if (returnList.findIndex(item => returnTemplate._id == item._id) == -1)
            rlDispatch({type: "add", payload: returnTemplate})
        else rlDispatch({type: "edit", payload: returnTemplate})
        clearReturnTemplate()
        setShowSaveReturn(true)
    }

    function handleReturnDelete(index) {
        rlDispatch({type: "delete", payload: index})
        clearReturnTemplate()
    }

    async function submitReturnForm() {
        await fetch(jobOrderAPI.receive_items, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(returnList),
        }).then(result => result.json())
        .then(data => {
            console.log(data)
            if (data.error != null) 
                console.log(data.error)
            // location.reload()
        })
    } 

    return (
    <Flex flexDirection={"column"} p={3} gap={5}>
        {/* Job Description */}
        <Card variant={"outline"}>
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Job Description</Text>
            </CardHeader>
            <CardBody>
                <Stack>
                    { initialData.details != null ? (
                        initialData.details.map((detail, index) => {
                            return (
                                <Text key={index}>{detail.jobID.name}</Text>
                            )
                        })
                    ) : (<></>)}
                </Stack>
            </CardBody>
        </Card>

        {/* Parts List */}
        <Card variant={"outline"}>
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Parts List</Text>
            </CardHeader>
            <CardBody px={0}>
                <Grid
                    templateColumns={"1fr 2fr 3fr 2fr 3fr 2fr 2fr 2fr 2fr"}
                    autoFlow={"row"}
                    gap={5}
                >
                        {/* DETAILS HEADERS */}
                        <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                        <GridItem colStart={2}><Text fontWeight={"medium"}>Item Number</Text></GridItem>
                        <GridItem colStart={3}><Text fontWeight={"medium"}>Item</Text></GridItem>
                        <GridItem colStart={4}><Text fontWeight={"medium"}>Status</Text></GridItem>
                        <GridItem colStart={5}><Text fontWeight={"medium"}>Part Number</Text></GridItem>
                        <GridItem colStart={6}><Text fontWeight={"medium"}>Brand</Text></GridItem>
                        <GridItem colStart={7}><Text fontWeight={"medium"}>Requested Quantity</Text></GridItem>
                        <GridItem colStart={8}><Text fontWeight={"medium"}>Received Quantity</Text></GridItem>
                        <GridItem colSpan={9} mb={"5px"}><hr /></GridItem>
                        
                        { partsList != null ? (
                            partsList.map((row, index) => {
                                if (editState.mode == "handover" && editState.index == index) {
                                    return (
                                        <>
                                            <GridItem colStart={1} key={index} m={"auto"}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
                                            <GridItem colStart={2} my={"auto"}><Text>{row.itemID.itemNumber}</Text></GridItem>
                                            <GridItem colStart={3} my={"auto"}><Text>{row.itemID.itemName + " " + row.itemID.itemModel}</Text></GridItem>
                                            <GridItem colStart={4} my={"auto"}><Text>{joPartStatusIndicator(row.requestQty, row.receivedQty)}</Text></GridItem>
                                            <GridItem colStart={5} colSpan={2} pr={5}>
                                                <AutoComplete 
                                                    openOnFocus
                                                    focusInputOnSelect={false}
                                                    suggestWhenEmpty
                                                    restoreOnBlurIfEmpty={false} 
                                                    mx={2} 
                                                    onChange={(value) => handleDetailSelect(row, value)}
                                                >
                                                    <AutoCompleteInput variant="outline" border={"2px solid gray"} />
                                                    <AutoCompleteList>
                                                        {editState.options.map((option) => {
                                                            if (option.quantity != 0) {
                                                                return (
                                                                    <AutoCompleteItem
                                                                        key={option._id}
                                                                        value={option.itemBrandID.name + "/" + option.partNumber}
                                                                    >
                                                                        <Flex w={"100%"} justifyContent={"space-between"} alignItems={"center"}>   
                                                                            <Flex flexDirection={"column"}>
                                                                                <Text fontWeight={"bold"}>{option.partNumber}</Text>
                                                                                <Text fontSize={"sm"}>{option.itemBrandID.name}</Text>
                                                                            </Flex>
                                                                            <Flex alignItems={"baseline"} gap={1}>
                                                                                <Text fontWeight={"bold"} fontSize={"lg"}>{option.quantity}</Text>
                                                                                <Text fontSize={"sm"} color={"gray"}>{row.itemID.unitID.abbreviation}</Text>
                                                                            </Flex>
                                                                        </Flex>

                                                                    </AutoCompleteItem>
                                                                )
                                                            }
                                                        })}
                                                    </AutoCompleteList>
                                                </AutoComplete>
                                            </GridItem>
                                            <GridItem colStart={7} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.requestQty}</Text></GridItem>

                                            <GridItem colStart={8}>
                                                <NumberInput 
                                                    min={row.receivedQty} precision={0} 
                                                    value={detailTemplate.quantity} 
                                                    onChange={(value) => setDetailTemplate((prevState) => ({
                                                        ...prevState,
                                                        quantity: parseInt(value)
                                                    }))}
                                                >
                                                    <NumberInputField border={"2px solid gray"} />
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </GridItem>
                                            <GridItem colStart={9}>
                                                <IconButton 
                                                    variant='outline'
                                                    size={"sm"}
                                                    colorScheme='gray'
                                                    aria-label='Cancel Handover'
                                                    icon={<MdOutlineCancel />}
                                                    onClick={() => switchState({type: "reset"})}
                                                    mr={1}
                                                />
                                                <IconButton 
                                                    variant='outline'
                                                    size={"sm"}
                                                    colorScheme='gray'
                                                    aria-label='Save Handover Details'
                                                    icon={<MdCheckCircleOutline />}
                                                    onClick={() => plDispatch({type: "specify details", payload: {
                                                        index: index,
                                                        detail: detailTemplate
                                                    }})}
                                                />
                                            </GridItem>
                                        </>
                                    )

                                } 
                                else {
                                    return (
                                        <>
                                            <GridItem colStart={1} m={"auto"} key={index}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
                                            <GridItem colStart={2} my={"auto"}><Text>{row.itemID.itemNumber}</Text></GridItem>
                                            <GridItem colStart={3} my={"auto"}><Text>{row.itemID.itemName + " " + row.itemID.itemModel}</Text></GridItem>
                                            <GridItem colStart={4} my={"auto"}><Text>{joPartStatusIndicator(row.requestQty, row.receivedQty)}</Text></GridItem>
                                            <GridItem colStart={5} my={"auto"}><Text>{row.detailID != null ? (row.detailID.partNumber) : (<></>)}</Text></GridItem>
                                            <GridItem colStart={6} my={"auto"}><Text>{row.detailID != null ? (row.detailID.itemBrandID.name) : (<></>)}</Text></GridItem>
                                            <GridItem colStart={7} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.requestQty}</Text></GridItem>
                                            <GridItem colStart={8} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.receivedQty}</Text></GridItem>
                                            <GridItem colStart={9} my={"auto"}>
                                                {   
                                                    user.role == "Inventory" 
                                                    && initialData.jobOrder.statusID != null ? (
                                                        initialData.jobOrder.statusID.name == "Pending Parts"  ? (
                                                            <IconButton 
                                                                variant='outline'
                                                                size={"sm"}
                                                                colorScheme='gray'
                                                                aria-label='Specify details'
                                                                icon={<MdInput />}
                                                                onClick={() => switchState({type: "handover", payload: {
                                                                    index: index,
                                                                    item: row,
                                                                }})}
                                                            />
                                                        ) : (<></>)

                                                    ) : (<></>)
                                                    
                                                    
                                                }
    
                                            </GridItem>
                                        </>
                                    )
                                }
                            })
                        ) : (<></>)
                        }
                </Grid>
            </CardBody>
        </Card>

        {/* Return List */}
        <Card variant={"outline"}>
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={2} display={"flex"} justifyContent={"space-between"}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Return List</Text>
                {
                    showSaveReturn ? (
                        <RequestReviewButton title={"Save Return"} clickFunction={() => submitReturnForm()}/>

                    ) : (<></>)
                }
            </CardHeader>
            <CardBody px={0}>
                <Grid
                    templateColumns={"0.5fr 2.5fr 3fr 2fr 2fr 2fr 1fr"}
                    autoFlow={"row"}
                    gap={2}
                >
                        {/* DETAILS HEADERS */}
                        <GridItem colStart={1} ><Text>{" "}</Text></GridItem>
                        <GridItem colStart={2}><Text fontWeight={"medium"}>Item Number</Text></GridItem>
                        <GridItem colStart={3}><Text fontWeight={"medium"}>Item</Text></GridItem>
                        {/* <GridItem colStart={4}><Text fontWeight={"medium"}>Status</Text></GridItem> */}
                        <GridItem colStart={4}><Text fontWeight={"medium"}>Part Number</Text></GridItem>
                        <GridItem colStart={5}><Text fontWeight={"medium"}>Brand</Text></GridItem>
                        <GridItem colStart={6}><Text fontWeight={"medium"}>Return Quantity</Text></GridItem>
                        <GridItem colSpan={7} mb={"1em"}><hr /></GridItem>

                        { returnList != null ? (
                            <>
                                { returnList.map((row, index) => {
                                if (row.returnQty > 0)
                                    return (
                                        <>
                                            <GridItem colStart={1} mx={"auto"} key={index}><Text fontWeight={"bold"}>{index + 1}</Text></GridItem>
                                            <GridItem colStart={2} >
                                                <Text>
                                                    {row.itemID.itemNumber != null ? (row.itemID.itemNumber) : (row.itemNumber)}
                                                </Text>
                                            </GridItem>
                                            <GridItem colStart={3}>
                                                <Text>
                                                    {row.itemID.itemName != null 
                                                        ? (row.itemID.itemName + " " + row.itemID.itemModel) 
                                                        : (row.itemName + " " + row.itemModel)
                                                    }
                                                </Text>
                                            </GridItem>
                                            <GridItem colStart={4}>
                                                <Text>
                                                    {row.detailID.partNumber != null ? (row.detailID.partNumber) : (<></>)}
                                                    {row.partNumber != null ? (row.partNumber) : (<></>)}
                                                </Text>
                                            </GridItem>
                                            <GridItem colStart={5}>
                                                <Text>
                                                    {row.detailID.itemBrandID != null ? (row.detailID.itemBrandID.name) : (<></>)}
                                                    {row.brand != null ? (row.brand) : (<></>)}

                                                </Text>
                                            </GridItem>
                                            <GridItem colStart={6}><Text fontSize={"lg"} fontWeight={"bold"}>{row.returnQty}</Text></GridItem>
                                            <GridItem colStart={7}>
                                                {
                                                    row.brand && row.partNumber != null ? (
                                                        <IconButton 
                                                        variant='outline'
                                                        size={"sm"}
                                                        colorScheme='gray'
                                                        aria-label='Cancel Handover'
                                                        icon={<MdOutlineCancel />}
                                                        onClick={() => handleReturnDelete(index)}
                                                        mr={1}
                                                    />
                                                    ) : (
                                                        <></>
                                                    )
                                                }

                                            </GridItem>
                                        </>  
                                    )}
                                )}
                                {showReturnInput()}
                            </>
                            ) : (<></>)
                        }
                </Grid>
            </CardBody>
        </Card>
    </Flex>
  )

  function showReturnInput() {
    if (editState.mode == "return" && user.role == "Inventory") {
        return (
            <>
                <GridItem colStart={2} pr={2}>
                    <AutoComplete 
                        openOnFocus
                        focusInputOnSelect={false}
                        suggestWhenEmpty
                        restoreOnBlurIfEmpty={false} 
                        mx={2} 
                        onChange={(value, item) => handleReturnSelect(item.originalValue)}   
                    >
                        <AutoCompleteInput variant="outline" border={"2px solid gray"} />
                        <AutoCompleteList>
                            {
                                initialData.partsList.filter((item, index) => { 
                                    if (returnList.length > 0)
                                        return returnList[index].returnQty == 0
                                    else    
                                        return item
                                    }
                                ).map((option) => {
                                    return (
                                        <AutoCompleteItem
                                            key={option}
                                            label={option.itemID.itemNumber}
                                            value={option}
                                        >
                                            
                                            <Flex w={"100%"} flexDirection={"column"}>
                                                <Text fontWeight={"bold"}>{option.itemID.itemNumber}</Text>
                                                <Flex>
                                                    <Text fontSize={"sm"}>{option.itemID.itemName} {option.itemID.itemModel}</Text>
                                                </Flex>   
                                            </Flex>

                                        </AutoCompleteItem>
                                    )
                                })
                            } 
                        </AutoCompleteList>
                    </AutoComplete>  
                </GridItem>
                <GridItem colStart={3} display={"flex"} alignItems={"center"} gap={2}>
                    <Text>{returnTemplate.itemName}</Text>
                    <Text>{returnTemplate.itemModel}</Text>
                </GridItem>
                <GridItem colStart={4} display={"flex"} alignItems={"center"} gap={2}>
                    <Text>{returnTemplate.partNumber}</Text>
                </GridItem>
                <GridItem colStart={5} display={"flex"} alignItems={"center"} gap={2}>
                    <Text>{returnTemplate.brand}</Text>
                </GridItem>
                <GridItem colStart={6}>
                    <NumberInput 
                        min={0} 
                        max={returnTemplate.requestQty}
                        precision={0} 
                        value={returnTemplate.returnQty} 
                        onChange={(value) => setReturnTemplate((prevState) => ({
                            ...prevState,
                            returnQty: parseInt(value)
                        }))}
                    >
                        <NumberInputField border={"2px solid gray"} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem colStart={7} m={"auto"}>
                    <IconButton 
                        variant='outline'
                        size={"sm"}
                        colorScheme='gray'
                        aria-label='Save Return Details'
                        icon={<MdOutlineCancel />}
                        onClick={() => clearReturnTemplate()}
                    />
                    <IconButton 
                        variant='outline'
                        size={"sm"}
                        colorScheme='gray'
                        aria-label='Save Return Details'
                        icon={<MdCheckCircleOutline />}
                        onClick={() => handleSaveReturn()}
                    />
                </GridItem>
            </>
        )
    }

    else {
        return (
            <GridItem colStart={2}>
                <AddButton title={"Return Item"} clickFunction={() => switchState({type: "return"})}/>
            </GridItem>
        )
    }
  }
}

export default JobOrderMainLayout