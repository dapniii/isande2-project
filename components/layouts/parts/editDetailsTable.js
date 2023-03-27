import { useState, useEffect, useContext, useReducer, useCallback } from "react";
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
import { AddButton, CancelButton, SaveButton } from "@/components/buttons";
import { MdOutlineCancel, MdAddCircleOutline } from "react-icons/md";
import { EditPartContext } from "@/pages/parts/context";


function EditDetailsTable({brands}) {
    const initialData = useContext(EditPartContext)
    const [template, setTemplate] = useState({
        partNumber: "",
        itemBrandID: "",
        quantity: 0,
        unitPrice: 0.00,
        disabled: false,
    })
    const defaultState = {
        index: -1,
    }
    const [editState, switchState] = useReducer((state, action) => {
        switch(action.type) {
            case "add": 
                return {
                    defaultState,
                    mode: "isAdd"
                }
            case "edit": {
                console.log(action.payload.index)
                return {
                    index: action.payload.index,
                    info: action.payload.item,
                    mode: "isEdit",
                }
            }
            case "reset":
                return {
                    index:-1
                }
            default:
                return defaultState
        }
    })
    const [editArray, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "initialize": 
                return action.payload
            case "edit": {
                return state.map((row, i) => i === action.payload.index ? action.payload.item : row)
            } 
            case "add":
                return [...state, action.payload]
            case "delete":
                return state.filter((row, i) => {return i != action.payload})
            case "disable": {
                return state.map((row, i) => i == action.payload ? {...row, disabled: true} : row)
            }

            default: 
                return state
        }
    })

    // Initialize data
    useEffect(() => {
        if (initialData != null) {
            switchState({type: "default"})
            dispatch({type: "initialize", payload: initialData.details})
        }
    }, [initialData])

    // Fill template with details when an item to edit has been selected 
    useEffect(() => {
        try {
            if (editState.mode == "isEdit") {
                setTemplate({
                    _id: editState.info._id ? (editState.info._id) : (null),
                    partNumber: editState.info.partNumber,
                    itemBrandID: editState.info.itemBrandID.name ? (
                        editState.info.itemBrandID.name
                    ) : (editState.info.itemBrandID),
                    quantity: editState.info.quantity,
                    unitPrice: editState.info.unitPrice.$numberDecimal ? (
                        editState.info.unitPrice.$numberDecimal
                    ) : (editState.info.unitPrice),
                    disabled: false,
                })
            }

            if (editState.mode == "isAdd")
                clearTemplate()
        } catch {}
    }, [editState])

    // Clear template whenever an edit has been made
    useEffect(() => {
        clearTemplate()
        switchState("reset")
        console.log(editArray)
    }, [editArray])


    function clearTemplate() {
        setTemplate({
            partNumber: "",
            itemBrandID: "",
            quantity: 0,
            unitPrice: 0.00,
            disabled: false,
        })
    }
     
    // Set Details function
    function handleDetailsChange(e) {
        const { name, value } = e.target;

        setTemplate((prevState) => ({
            ...prevState,
            [name]: value,
        }));

    }

    if (initialData == null) 
        return (<></>)
    else if (initialData != null && editArray != null)
        return (
            <>
                {
                    editArray.filter(row => {return row.disabled != true}).map((item, index) => {
                        if (index == editState.index){
                            return (<>{showInputTable()}</>)
                        }
                        else 
                            return (
                                <>
                                    <GridItem colStart={1} m={"auto"}>
                                        <Text>{index+1}</Text>
                                    </GridItem>
                                    <GridItem colStart={2}>
                                        <Text>{item.partNumber}</Text>
                                    </GridItem>
                                    <GridItem colStart={3}>
                                        {item.itemBrandID.name ? (<Text>{item.itemBrandID.name}</Text>) : (<Text>{item.itemBrandID}</Text>)}
                                    </GridItem>
                                    <GridItem colStart={4}>
                                        <Text >{item.quantity}</Text>
                                    </GridItem>
                                    <GridItem colStart={5}>
                                        {item.unitPrice.$numberDecimal ? (<Text>PHP {item.unitPrice.$numberDecimal}</Text>) : (<Text>PHP {item.unitPrice}</Text>)}
                                    </GridItem>
                                    <GridItem>
                                    <IconButton
                                        variant='outline'
                                        size={"sm"}
                                        colorScheme='gray'
                                        aria-label='Enable Edit Row'
                                        icon={<EditIcon />}
                                        onClick={() => switchState({type: "edit", payload: {index: index, item: item}})}
                                    /> 
                                    {
                                        item.quantity == 0 || item._id == null ? (
                                            <IconButton
                                            variant='outline'
                                            size={"sm"}
                                            colorScheme='gray'
                                            aria-label='Delete Detail Row'
                                            icon={<DeleteIcon />}
                                            onClick={() => dispatch({type: item._id  ? ("disable") : ("delete"), payload: index})}
                                            /> 
                                        ) : (<></>)
                                    }

                                    </GridItem>

                                </>    
                            )
                    })
                }
                {
                    editState.mode == "isAdd" ? (<>{showInputTable()}</>) : (
                        <GridItem colStart={2}>
                            <AddButton title={"Add Row"} clickFunction={() => switchState({type: "add"})} />
                        </GridItem>)
                }
            </>
        )

    // Set Details function
    function handleDetailsChange(e) {
        const { name, value } = e.target;

        setTemplate((prevState) => ({
            ...prevState,
            [name]: value,
        }));

    }

    function showInputTable() {
        return (
            <>
                {/* DETAILS INPUT  */}

                <GridItem colStart={2} w={"95%"} >
                    <Input 
                        name="partNumber"
                        value={template.partNumber}    
                        onChange={(e) => handleDetailsChange(e)}
                    />
                </GridItem>
                <GridItem colStart={3} w={"95%"}>
                    <Select
                            placeholder="Select Brand"
                            name="itemBrandID"
                            value={template.itemBrandID}
                            onChange={(e) => handleDetailsChange(e)}
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
                    <NumberInput min={0} max={1000} precision={0} value={template.quantity} onChange={(value) => handleDetailsChange({ target: { name: 'quantity', value }})}>
                        <NumberInputField  />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem colStart={5} w={"95%"}>
                    <NumberInput min={0} precision={2} value={template.unitPrice} onChange={(value) => handleDetailsChange({ target: { name: 'unitPrice', value }})}>
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
                            aria-label='Save Add'
                            icon={<MdAddCircleOutline />}
                            onClick={() => dispatch(
                                editState.mode == "isAdd" 
                                ? ({type: "add", payload: template})
                                : ({type: "edit", payload: {index: editState.index, item: template}})
                                )}
                        /> 
                        <IconButton
                            variant='outline'
                            size={"sm"}
                            colorScheme='gray'
                            aria-label='Cancel Add'
                            icon={<MdOutlineCancel />}
                            onClick={() => switchState({type: "reset"})}
                        /> 
                    </ButtonGroup>
    
                </GridItem>
                {
                        !editArray ? (
                            <GridItem colSpan={6}>
                            {/* PAGINATION */}
                                <ButtonGroup p={"1em"} width={"100%"} justifyContent={"right"} alignItems={"center"} gap={"0"}>
                                    {/* {backButton()}
                                    {nextButton()} */}
                                </ButtonGroup>
                            </GridItem>
                        ) : (<></>) 
                }
            </>
        )
    }
}

export default EditDetailsTable