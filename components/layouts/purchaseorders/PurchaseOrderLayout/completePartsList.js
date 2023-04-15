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

function PurchaseOrderCompletePartsList({partsList}) {
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
                    <GridItem colStart={6}><Text>Requested</Text></GridItem>
                    <GridItem colStart={7}><Text>Received</Text></GridItem>
                    <GridItem colStart={8}><Text>Subtotal</Text></GridItem>
                    <GridItem colSpan={8}><hr /></GridItem>

                    {
                        partsList != null ? (
                            partsList.map((row, index) => {
                                return (
                                    <>
                                        {/* Sample */}
                                        <GridItem colStart={1} m={"auto"}><Text fontWeight={"semibold"}>{index + 1}</Text></GridItem>
                                        <GridItem colStart={2} my={"auto"}><Text>{row.itemID.itemName + " " + row.itemID.itemModel}</Text></GridItem>
                                        <GridItem colStart={3} my={"auto"}><Text>{row.detailID != null ? (<Text>{row.detailID.partNumber}</Text>) : (<></>)}</Text></GridItem>
                                        <GridItem colStart={4} my={"auto"}><Text>{row.detailID != null ? (<Text>{row.detailID.itemBrandID.name}</Text>) : (<></>)}</Text></GridItem>
                                        <GridItem colStart={5} my={"auto"}><Text>PHP {row.detailID != null ? (parseFloat(row.unitCost.$numberDecimal).toFixed(2)) : (<></>)}</Text></GridItem>
                                        <GridItem colStart={6} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.requestedQty}</Text></GridItem>
                                        <GridItem colStart={7} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>{row.receivedQty}</Text></GridItem>
                                        <GridItem colStart={8} my={"auto"}><Text>PHP {row.detailID != null ? ((parseFloat(row.unitCost.$numberDecimal) * row.requestedQty).toFixed(2)) : (<></>)}</Text></GridItem>
                                        {/* <GridItem colStart={8}>
                                            <IconButton
                                                variant={"outline"}
                                                border={"1px solid white"}
                                                color={"red"}
                                                aria-label="Delete item"
                                                icon={<MdCancel />}
                                                onClick={() => dispatch({type: "delete", payload: index})}
                                            />
                                        </GridItem> */}
                                    </>
                                )
                            })
                        ) : (<></>)
                    }
                </Grid>
            </CardBody>
        </Card>
    )
}

export default PurchaseOrderCompletePartsList