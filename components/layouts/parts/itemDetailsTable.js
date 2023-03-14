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
    Icon, 
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { AddButton, CancelButton, SaveButton } from "@/components/buttons";
import { MdOutlineCancel, MdOutlineSave } from "react-icons/md";

function convertDetails(detail) {
    return {
        partNum: detail.partNumber,
        brand: detail.itemBrandID.name,
        qty: detail.quantity,
        cost: parseFloat(detail.unitPrice.$numberDecimal)
    }
}

function convertedData(data) {
    return {
        ...data,
        detailsArray: data.details,
        unit: data.unitID.name,
    }
}

function createDetailRow(index, detail) {
    let value;
    
    try {
        value = convertDetails(detail);
    } catch (e) {
        value = detail;
    }
    
    return (
        <>
            {/* <GridItem colStart={1} m={"auto"} py={2}><Text fontWeight={"bold"}>{index+1}</Text></GridItem> */}
            <GridItem colStart={2} py={2}><Text>{value.partNum}</Text></GridItem>
            <GridItem colStart={3} py={2}><Text>{value.brand}</Text></GridItem>
            <GridItem colStart={4} py={2}><Text>{value.qty}</Text></GridItem>
            <GridItem colStart={5} py={2}><Text>Php {value.cost.toLocaleString()}</Text></GridItem>

        </>
    )
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

function editableRow (    
    editArray, 
    setEditArray,
    brands, // brand options
    rowIndex,
    details,
    setDetails,
    isEdit,
    setIsEdit) {

    // DETAILS CHANGE HANDLERS
    const original = details;

    function saveEdit() {
        let tempArr = editArray;
        tempArr[rowIndex] = details
        setEditArray(tempArr)
        tempArr = []
        clearDetails()
        setIsEdit(-1)
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
    
    return (
        <>
            {/* DETAILS INPUT  */}
            {/* <GridItem colStart={1} m={"auto"}>
                <Text fontWeight={"semibold"}>{rowIndex + 1}</Text>
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
                <NumberInput min={0} max={1000} precision={0} value={details.qty} onChange={(value) => handleDetailsChange({ target: { name: 'qty', value }})}>
                    <NumberInputField  />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </GridItem>
            <GridItem colStart={5} w={"95%"}>
                <NumberInput min={0} precision={2} value={details.cost} onChange={(value) => handleDetailsChange({ target: { name: 'cost', value }})}>
                    <NumberInputField  />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </GridItem>
            <GridItem colStart={6} w={"95%"} pr={"1em"}>
                <ButtonGroup>
                    <IconButton
                        variant='outline'
                        size={"sm"}
                        colorScheme='gray'
                        aria-label='Cancel Edit'
                        icon={<MdOutlineCancel />}
                        onClick={() => setIsEdit(-1)}
                    /> 
                    <IconButton
                        variant='outline'
                        size={"sm"}
                        colorScheme='gray'
                        aria-label='Save Edut'
                        icon={<MdOutlineSave />}
                        onClick={() => saveEdit()}
                    /> 
                </ButtonGroup>
                {/* <ButtonGroup>
                    
                    <SaveButton title={"Save Edit"} clickFunction={saveEdit} />
                    <CancelButton title={"Close Edit"} clickFunction={() => setIsEdit(-1)} />
                </ButtonGroup> */}

            </GridItem> 

        </>
    )
}

// {
//     !editArray ? (
//         <GridItem colSpan={6}>
//         {/* PAGINATION */}
//             <ButtonGroup p={"1em"} width={"100%"} justifyContent={"right"} alignItems={"center"} gap={"0"}>
//                 {backButton()}
//                 {nextButton()}
//             </ButtonGroup>
//         </GridItem>
//     ) : (<></>) 
// }

export function EditItemDetailsTable({
    data,
    brands, 
    addArray, 
    setAddArray, 
    editArray,
    setEditArray,
    disabledArray,
    setDisabledArray,
    }) {

    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(-1)
    const [details, setDetails] = useState({
        index: 0,
        partNum: "",
        brand: "",
        qty: 0,
        cost: 0,
    })
    const [viewEditArray, setViewEditArray] = useState([])

    let value;

    try { 
        value = convertedData(data)
        setEditArray(value.detailsArray)
    }
    catch { value = data }

    function enableAdd() {
        setIsAdd(true)
        setIsEdit(-1)
    }

    function enableEdit(detail, index) {
        setIsEdit(index)
        setIsAdd(false)

        try {
            setDetails({
                partNum: convertDetails(detail).partNum,
                brand: convertDetails(detail).brand,
                qty: convertDetails(detail).qty,
                cost: convertDetails(detail).cost,
            })
        } catch {
            setDetails(detail)
        }
    }

    function deleteEditRow(detail, index) {
        let temp = disabledArray
        detail.disabled = true
        temp.push(detail)
        setEditArray(editArray.filter(element => { return addArray.indexOf(element) != index}))
        setDisabledArray(temp)
        temp = []
    }

    function deleteAddRow(detail, index) {
        setAddArray(addArray.filter(element => { return addArray.indexOf(element) != index}))
    }

    return (
        <>
            {
                editArray.filter(element => {return element.disabled != true}).map((detail, index) => {
                    if (index != isEdit) 
                        return (
                            <>
                                {createDetailRow(index, detail, true)}
                                <GridItem colStart={6}>
                                    <ButtonGroup>
                                        <IconButton
                                            variant='outline'
                                            size={"sm"}
                                            colorScheme='gray'
                                            aria-label='Delete Detail Row'
                                            icon={<DeleteIcon />}
                                            onClick={() => deleteEditRow(detail, index)}
                                        /> 
                                        <IconButton
                                            variant='outline'
                                            size={"sm"}
                                            colorScheme='gray'
                                            aria-label='Enable Edit Row'
                                            icon={<EditIcon />}
                                            onClick={() => enableEdit(detail, index)}
                                        /> 
                                    </ButtonGroup>

                                </GridItem>
                            </>
                        )
                    else if (index == isEdit)
                        return (<>{editableRow(editArray, setEditArray, brands, index, details, setDetails, isEdit, setIsEdit)}</>)
                    else return(<></>)
                    
                })
                
            }

            {
                addArray.map((detail, index) => {
                    if (index != isEdit && detail.disabled != true) 
                        return (
                            <>
                                {createDetailRow(index, detail, true)}
                                <GridItem colStart={6}>
                                    <ButtonGroup>
                                        <IconButton
                                            variant='outline'
                                            size={"sm"}
                                            colorScheme='gray'
                                            aria-label='Delete Detail Row'
                                            icon={<DeleteIcon />}
                                            onClick={() => deleteAddRow(detail, index)}
                                        /> 
                                        <IconButton
                                            variant='outline'
                                            size={"sm"}
                                            colorScheme='gray'
                                            aria-label='Enable Edit Row'
                                            icon={<EditIcon />}
                                            onClick={() => enableEdit(detail, index)}
                                        /> 
                                    </ButtonGroup>

                                </GridItem>
                            </>
                        )
                    else if (index == isEdit && detail.disabled != true)
                        return (<>{editableRow(addArray, setAddArray, brands, index, details, setDetails, isEdit, setIsEdit)}</>)
                    else return(<></>)
                    
                })
                
            }
            
            { !isAdd  ? (
                <>
                    {/* <GridItem colStart={4} textAlign={"right"} my={"auto"} pr={"7"}>
                        <Text fontWeight={"bold"}>Total</Text>
                    </GridItem> 
                    <GridItem colStart={5} display={"flex"} gap={1}     >
                        <Text fontSize={"xl"} fontWeight={"bold"}>{quantity}</Text>
                        <Text fontSize={"sm"} color={"gray"} alignSelf={"end"} mb={"3px"}>{value.unit}</Text>
                    </GridItem> */}
                    <GridItem colStart={2}>
                        <AddButton title={"Add Row"} clickFunction={enableAdd} />
                    </GridItem>
                </>
                ) : (
                    <>{showDetailInput(addArray, setAddArray, brands, details, setDetails, isAdd, setIsAdd)}</>
                )}

            
        </>
    )
}

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




