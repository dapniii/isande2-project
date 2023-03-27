import { useState, useEffect } from 'react';
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
import { SaveButton } from '@/components/buttons';
import { EditIcon } from '@chakra-ui/icons';
import { MdOutlineSave } from 'react-icons/md';
import { sparePartsAPI } from '@/lib/routes';
import CategoryListModal from "@/components/basicCategoryModal"


function ItemAdjustmentModal ({modalOpen, data, options}) {
    const { isOpen, onClose } = modalOpen;
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");
    const [editArray, setEditArray] = useState(data.detailsArray);
    const [newQuantity, setNewQuantity] = useState(0)
    const [isEdit, setIsEdit] = useState(-1);

    const reasonModal = useDisclosure();

    // TEMPORARY ONLY
    let userID = "00001"

    useEffect(() => {
        setEditArray(data.detailsArray)
    }, [modalOpen, data, options])

    async function submitForm() {
        let adjustmentData = {
            creatorID: userID,
            itemID: data.itemNumber,
            reasonID: reason,
            comment: comment,
            edits: editArray,
        }

        console.log(adjustmentData)
        
        let result = await fetch(sparePartsAPI.create_adjustment_record, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adjustmentData),
        }).then(result => {
            console.log(result.json())
            customOnClose()
            location.reload()
        })    
    }

    function enableEdit(index, original) {
        setIsEdit(index)
        try { setNewQuantity(editArray[index].newQuantity) } 
        catch { setNewQuantity(original) }
    }

    function saveEdit(index) {
        let temp = editArray
        temp[index]["newQuantity"] = parseInt(newQuantity) 
        setEditArray(temp)
        temp = []
        setNewQuantity(0)
        setIsEdit(-1)
    }

    function customOnClose() {
        let temp = editArray

        temp.forEach(element => {
            delete element.newQuantity
        })
        setEditArray(temp)
        setNewQuantity(0)
        onClose()
    }

    function createDetailRow(index, detail) {
        let rowQty
        try {
            rowQty = editArray[index].newQuantity
        } catch {
            rowQty = 0
        }
       
        return(
            <>
                <GridItem colStart={1} m={"auto"} py={2}><Text fontWeight={"bold"}>{index+1}</Text></GridItem>
                <GridItem colStart={2} py={2}><Text>{detail.partNumber}</Text></GridItem>
                <GridItem colStart={3} py={2}><Text>{detail.itemBrandID.name}</Text></GridItem>
                <GridItem colStart={4} py={2}><Text>Php {parseFloat(detail.unitPrice.$numberDecimal).toLocaleString()}</Text></GridItem>
                <GridItem colStart={5} py={2}><Text fontSize={"lg"} fontWeight={"semibold"}>{detail.quantity}</Text></GridItem>
                <GridItem colStart={6} py={2}>
                    {
                        isEdit == index ? (
                            <Flex alignItems={"center"} gap={1}>
                                <NumberInput min={0} max={1000} precision={0} value={newQuantity} onChange={(value) => setNewQuantity(value)}>
                                    <NumberInputField  />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                <IconButton
                                    variant='outline'
                                    size={"sm"}
                                    mr={3}
                                    colorScheme='gray'
                                    aria-label='Save Edut'
                                    icon={<MdOutlineSave />}
                                    onClick={() => saveEdit(index, detail.quantity)}
                                /> 
                            </Flex>

                        ) : (
                            <Flex alignItems={"center"} justifyContent={"space-evenly"}>

                                { rowQty != null ? (<Text fontSize={"lg"} fontWeight={"semibold"}>{rowQty}</Text>) : (<></>)} 
                                <IconButton
                                    variant='outline'
                                    size={"sm"}
                                    colorScheme='gray'
                                    aria-label='Save Edut'
                                    icon={<EditIcon />}
                                    onClick={() => enableEdit(index)}
                                /> 
                            </Flex>

                        )
                    }

                </GridItem>
            </>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={customOnClose} size={"6xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Adjustment Details</ModalHeader>
                <hr />
                <ModalCloseButton />
                <ModalBody display={"flex"} > 
                    {/* REASON COLUMN */}
                    <Flex w={"35%"} flexDirection={"column"} gap={5}>
                        {/* Reason Input */}
                        <FormControl isRequired>
                            <FormLabel><Link onClick={reasonModal.onOpen}>Reason</Link></FormLabel>
                            <CategoryListModal modalOpen={reasonModal} options={options.reasons} title={"Adjustment Reasons"} apiPath={sparePartsAPI.modify_reason} />
                            <Select value={reason} onChange={(e) => setReason(e.target.value)}>
                                <option key="" value="" hidden disabled>Select Reason</option>
                                {options.reasons.map((reasons) => {
                                    if (reasons.disabled == false) {
                                        return (
                                            <option
                                                key={reasons.name}
                                                value={reasons.name}
                                            >
                                                {reasons.name}
                                            </option>
                                        );
                                    }
                                })}
                            </Select>
                        </FormControl>
                        {/* Comment Input */}
                        <FormControl>
                            <FormLabel>Comment (Optional)</FormLabel>
                            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
                        </FormControl>
                    </Flex>

                    {/* DETAILS COLUMN */}
                    <Flex w={"65%"} p={5}>
                        <Flex w={"100%"} boxShadow={"xl"} borderRadius={"0.5em"}>
                            <Grid
                                mt={"6px"}
                                w={"100%"}
                                templateColumns={"1fr 3fr 2fr 3fr 2fr 3fr"}
                                autoFlow={"row"}
                                gap={2}
                                pb={3}
                            >
                                {/* DETAILS HEADERS */}
                                <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                                <GridItem colStart={2}><Text fontWeight={"medium"}>Part Number</Text></GridItem>
                                <GridItem colStart={3}><Text fontWeight={"medium"}>Brand</Text></GridItem>
                                <GridItem colStart={4}><Text fontWeight={"medium"}>Unit Price</Text></GridItem>
                                <GridItem colStart={5}><Text fontWeight={"medium"}>Old Quantity</Text></GridItem>
                                <GridItem colStart={6}><Text fontWeight={"medium"}>New Quantity</Text></GridItem>
                                <GridItem colSpan={6}><hr /></GridItem>
                                {
                                    data.detailsArray.map((detail, index) => {
                                        return (<>{createDetailRow(index, detail)}</>)
                                        
                                    })
                                }
                                <GridItem colStart={4} textAlign={"right"} my={"auto"} pr={"7"}>
                                    <Text fontWeight={"bold"}>Current Total</Text>
                                </GridItem>
                                <GridItem colStart={5} display={"flex"} gap={1}     >
                                    <Text fontSize={"xl"} fontWeight={"bold"}>{data.quantity}</Text>
                                    <Text fontSize={"sm"} color={"gray"} alignSelf={"end"} mb={"3px"}>{data.unit}</Text>
                                </GridItem>
        
                            </Grid>
                        </Flex>
                    </Flex>
                </ModalBody>

                <ModalFooter mr={"1em"}>
                    <SaveButton title={"Save Changes"} clickFunction={submitForm} />
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ItemAdjustmentModal