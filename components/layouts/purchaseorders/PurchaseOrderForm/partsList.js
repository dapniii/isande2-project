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
} from "@chakra-ui/react"
import { 
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteList,
    AutoCompleteItem
} from "@choc-ui/chakra-autocomplete";
import { AddButton } from "@/components/buttons";
import { MdCancel } from "react-icons/md";

export default function PurchaseOrderPartsList() {
    return (
        <Card variant={"outline"} >
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Parts List</Text>
            </CardHeader>
            <CardBody px={0}>
                <Grid
                    templateColumns={"1fr 3fr 2fr 2fr 2fr 2fr 2fr 1fr"}
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

                    {/* Sample */}
                    <GridItem colStart={1} m={"auto"}><Text fontWeight={"semibold"}>1</Text></GridItem>
                    <GridItem colStart={2} my={"auto"}><Text>Item Name Item Model</Text></GridItem>
                    <GridItem colStart={3} my={"auto"}><Text>Part Number</Text></GridItem>
                    <GridItem colStart={4} my={"auto"}><Text>Brand</Text></GridItem>
                    <GridItem colStart={5} my={"auto"}><Text>PHP 100.00</Text></GridItem>
                    <GridItem colStart={6} my={"auto"}><Text fontSize={"lg"} fontWeight={"bold"}>5</Text></GridItem>
                    <GridItem colStart={7} my={"auto"}><Text>PHP 500.00</Text></GridItem>
                    <GridItem colStart={8}>
                        <IconButton
                            variant={"outline"}
                            border={"1px solid white"}
                            color={"red"}
                            aria-label="Delete item"
                            icon={<MdCancel />}
                        />
                    </GridItem>

                    
                </Grid>
            </CardBody>
        </Card>
    )

    function createRow(item, index) {
        
    }

    function rowInput() {
        return (
            <>
            </>
        )
    }
}
