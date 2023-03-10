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
import { CheckCircleIcon, CloseIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import CategoryListModal from "@/components/basicCategoryModal";
import { uploadImage } from "@/lib/imageHandler";
import { customAlphabet } from "nanoid";
import alphanumeric from "nanoid-dictionary/numbers";
import { Router, useRouter } from "next/router";
import { sparePartsAPI } from "@/lib/routes";

export default function CreatePartForm({data, submitFunc}) {
    const nanoid = customAlphabet(alphanumeric, 10); // id generator
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
    const [detailsArray, setDetailsArray] = useState([{}]);
    const [detailsPageIndex, setDetailsPageIndex] = useState(1);
    const [detailsPageSize, setDetailsPageSize] = useState(5);

    const catModalOpen = useDisclosure();
    const unitModalOpen = useDisclosure();
    const brandModalOpen = useDisclosure();
    const currencyModalOpen = useDisclosure();


    function passSubmitFunc() {
        return submitForm
    }

    // TODO: Convert to UseContext (basta prevent it from re-rendering all the time huhu)
    useEffect(() => {
        submitFunc(passSubmitFunc)
    }, [itemNumber, category, name, model, rp, unit, desc, details, detailsArray])

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

    // Add Detail to Array function
    function addDetails() {
        if (JSON.stringify(detailsArray[0]) == "{}") {
            detailsArray.shift();
        }
        setDetailsArray((detailsArray) => [...detailsArray, details]);
        clearDetails()
        paginationFunc().addPage();
    }

    // Clear details function
    function clearDetails() {
        setDetails({
            partNum: "",
            brand: "",
            qty: 0,
            priceUnit: "",
            cost: 0,
        });
    }

    function clear() {
        setItemNumber("")
        setCategory("")
        setName("")
        setRP(0)
        setModel("")
        setUnit("")
        setDesc("")
        setPhoto()
        setPreview("")
        clearDetails()
        setDetailsArray([{}])
        inputPhoto.current.value = null
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
        let result = await fetch(sparePartsAPI.create_part, {
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
                          />
                      </FormControl>
                      <FormControl isRequired>
                          <FormLabel onClick={() => catModalOpen.onOpen()}><Link>Category</Link></FormLabel>
                          <CategoryListModal modalOpen={catModalOpen} options={data.categories} title={"Spare Parts Categories"}></CategoryListModal>
                          <Select
                              placeholder="Select Category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                          >
                              {data.categories.map((category) => {
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
                          {/* <MeasureListModal modalOpen={unitModalOpen} options={MEASURE_DATA} title={"Unit of Measurement"}></MeasureListModal> */}
                          <Select
                              placeholder="Select Unit"
                              value={unit}
                              onChange={(e) => setUnit(e.target.value)}
                          >
                              {data.measures.map((unit) => {
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
                      { photo != null ? (
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
                      ) : (<></>)}
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
                      <GridItem colStart={3}><Text fontWeight={"medium"}>Brand</Text></GridItem>
                      <GridItem colStart={4}><Text fontWeight={"medium"}>Quantity</Text></GridItem>
                      <GridItem colStart={5}><Text fontWeight={"medium"}>Unit Price</Text></GridItem>
                      <GridItem colSpan={6} mb={"1em"}><hr /></GridItem>
                      
                      { showDetailsTable() ? (
                          <>
                              {
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
                                                          onClick={() => deleteRow(detail)}
                                                      />
                                                  </GridItem>
                                              </>
                                          ) 
                                     } 
                                  })
                              }
                          </>
                      ) : (<></>)
                      }
                      {/* DETAILS INPUT  */}
                      <GridItem colStart={1} m={"auto"}>
                          <Text fontWeight={"semibold"}>{ JSON.stringify(detailsArray[0]) == "{}" ? (detailsArray.length) : (detailsArray.length + 1) }</Text>
                      </GridItem>
                      <GridItem colStart={2} w={"95%"} >
                          <Input 
                              name="partNum"
                              value={details.partNum}    
                              onChange={(e) => handleDetailsChange(e)}
                          />
                      </GridItem>
                      <GridItem colStart={3} w={"95%"}>
                          {/* <Input 
                              name="brand"
                              value={details.brand}    
                              onChange={(e) => handleDetailsChange(e)}
                          /> */}
                        <Select
                              placeholder="Select Brand"
                              name="brand"
                              value={details.brand}
                              onChange={(e) => handleDetailsChange(e)}
                        >
                            {data.brands.map((brand) => {
                                if (brand.disabled == false) {
                                    return (
                                        <option
                                            key={brand.pubId}
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
                          <Button leftIcon={<AddIcon bg="white" color={"green.300"} borderRadius={100} p="3px" />} bg={"green.300"} color={"white"} onClick={() => addDetails()}>
                                  Add Item
                          </Button>
                      </GridItem>
                      {
                          showDetailsTable() ? (
                              <GridItem colSpan={6}>
                              {/* PAGINATION */}
                                  <ButtonGroup p={"1em"} width={"100%"} justifyContent={"right"} alignItems={"center"} gap={"0"}>
                                      {/* <Text>
                                      {pageIndex + 1} of {pageOptions.length}
                                      </Text> */}
                                      {backButton()}
                                      {nextButton()}
                                  </ButtonGroup>
                              </GridItem>
                          ) : (<></>)
                      }  
                  </Grid>  {/* Details Table Grid */}
              </GridItem>
            </Grid> {/* Form Grid */}
          </Flex>
      </>
    )
  
    // PAGINATION FOR DETAILS TABLE
    function showDetailsTable() {
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
