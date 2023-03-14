import { useState, useRef, useEffect } from "react";
import { 
  Image,
  Text, 
  Grid, 
  GridItem,
  ButtonGroup,
  Button, 
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input, 
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import CategoryListModal from "@/components/basicCategoryModal";
import MeasureListModal from "@/components/measureModal";
import { EditItemDetailsTable } from "./itemDetailsTable";
import { uploadImage } from "@/lib/imageHandler";
import { Router, useRouter } from "next/router";
import { sparePartsAPI } from "@/lib/routes";


function EditPartForm({ id, categoryList, submitFunc}) {
    const router = useRouter();

    const [itemNumber, setItemNumber] = useState("")
    const [category, setCategory] = useState("")
    const [name, setName] = useState("");
    const [model, setModel] = useState("");
    const [rp, setRP] = useState(0); // Reorder Point
    const [unit, setUnit] = useState("");
    const [desc, setDesc] = useState(""); // Description
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState("")
    const inputPhoto = useRef(null);
    const [details, setDetails] = useState({
        partNum: "",
        brand: "",
        qty: 0,
        cost: 0,
    });
    const [detailsArray, setDetailsArray] = useState({
        additions: [],
        edits: []
    });
    const [addArray, setAddArray] = useState([]);
    const [editArray, setEditArray] = useState([]);
    const [disabledArray, setDisabledArray] = useState([]);
    const [detailsPageIndex, setDetailsPageIndex] = useState(1);
    const [detailsPageSize, setDetailsPageSize] = useState(5);
    const [detailsTableData, setDetailsTableData] = useState({
        
    });

    const catModalOpen = useDisclosure();
    const unitModalOpen = useDisclosure();
    const brandModalOpen = useDisclosure();
    
    // Fetch user data
    useEffect(() => {
    fetch("/api/spareparts/" + id, {
        method: "GET",
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            setItemNumber(id)
            setCategory(data.categoryID.name)
            setName(data.itemName)
            setModel(data.itemModel)
            setRP(data.reorderPoint)
            setUnit(data.unitID.name)     
            setDesc(data.description)
            setPreview(data.imageID.secure_url)
            setDetailsTableData(data)
        });
    }, [id]);

    // Generate photo preview
    useEffect(() => {
        if (!photo) {
            return
        }
        const objectUrl = URL.createObjectURL(photo)
        setPreview(objectUrl)
        
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [photo])

    // TODO: Convert to UseContext (basta prevent it from re-rendering all the time huhu)
    useEffect(() => {
        submitFunc(passSubmitFunc)
    }, [itemNumber, category, name, model, rp, unit, desc, details, addArray, editArray, disabledArray])

    function passSubmitFunc() {
        return submitForm
    }

    async function submitForm() {
        let uploadConfig = {
            file: inputPhoto.current.files[0],
            params: {
                public_id: itemNumber || nanoid(),
                folder: "parts",
                // type: "private",
            }
        }
        let imageRes = await uploadImage(uploadConfig)
        console.log(uploadConfig)

        let detailsArray = {
            additions: addArray,
            edits: editArray,
        }

        let partsData = {
            itemNumber: itemNumber,
            imageID: imageRes,
            categoryID: category,
            itemName: name,
            itemModel: model,
            reorderPoint: rp,
            unitID: unit,
            description: desc,
            details: detailsArray,
            creatorID: "00002", // CHANGE HARDCODE
        }
        console.log(partsData)
        let result = await fetch(sparePartsAPI.edit_part, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(partsData),
        }).then(result => {
            console.log(result.json())
            clear()
            router.push("/parts")
        })
    }
    


    return (
        <>
        {/* MAIN CONTAINER */}
        <Flex
            flexDirection={"column"}
            alignItems={"center"}
            p={2}
            bg={"#EDEDED"}
        >
        {/* FORM GRID */}
            <Grid
                w={"100%"}
                h={"100%"}
                p={"0.2em"}
                templateColumns={"1fr 1fr"}
                templateRows={"1fr 1fr"}
                gap={3  }
                zIndex={2}
            >
            {/* ITEM IDENTIFICATION */}
                <GridItem
                    colStart={1}
                    rowStart={1}
                    w={"100%"}
                    boxShadow={"lg"}
                    gap={1}
                    bg={"white"}
                >
                <Text p={"0.5em"} pb={0} fontSize={"xl"} fontWeight={"bold"}>Identification</Text>
                <hr />

                {/* Item number and category */}
                <Flex width={"100%"} justifyContent={"space-around"} p={"0.5em"} gap={2}>
                    <FormControl isRequired>
                        <FormLabel>Item Number</FormLabel>
                        <Input
                            name="itemNumber"
                            value={itemNumber}
                            type="text"
                            onChange={(e) => setItemNumber(e.target.value)}
                            disabled
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel onClick={() => catModalOpen.onOpen()}><Link>Category</Link></FormLabel>
                        <CategoryListModal modalOpen={catModalOpen} options={categoryList.categories} title={"Spare Parts Categories"} apiPath={sparePartsAPI.modify_category}></CategoryListModal>
                        <Select
                            placeholder="Select Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categoryList.categories.map((category) => {
                                if (category.disabled == false) {
                                    return (
                                        <option
                                            key={category.pubId}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </option>
                                    );
                                }
                            })}
                        </Select>
                    </FormControl>
                </Flex>

                {/* Item name and model */}
                <Flex width={"100%"} justifyContent={"space-around"} p={"0.5em"} gap={2}>
                    <FormControl isRequired>
                        <FormLabel>Item Name</FormLabel>
                        <Input
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Item Model</FormLabel>
                        <Input 
                            name="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        />
                    </FormControl>
                </Flex>

                {/* Reorder Point & Unit of Measure */}
                <Flex width={"100%"} justifyContent={"space-around"} p={"0.5em"} gap={2}>
                    <FormControl isRequired>
                        <FormLabel>Reorder Point</FormLabel>
                        <NumberInput min={0} max={1000} precision={0} value={rp} onChange={(value) => setRP(parseInt(value))}>
                            <NumberInputField  />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel onClick={() => unitModalOpen.onOpen()}><Link>Unit of Measurement</Link></FormLabel>
                        <MeasureListModal modalOpen={unitModalOpen} options={categoryList.measures} title={"Unit of Measurement"} apiPath={sparePartsAPI.modify_measure}></MeasureListModal>
                        <Select
                            placeholder="Select Unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                        >
                            {categoryList.measures.map((unit) => {
                                if (unit.disabled == false) {
                                    return (
                                        <option
                                            key={unit.pubId}
                                            value={unit.name}
                                        >
                                            {unit.name}
                                        </option>
                                    );
                                }
                            })}
                        </Select>
                    </FormControl>
                </Flex>
                {/* Description  */}
                <FormControl p={"0.5em"}>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    ></Textarea>
                </FormControl>
    
            </GridItem>

            {/* ITEM PHOTO */}
            <GridItem
                colStart={2}
                rowStart={1}
                w={"100%"}
                h={"100%"}
                boxShadow={"lg"}
                bg={"white"}
            >
                <Text m={"0.5em"} mb={0} fontSize={"xl"} fontWeight={"bold"}>Photo</Text>
                <hr />
                {/*PHOTO INPUT*/}
                <Flex
                    mt={"0.5em"}
                    px={"1em"}
                    gap={3}
                >   

                    <Flex flexDirection={"column"}>
                        <Text fontWeight={"bold"}>Preview</Text>
                        <Image 
                            src={preview}
                            alt={"Upload Preview"}
                            objectFit={"cover"}
                            borderRadius={"15"}
                            w={"20em"}
                            h={"20em"}
                        />
                    </Flex>

                    <Button
                        // @ts-ignore
                        mt={"1.5em"}
                        bg={"blue"}
                        color={"white"}
                        leftIcon={<AddIcon />}
                        onClick={() => inputPhoto.current.click()}
                    >
                        Select Image
                    </Button>
                    <Input 
                        type={"file"}
                        display={"none"}
                        onChange={(e) => {setPhoto(e.target.files[0])}}
                        ref={inputPhoto}
                    />
                </Flex>
            </GridItem>

            {/* ITEM DETAILS */}
            <GridItem
                colStart={1}
                colSpan={2}
                rowStart={2}
                w={"100%"}
                h={"100%"}
                boxShadow={"lg"}
                bg={"white"}
            >
                <Text p={"0.7em"} pb={1} fontSize={"xl"} fontWeight={"bold"}>Details</Text>
                <hr />
                
                {/* DETAILS INPUT CONTAINER */}
                <Grid
                    mt={"6px"}
                    w={"100%"}
                    templateColumns={"0.5fr 2fr 2fr 2fr 2fr 1fr"}
                    autoFlow={"row"}
                    gap={2}
                    
                >
                    {/* DETAILS HEADERS */}
                    <GridItem colStart={1}><Text>{" "}</Text></GridItem>
                    <GridItem colStart={2}><Text fontWeight={"medium"}>Part Number</Text></GridItem>
                    <GridItem colStart={3}><Link><Text fontWeight={"medium"} onClick={brandModalOpen.onOpen}>Brand</Text></Link></GridItem>
                    <CategoryListModal modalOpen={brandModalOpen} options={categoryList.brands} title={"Spare Parts Brands"} apiPath={sparePartsAPI.modify_brand}></CategoryListModal>
                    <GridItem colStart={4}><Text fontWeight={"medium"}>Quantity</Text></GridItem>
                    <GridItem colStart={5}><Text fontWeight={"medium"}>Unit Price</Text></GridItem>
                    <GridItem colSpan={6} mb={"1em"}><hr /></GridItem>
                    
                    <EditItemDetailsTable 
                        data={detailsTableData} 
                        brands={categoryList.brands} 
                        addArray={addArray} 
                        setAddArray={setAddArray} 
                        editArray={editArray}
                        setEditArray={setEditArray}
                        disabledArray={disabledArray}
                        setDisabledArray={setDisabledArray}
                    />
                
                </Grid>  {/* Details Table Grid */}
            </GridItem>
            </Grid> {/* Form Grid */}
        </Flex>
    </>
    )

}

export default EditPartForm