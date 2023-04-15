import { useState, useEffect, useContext, useReducer, useCallback } from "react";
import { 
    GridItem, 
    Text,
    ButtonGroup,
    IconButton,
    Input,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { AddButton } from "@/components/buttons";
import { MdOutlineCancel, MdAddCircleOutline } from "react-icons/md";
import { EditPartContext } from "@/components/layouts/parts/context";


function EditDetailsTable({brands, setSubmitArray}) {
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
            case "initialize": // Get item data from context
                return action.payload
            case "edit": { // replace edited item at index and return edited array
                return state.map((row, i) => i === action.payload.index ? action.payload.item : row)
            } 
            case "add": // add new item at end of array
                return [...state, action.payload]
            case "delete": // delete item at specified index from array 
                return state.filter((row, i) => {return i != action.payload})
            case "disable": { // set disable to true for item at specified index
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

    // Configure data template whenever editState is changed
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

    /*
        When the editArray has been updated,
            - reset data template and edit state
            - pass the data to parent component (editPartForm)
    */    
    useEffect(() => {
        clearTemplate()
        switchState("reset")
        setSubmitArray(editArray)
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

    // Loading state (wait to initialize data from context)
    if (initialData == null) 
        return (<></>)
    else if (initialData != null && editArray != null)
        return (
            <>
                {   // Show only non-disabled items
                    editArray.filter(row => {return row.disabled != true}).map((item, index) => {
                        // Show editable row
                        if (index == editState.index){
                            return (<>{showInputTable()}</>)
                        }
                        // Normal table
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
                                    {/* Set edit state to edit */}
                                    <IconButton
                                        variant='outline'
                                        size={"sm"}
                                        colorScheme='gray'
                                        aria-label='Enable Edit Row'
                                        icon={<EditIcon />}
                                        onClick={() => switchState({type: "edit", payload: {index: index, item: item}})}
                                    /> 
                                    {
                                        // Only allow disabling if quantity is zero for existing records
                                        // If it is a new row, then it is possible to delete
                                        item.quantity == 0 || item._id == null ? (
                                            <IconButton
                                            variant='outline'
                                            size={"sm"}
                                            colorScheme='gray'
                                            aria-label='Delete Row'
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
                {   // Setting editState to adding will show a blank editable row
                    editState.mode == "isAdd" ? (<>{showInputTable()}</>) : (
                        <GridItem colStart={2}>
                            <AddButton title={"Add Row"} clickFunction={() => switchState({type: "add"})} />
                        </GridItem>)
                }
            </>
        )

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
            </>
        )
    }
}

export default EditDetailsTable