import { useState, useEffect, useRef, useMemo } from "react";
import {
    Image,
    Text, 
    Grid, 
    GridItem,
    Flex,
    Stack,
    Card, 
    CardBody, 
    CardHeader,
    CardFooter,
    Button, 
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input, 
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Link,
    Divider,
    useDisclosure,
} from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
  } from "@choc-ui/chakra-autocomplete";
import { AddIcon } from "@chakra-ui/icons";
import CategoryListModal from "@/components/basicCategoryModal";
import { uploadImage } from "@/lib/imageHandler";
import { vehicleAPI } from "@/lib/routes";
import { Router, useRouter } from "next/router";

function CreateVehicleForm({data, submitFunc}) {




    const [photo, setPhoto] = useState();
    const [preview, setPreview] = useState("")
    const inputPhoto = useRef(null);

    const deptModalOpen = useDisclosure();
    const roleModalOpen = useDisclosure();
    const userModalOpen = useDisclosure();
    const specialModalOpen = useDisclosure();

    


    // TODO: Convert to UseContext (basta prevent it from re-rendering all the time huhu)
    useEffect(() => {
        submitFunc(passSubmitFunc)
        console.log(data)
    }, [photo])

    function passSubmitFunc() {
        return submitForm
    }

    function clear() {

        setPhoto()
        setPreview("")
        inputPhoto.current.value = null
    }

    async function submitForm() {
        // let uploadConfig = {
        //     file: inputPhoto.current.files[0],
        //     params: {
        //         public_id: plateNum,
        //         folder: "vehicles",
        //         // type: "private",
        //     }
        // }
        // let imageRes = await uploadImage(uploadConfig)
        // console.log(imageRes)
        // let vehicleData = {
        //     imageID: imageRes,
        //     creatorID: "00002", // CHANGE HARDCODE
        // }
        // console.log(vehicleData)
        // let result = await fetch(vehicleAPI.create_vehicle, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify(vehicleData),
        // }).then(result => {
        //     console.log(result.json())
        //     clear()
        //     router.push("/vehicles")
        // })
    }


    // Generate photo preview
    useEffect(() => {
        if (!inputPhoto.current.files[0]) {
            return
        }
        const objectUrl = URL.createObjectURL(inputPhoto.current.files[0])
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        
        return () => URL.revokeObjectURL(objectUrl)
    }, [photo])

    return (
        <>
        {/* Main Container */}
        <Flex justifyContent={"space-between"} p={3} gap={2}>
            {/* Left column */}
            <Flex flexDir={"column"} w={"55%"} gap={2}>
                <Card variant={"outline"}>
                    <CardHeader>
                        <Text fontSize={"xl"} fontWeight={"bold"}>Identification</Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Stack>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel>Plate Number</FormLabel>
                                    <Input  />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel><Link>Vehicle Type </Link></FormLabel>
                                    {/* <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userAPI.modify_user_type} /> */}
                                    <Select>
                                        <option value="" hidden disabled>Select Vehicle Type</option>
                                        {/* {data.userTypes.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type._id}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                            </Flex>

                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel><Link>Brand</Link></FormLabel>
                                    {/* <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userAPI.modify_user_type} /> */}
                                    <Select>
                                        <option value="" hidden disabled>Select Brand</option>
                                        {/* {data.userTypes.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type._id}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Manufacturing Year</FormLabel>
                                    <Input />
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel><Link>Transmission</Link></FormLabel>
                                    {/* <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userAPI.modify_user_type} /> */}
                                    <Select>
                                        <option value="" hidden disabled>Select Transmission</option>
                                        {/* {data.userTypes.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type._id}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel><Link>Model</Link></FormLabel>
                                    {/* <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userAPI.modify_user_type} /> */}
                                    <Select>
                                        <option value="" hidden disabled>Select Model</option>
                                        {/* {data.userTypes.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type._id}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                            </Flex>
                        </Stack>
                    </CardBody>


                </Card>

                <Card variant={"outline"}>
                    <CardHeader>
                        <Text fontSize={"xl"} fontWeight={"bold"}>Details</Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Stack>
                            <Flex gap={2}>
                                <FormControl>
                                    <FormLabel>Engine Number</FormLabel>
                                    <Input  />
                                </FormControl>
                                <FormControl>
                                    <FormLabel><Link>Engine Type</Link></FormLabel>
                                    {/* <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userAPI.modify_user_type} /> */}
                                    <Select>
                                        <option value="" hidden disabled>Select Engine Type</option>
                                        {/* {data.userTypes.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type._id}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl>
                                    <FormLabel><Link>Chassis</Link></FormLabel>
                                    {/* <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userAPI.modify_user_type} /> */}
                                    <Select>
                                        <option value="" hidden disabled>Select Chassis</option>
                                        {/* {data.userTypes.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type._id}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel><Link>Tire Size</Link></FormLabel>
                                    {/* <CategoryListModal modalOpen={specialModalOpen} options={data.specialties} title={"Mechanic Specialties"} apiPath={userAPI.modify_specialties} /> */}
                                    <Select>
                                        <option value="" hidden disabled >Select Tire Size</option>
                                        {/* {data.specialties.map((specialtyOption) => {
                                            if (specialtyOption.disabled == false) {
                                                return (
                                                    <option
                                                        key={specialtyOption._id}
                                                        value={specialtyOption.name}
                                                    >
                                                        {specialtyOption.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl>
                                    <FormLabel>Insurance Amount</FormLabel>
                                    <NumberInput>
                                        <NumberInputField  />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Insurance Expiry Date</FormLabel>
                                    <Input type={"date"} />
                                </FormControl>
                            </Flex>
                            <FormControl>
                                <FormLabel>Preventive Maintenance</FormLabel>
                                <Flex alignItems={"center"} gap={2}>
                                    <Text>Every</Text>
                                    <NumberInput w={"7em"}>
                                        <NumberInputField  />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <Text>Months</Text>
                                </Flex>
                                

                            </FormControl>
                        </Stack>
                    </CardBody>
                </Card>
            </Flex>

            {/* Right column */}
            <Flex flexDir={"column"} gap={2} w={"45%"}>
                <Card variant={"outline"}>
                    <CardHeader>
                        <Text fontSize={"xl"} fontWeight={"bold"}>Monitoring Devices</Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Stack>
                            <FormControl>
                                <FormLabel>GPS Provider</FormLabel>
                                <AutoComplete defaultIsOpen suggestWhenEmpty>
                                    <AutoCompleteInput variant="outline" w={"70%"} />
                                    <AutoCompleteList>
                                        {data.gps.map((item, cid) => (
                                            <AutoCompleteItem
                                                key={cid}
                                                value={item.name}
                                            >
                                                {item.name}
                                            </AutoCompleteItem>
                                        ))}
                                    </AutoCompleteList>
                                </AutoComplete>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Fuel Sensor Provider</FormLabel>
                                <AutoComplete defaultIsOpen suggestWhenEmpty>
                                    <AutoCompleteInput variant="outline" w={"70%"} />
                                    <AutoCompleteList>
                                        {data.fuelSensor.map((item, cid) => (
                                            <AutoCompleteItem
                                                key={cid}
                                                value={item.name}
                                            >
                                                {item.name}
                                            </AutoCompleteItem>
                                        ))}
                                    </AutoCompleteList>
                                </AutoComplete>
                            </FormControl>
                        </Stack>
                    </CardBody>
                </Card>
                <Card variant={"outline"}>
                    <CardHeader><Text fontSize={"xl"} fontWeight={"bold"}>Photo</Text></CardHeader>
                    <Divider />
                    <CardBody>
                        {/*PHOTO INPUT*/}
                        <Flex
                            mt={"0.5em"}
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
                                        w={"15em"}
                                        h={"15em"}
                                    />
                                </Flex>
                            ) : (<></>)}
                            <Button
                                // @ts-ignore
                                mt={photo != null ? ("1.5em") : (0)}
                                bg={"#005DF2"}
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
                    </CardBody>
                </Card>
            </Flex>
        </Flex>

        </>
    )
}

export default CreateVehicleForm;