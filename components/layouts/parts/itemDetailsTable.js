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
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { AddButton, CancelButton, SaveButton } from "@/components/buttons";
import { MdOutlineCancel, MdOutlineSave } from "react-icons/md";

export function CreateItemDetailsTable({detailsArray, setDetailsArray, brands}) {
    const [details, setDetails] = useState({
        partNum: "",
        brand: "",
        qty: 0,
        cost: 0,
    })
    const [detailsPageIndex, setDetailsPageIndex] = useState(1);
    const [detailsPageSize, setDetailsPageSize] = useState(5);

    function deleteRow(index) {
        setDetailsArray(detailsArray.filter(element => { return detailsArray.indexOf(element) != index}))
    }

    return (
        <>
            { showDetailsTable(detailsArray) ? (
                detailsArray.map((detail, index) => {
                    if (paginationFunc().limitToPageSize(index)) {
                        return (
                            <>
                                <GridItem colStart={1} m={"auto"}>
                                    <Text fontWeight={"semibold"}>{index+1}</Text>
                                </GridItem>
                                <GridItem colStart={2}>
                                    <Text>{detail.partNum}</Text>
                                </GridItem>
                                <GridItem colStart={3}>
                                    <Text>{detail.brand}</Text>
                                </GridItem>
                                <GridItem colStart={4}>
                                    <Text>{detail.qty}</Text>
                                </GridItem>
                                <GridItem colStart={5}>
                                    <Text>{detail.cost}</Text>
                                </GridItem>
                                <GridItem colStart={6}>
                                    <IconButton
                                        variant='outline'
                                        size={"sm"}
                                        colorScheme='gray'
                                        aria-label='Delete Detail Row'
                                        icon={<DeleteIcon />}
                                        onClick={() => deleteRow(index)}
                                    />
                                </GridItem>
                            </>
                        ) 
                    } 
                })
            ) : (<></>)
            }
            {showDetailInput(detailsArray, setDetailsArray, brands, details, setDetails, false)}
        </>
    )

    // PAGINATION FOR DETAILS TABLE
    function showDetailsTable(detailsArray) {
        return JSON.stringify(detailsArray[0]) != "{}" && detailsArray.length != 0;
    }


    function nextButton() {
        return (
            <Button
                color={"gray"}
                onClick={() => paginationFunc().next()}
                disabled={paginationFunc().nextDisabled()}
            >
                {">"}
            </Button>
        );
    }

    function backButton() {
        return (
            <Button
                color={"gray"}
                onClick={() => paginationFunc().back()}
                disabled={paginationFunc().backDisabled()}
            >
                {"<"}
            </Button>
        );
    }

    function paginationFunc() {
        var func = {
            test:
                function() {
                    console.log("Test")
                },
            next:
                function() {
                    setDetailsPageIndex(detailsPageIndex+1);
                },
            back:
                function() {
                    setDetailsPageIndex(detailsPageIndex-1);
                },
            nextDisabled: 
                function() {
                    return detailsArray.length <= detailsPageSize || detailsPageIndex == Math.ceil((detailsArray.length/detailsPageSize));
                },
            backDisabled:
                function() {
                    return detailsPageIndex == 1;
                },
            limitToPageSize:
                function(index) {
                    if (detailsPageSize > 0) {
                        return index < detailsPageIndex*detailsPageSize && index >= (detailsPageIndex*detailsPageSize) - detailsPageSize;
                    }
                    else {
                        // No pagination
                        return true; 
                    } 
                },
            addPage:
                function() {
                    if (detailsArray.length % detailsPageSize == 0 && detailsArray.length > 1) {
                        setDetailsPageIndex(detailsPageIndex+1);
                        }
                },
            removePage:
                function() {
                    if (detailsArray.length == (detailsPageIndex-1) * detailsPageSize + 1) 
                        setDetailsPageIndex(detailsPageIndex-1);
                }
        }

        return func;
    }
}

function showDetailInput(
    detailsArray, // array containing existing data and new inputs
    setDetailsArray,
    brands, // brand options
    details,
    setDetails,
    isAdd,
    setIsAdd
    ) {
    
    // DETAILS CHANGE HANDLERS
    // Add Detail to Array function
    function addDetails() {
        if (JSON.stringify(detailsArray[0]) == "{}") {
            detailsArray.shift();
        }
        setDetailsArray((detailsArray) => [...detailsArray, details]);
        clearDetails(setDetails)
        // paginationFunc().addPage();
    }

    // Clear details function
    function clearDetails() {
        setDetails({
            partNum: "",
            brand: "",
            qty: 0,
            cost: 0,
        });
    }

    // Set Details function
    function handleDetailsChange(e) {
        const { name, value } = e.target;

        setDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // if (name == "brand") {
        // 	setDuplicateError(false);
        // }
    }

    function cancelAdd() {
        setIsAdd(false)
    }

    return (
        <>
            {/* DETAILS INPUT  */}
            {/* <GridItem colStart={1} m={"auto"}>
                <Text fontWeight={"semibold"}>{ JSON.stringify(detailsArray[0]) == "{}" ? (detailsArray.length) : (detailsArray.length + 1) }</Text>
            </GridItem> */}
            <GridItem colStart={2} w={"95%"} >
                <Input 
                    name="partNum"
                    value={details.partNum}    
                    onChange={(e) => handleDetailsChange(e, setDetails)}
                />
            </GridItem>
            <GridItem colStart={3} w={"95%"}>
                <Select
                        placeholder="Select Brand"
                        name="brand"
                        value={details.brand}
                        onChange={(e) => handleDetailsChange(e, setDetails)}
                >
                    {brands.map((brand) => {
                        if (brand.disabled == false) {
                            return (
                                <option
                                    key={brand.name}
                                    value={brand.name}
                                >
                                    {brand.name}
                                </option>
                            );
                        }
                    })}
                </Select>
            </GridItem>
            <GridItem colStart={4} w={"95%"}>
                <NumberInput min={0} max={1000} precision={0} value={details.qty} onChange={(value) => handleDetailsChange({ target: { name: 'qty', value }}, setDetails)}>
                    <NumberInputField  />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </GridItem>
            <GridItem colStart={5} w={"95%"}>
                <NumberInput min={0} precision={2} value={details.cost} onChange={(value) => handleDetailsChange({ target: { name: 'cost', value }}, setDetails)}>
                    <NumberInputField  />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </GridItem>
            <GridItem colStart={6} w={"95%"} pr={"1em"}>
                <ButtonGroup>
                    <AddButton title={"Add Item"} clickFunction={addDetails} />
                    { isAdd ? (<CancelButton title={"Close"} clickFunction={cancelAdd} />) : (<></>)}
                    
                </ButtonGroup>

            </GridItem>
            {
                    !detailsArray ? (
                        <GridItem colSpan={6}>
                        {/* PAGINATION */}
                            <ButtonGroup p={"1em"} width={"100%"} justifyContent={"right"} alignItems={"center"} gap={"0"}>
                                {backButton()}
                                {nextButton()}
                            </ButtonGroup>
                        </GridItem>
                    ) : (<></>) 
            }
        </>
    )
}



