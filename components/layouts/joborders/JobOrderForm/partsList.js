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
import { useState, useEffect } from "react";
import { AddButton, CancelButton, SaveButton } from "@/components/buttons";
import { MdOutlineCancel, MdOutlineSave } from "react-icons/md";
import { 
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteList,
    AutoCompleteItem
} from "@choc-ui/chakra-autocomplete";

export default function CreateJobOrderPartsList({
    itemsList,
    jobList, 
    selectedJobs, 
    editsList, // manually added items
    setEditList,
    partsList, // official parts list
    setPartsList
}) {
    
    const [itemTemplate, setItemTemplate] = useState({
        name: "",
        model: "",
        partNumber: "",
    }) 

    function createRow(item, index) {
        return (
            <>
                {/* <GridItem colStart={1} m={"auto"} py={2}><Text fontWeight={"bold"}>{index+1}</Text></GridItem> */}
                <GridItem colStart={2} py={2}><Text>{item.partNum}</Text></GridItem>
                <GridItem colStart={3} py={2}><Text>{item.brand}</Text></GridItem>
                <GridItem colStart={4} py={2}><Text>{item.qty}</Text></GridItem>
                <GridItem colStart={5} py={2}><Text>Php {item.cost.toLocaleString()}</Text></GridItem>
    
            </>
        )
    }

    function rowInput() {
        return (
        <>
            <GridItem colStart={1}><Text>{" "}</Text></GridItem>
            <GridItem colStart={2} colSpan={2}>
                <Flex gap={10}>
                    <Flex w={"50%"}>
                        <AutoComplete openOnFocus>
                            <AutoCompleteInput variant="outline" />
                            <AutoCompleteList >
                                {itemsList.map((item) => (
                                    <AutoCompleteItem
                                        key={item.itemNumber}
                                        value={item.itemNumber}
                                    >
                                        <Text>{item.itemName} {item.itemModel}</Text>
                                    </AutoCompleteItem>
                                ))}
                            </AutoCompleteList>
                        </AutoComplete>
                    </Flex>
                    <Flex gap={5} alignItems={"center"}>
                        <Text fontWeight={"semibold"}>Qty</Text>
                        <NumberInput>
                            <NumberInputField  />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <AddButton title={"Add Item"} />
                    </Flex>
                   
                </Flex>
            </GridItem>
        </>

        )
    }

    return (
        <Card variant={"outline"}>
            <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                <Text fontSize={"xl"} fontWeight={"bold"}>Parts List</Text>
            </CardHeader>
            <CardBody px={0}>
                <Grid 
                    borderRadius={"5px"}
                    templateColumns={"0.3fr 2fr 10fr 2fr"}
                    autoFlow={"row"}
                    gap={2}
                >
                    {/* DETAILS HEADERS */}
                    <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                    <GridItem colStart={2}><Text fontWeight={"medium"}>Item Number</Text></GridItem>
                    <GridItem colStart={3}><Text fontWeight={"medium"}>Item</Text></GridItem>
                    {/* <CategoryListModal modalOpen={brandModalOpen} options={data.brands} title={"Spare Parts Brands"} apiPath={sparePartsAPI.modify_brand}></CategoryListModal> */}
                    <GridItem colStart={4}><Text fontWeight={"medium"}>Quantity</Text></GridItem>
                    <GridItem colSpan={4} mb={"1em"}><hr /></GridItem>

                    {rowInput()}
                </Grid>
            </CardBody>
        </Card>

    )
}