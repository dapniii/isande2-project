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

function JobOrderMainLayout({user, initialData, categoryList}) {
    const [detailTemplate, setDetailTemplate] = React.useState({
        itemBrandID: {
            name: ""
        },
        partNumber: "",
        quantity: 0,
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
            case "specify received qty": {
                return state.map((row, i) => i == action.payload.index ? {...row, 
                    
                } : row)
            }
        }
    })
    React.useEffect(() => {
        console.log(partsList)
    })

    // Initialize data
    React.useEffect(() => {
        if (initialData != null) {
            switchState({type: "default"})
            plDispatch({type: "initialize", payload: initialData.partsList})
        }
    }, [initialData])

    React.useEffect(() => {
        switchState("reset")
    }, [partsList])

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
                        <GridItem colStart={1} ><Text>{" "}</Text></GridItem>
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
                                            <GridItem colStart={5} colSpan={2} pr={5}>
                                                <AutoComplete 
                                                    openOnFocus
                                                    focusInputOnSelect={false}
                                                    suggestWhenEmpty
                                                    restoreOnBlurIfEmpty={false} 
                                                    mx={2} 
                                                    onChange={(value) => handleDetailSelect(row, value)}
                                                >
                                                    <AutoCompleteInput variant="outline" />
                                                    <AutoCompleteList>
                                                        {editState.options.map((option) => (
                                                            <AutoCompleteItem
                                                                key={option._id}
                                                                value={option.itemBrandID.name + "/" + option.partNumber}
                                                            >
                                                                <Flex flexDirection={"column"}>
                                                                    <Text fontWeight={"bold"}>{option.partNumber}</Text>
                                                                    <Text fontSize={"sm"}>{option.itemBrandID.name}</Text>
                                                                </Flex>
                                                            </AutoCompleteItem>
                                                        ))}
                                                    </AutoCompleteList>
                                                </AutoComplete>
                                            </GridItem>
                                            <GridItem colStart={7} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.requestQty}</Text></GridItem>

                                            <GridItem colStart={8}>
                                                <NumberInput 
                                                    min={0} max={row.requestQty} precision={0} 
                                                    value={detailTemplate.quantity} 
                                                    onChange={(value) => setDetailTemplate((prevState) => ({
                                                        ...prevState,
                                                        quantity: value
                                                    }))}
                                                >
                                                    <NumberInputField  />
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
                                            <GridItem colStart={4} my={"auto"}><Text></Text></GridItem>
                                            <GridItem colStart={5} my={"auto"}><Text>{row.detailID != null ? (row.detailID.partNumber) : (<></>)}</Text></GridItem>
                                            <GridItem colStart={6} my={"auto"}><Text>{row.detailID != null ? (row.detailID.itemBrandID.name) : (<></>)}</Text></GridItem>
                                            <GridItem colStart={7} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.requestQty}</Text></GridItem>
                                            <GridItem colStart={8} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.receivedQty}</Text></GridItem>
                                            <GridItem colStart={9} my={"auto"}>
                                                {   
                                                    user.role == "Inventory" ? (
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
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Return List</Text>
            </CardHeader>
            <CardBody px={0}>
                <Grid
                    templateColumns={"0.5fr 2fr 3fr 3fr 2fr 2fr 2fr 1fr"}
                    autoFlow={"row"}
                    gap={2}
                >
                        {/* DETAILS HEADERS */}
                        <GridItem colStart={1} ><Text>{" "}</Text></GridItem>
                        <GridItem colStart={2}><Text fontWeight={"medium"}>Item Number</Text></GridItem>
                        <GridItem colStart={3}><Text fontWeight={"medium"}>Item</Text></GridItem>
                        {/* <GridItem colStart={4}><Text fontWeight={"medium"}>Status</Text></GridItem> */}
                        <GridItem colStart={5}><Text fontWeight={"medium"}>Part Number</Text></GridItem>
                        <GridItem colStart={6}><Text fontWeight={"medium"}>Brand</Text></GridItem>
                        <GridItem colStart={7}><Text fontWeight={"medium"}>Return Quantity</Text></GridItem>
                        <GridItem colSpan={8} mb={"1em"}><hr /></GridItem>

                        { initialData.partsList != null ? (
                            initialData.partsList.map((row, index) => {
                                if (row.returnQty > 0)
                                    return (
                                        <>
                                            <GridItem colStart={1} m={"auto"} key={index}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
                                            <GridItem colStart={2} ><Text>{row.itemID.itemNumber}</Text></GridItem>
                                            <GridItem colStart={3} ><Text>{row.itemID.itemName + " " + row.itemID.itemModel}</Text></GridItem>
                                            {/* <GridItem colStart={4} ><Text></Text></GridItem> */}
                                            <GridItem colStart={5}><Text>{row.detailID != null ? (row.detailID.partNumber) : (<></>)}</Text></GridItem>
                                            <GridItem colStart={6}><Text>{row.detailID != null ? (row.detailID.itemBrandID.name) : (<></>)}</Text></GridItem>
                                            <GridItem colStart={7}><Text fontSize={"lg"} fontWeight={"bold"}>{row.returnQty}</Text></GridItem>
                                        </>  
                                    )
                            })
                        ) : (<></>)
                        }
                </Grid>
            </CardBody>
        </Card>
    </Flex>
  )
}

export default JobOrderMainLayout