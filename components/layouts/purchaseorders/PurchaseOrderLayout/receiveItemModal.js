import { useState, useEffect, useReducer } from "react";
import { 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, 
    Grid, 
    GridItem,
    Text,
    Flex,
    Stack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    IconButton,
    Checkbox,
    FormControl,
    FormLabel,
    Textarea
} from "@chakra-ui/react";
import { SaveButton } from "@/components/buttons";
import { purchaseOrderAPI } from "@/lib/routes";

export default function PurchaseOrderReceiveModal({modalOpen, data, user}) {
    const { isOpen, onClose } = modalOpen;
    const [isComplete, setIsComplete] = useState(false);
    const [hasIssues, setHasIssues] = useState(false);
    const [issueNote, setIssueNote] = useState("");
    const [template, setTemplate] = useState();

    const [partsList, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "initialize": // Get item data from context
                return data.partsList
            case "edit": { // replace edited item at index and return edited array
                return state.map((row, i) => i === action.payload.index ? action.payload.item : row)
            } 
            case "add": {// add new item at end of array 
                return [...state, action.payload]
            }
            case "delete": // delete item at specified index from array 
                return state.filter((row, i) => {return i != action.payload})
            case "update received qty": { // set disable to true for item at specified index
                return state.map((row, i) => i == action.payload.index ? {...row, receivedQty: action.payload.quantity} : row)
            }

            default: 
                return data.partsList
        }
    })

    useEffect(() => {
        if (partsList == null) {
            dispatch({type: "initialize"})
        }
    }, [data])

    useEffect(() => {
        if (partsList != null) {
            setIsComplete(partsList.every((item) => item.requestedQty <= item.receivedQty))
        }
        console.log(isComplete)
    }, [partsList, template])

    function handleInputChange(value, index) {
        setTemplate(index)
        dispatch({type: "update received qty", payload: {
            index: index,
            quantity: parseInt(value)
        }})
    }

    async function receiveItems() {
        let poData = {
            poID: data._id,
            partsList: partsList,
            receivedBy: user.userID,
            isComplete: isComplete,
            hasIssues: hasIssues,
            issueNote: issueNote,
            date: new Date(),
        }

        await fetch(purchaseOrderAPI.receive_items, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(poData),
        })
        .then(result => result.json())
        .then(data => {
            console.log(data);
            location.reload();
        })
    }

    if (partsList != null)
    return (
        <>
          <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Receive Items</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              </ModalBody>
                <Stack gap={5}>
                    <Grid
                        templateColumns={"1fr 4fr 2fr 2fr 1fr"}
                        autoFlow={"row"}
                        gap={3}
                    >
                        {/* Headers */}
                        <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                        <GridItem colStart={2}><Text>Item</Text></GridItem>
                        <GridItem colStart={3}><Text>Requested Qty</Text></GridItem>
                        <GridItem colStart={4}><Text>Received Qty</Text></GridItem>
                        <GridItem colStart={5}><Text>{" "}</Text></GridItem>
                        <GridItem colSpan={5}><hr /></GridItem>

                        {   partsList != null ? (
                                partsList.map((row, index) => {
                                    return (
                                        <>
                                            <GridItem colStart={1} key={index} m={"auto"}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
                                            <GridItem colStart={2}>
                                                <Flex flexDir={"column"}>
                                                    <Text fontWeight={"bold"}>{row.itemID.itemName + " " + row.itemID.itemModel}</Text>
                                                    <Text fontSize={"sm"}>{row.detailID.itemBrandID.name + " " + row.detailID.partNumber}</Text>
                                                </Flex>
                                                
                                            </GridItem>
                                            <GridItem colStart={3} my={"auto"}><Text fontWeight={"bold"} fontSize={"lg"}>{row.requestedQty}</Text></GridItem>
                                            <GridItem colStart={4}>
                                            <NumberInput  
                                                min={0} 
                                                precision={0}
                                                onChange={(value) => handleInputChange(value, index)}
                                            >
                                                <NumberInputField 
                                                    border={"2px solid #9F9F9F"}
                                                    
                                                />
                                                <NumberInputStepper >
                                                    <NumberIncrementStepper  />
                                                    <NumberDecrementStepper  />
                                                </NumberInputStepper>
                                            </NumberInput>
                                            </GridItem>
                                            <GridItem colStart={5}><Text>{" "}</Text></GridItem>
                                        </>
                                    )
                                })
                        ): (<></>)}
                            
                    </Grid>
                    <Flex px={7} flexDir={"column"} gap={3}>
                        <Checkbox 
                            size={"lg"} 
                            colorScheme={"red"} 
                            onChange={(e) => setHasIssues(e.target.checked)}
                            disabled={isComplete}
                        >
                            Mark as With Issues
                        </Checkbox>
                        {
                            hasIssues ? (
                                <FormControl>
                                    <FormLabel>Note</FormLabel>
                                    <Textarea value={issueNote} onChange={(e) => setIssueNote(e.target.value)}/>
                                </FormControl>
                            ) : (<></>)
                        }

                    </Flex>                    
                </Stack>

                
              <ModalFooter 
                display={"flex"}
                gap={3} 
                
              >
                { isComplete ? (<Text fontSize={"sm"} fontStyle={"italic"} color={"green"}>PO will be marked as Complete</Text>) : (<></>)}
                
                <SaveButton title={"Confirm"} clickFunction={receiveItems}/>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}
