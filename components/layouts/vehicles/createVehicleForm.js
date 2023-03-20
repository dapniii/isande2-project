import { useState, useEffect, useRef } from "react";
import {
    Image,
    Text, 
    Flex,
    Stack,
    Card, 
    CardBody, 
    CardHeader,
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
import { uploadImage } from "@/lib/images/imageHandler";
import { vehicleAPI } from "@/lib/routes";
import { Router, useRouter } from "next/router";

function CreateVehicleForm({data, submitFunc}) {
    const router = useRouter()
    
    const [plateNumber, setPlateNumber] = useState("")
    const [vehicleType, setVehicleType] = useState("")
    const [brand, setBrand] = useState("")
    const [manufacturingYear, setManufacturingYear] = useState("")
    const [transmission, setTransmission] = useState("")
    const [model, setModel] = useState("")
    const [engineNumber, setEngineNumber] = useState("")
    const [engineType, setEngineType] = useState("")
    const [chassis, setChassis] = useState("")
    const [tireSize, setTireSize] = useState("")
    const [insuranceAmount, setInsuranceAmount] = useState(0)
    const [expiry, setExpiry] = useState("")
    const [preventive, setPreventive] = useState(1)
    const [gps, setGPS] = useState("")
    const [fuelSensor, setFuelSensor] = useState("")

    const [photo, setPhoto] = useState();
    const [preview, setPreview] = useState("")
    const inputPhoto = useRef(null);

    const vTypeModalOpen = useDisclosure()
    const brandModalOpen = useDisclosure()
    const transmissionModalOpen = useDisclosure()
    const eTypeModalOpen = useDisclosure()
    const chassisModalOpen = useDisclosure()
    const tireModalOpen = useDisclosure()
    const gpsModalOpen = useDisclosure()
    const fuelModalOpen = useDisclosure()


    // TODO: Convert to UseContext (basta prevent it from re-rendering all the time huhu)
    useEffect(() => {
        submitFunc(passSubmitFunc)
    }, [plateNumber, vehicleType, brand, manufacturingYear, transmission, model, engineNumber, engineType, chassis, tireSize, insuranceAmount, expiry, preventive, gps, fuelSensor, photo])

    function passSubmitFunc() {
        return submitForm
    }

    function clear() {

        setPhoto()
        setPreview("")
        inputPhoto.current.value = null
    }

    async function submitForm() {
        let uploadConfig = {
            file: inputPhoto.current.files[0],
            params: {
                public_id: plateNumber,
                folder: "vehicles",
                // type: "private",
            }
        }
        let imageRes = await uploadImage(uploadConfig)
        console.log(imageRes)
        let vehicleData = {
            plateNumber: plateNumber,
            imageID: imageRes,
            vehicleTypeID: vehicleType,
            brandID: brand,
            manufactureYear: manufacturingYear,
            transmissionID: transmission,
            model: model,
            engineNumber: engineNumber,
            engineTypeID: engineType,
            chassisTypeID: chassis,
            tireSizeID: tireSize,
            insuranceAmount: insuranceAmount,
            insuranceExpiry: expiry,
            preventive: preventive,
            gpsID: gps,
            fuelSensorID: fuelSensor,
            vehicleStatusID: "Active", 
            creatorID: "00002", // CHANGE HARDCODE
        }
        console.log(vehicleData)
        let result = await fetch(vehicleAPI.create_vehicle, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vehicleData),
        }).then(result => {
            console.log(result.json())
            clear()
            router.push("/vehicles")
        })
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
                                    <Input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel onClick={vTypeModalOpen.onOpen}><Link>Vehicle Type </Link></FormLabel>
                                    <CategoryListModal modalOpen={vTypeModalOpen} options={data.vehicleTypes} title={"Vehicle Types"} apiPath={vehicleAPI.modify_vehicle_type} />
                                    <Select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                                        <option value="" hidden disabled>Select Vehicle Type</option>
                                        {data.vehicleTypes.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type.pubId}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })}
                                    </Select>
                                </FormControl>
                            </Flex>

                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel onClick={brandModalOpen.onOpen}><Link>Brand</Link></FormLabel>
                                    <CategoryListModal modalOpen={brandModalOpen} options={data.brands} title={"Vehicle Brands"} apiPath={vehicleAPI.modify_brand} />
                                    <Select value={brand} onChange={(e) => setBrand(e.target.value)}>
                                        <option value="" hidden disabled>Select Brand</option>
                                        {data.brands.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type.pubId}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Manufacturing Year</FormLabel>
                                    <Input placeholder={new Date().getFullYear().toString()} value={manufacturingYear} onChange={(e) => setManufacturingYear(e.target.value)} />
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel onClick={transmissionModalOpen.onOpen}><Link>Transmission</Link></FormLabel>
                                    <CategoryListModal modalOpen={transmissionModalOpen} options={data.transmission} title={"Transmission"} apiPath={vehicleAPI.modify_transmission} />
                                    <Select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                                        <option value="" hidden disabled>Select Transmission</option>
                                        {data.transmission.map((type) => {
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
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel><Link>Model</Link></FormLabel>
                                    <Input value={model} onChange={(e) => setModel(e.target.value)} />
                                    {/* <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userAPI.modify_user_type} /> */}
                                    {/* <Select>
                                        <option value="" hidden disabled>Select Model</option>
                                        {data.userTypes.map((type) => {
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
                                        })}
                                    </Select> */}
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
                                    <Input value={engineNumber} onChange={(e) => setEngineNumber(e.target.value)} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel onClick={eTypeModalOpen.onOpen}><Link>Engine Type</Link></FormLabel>
                                    <CategoryListModal modalOpen={eTypeModalOpen} options={data.engineType} title={"Engine Types"} apiPath={vehicleAPI.modify_engine_type} />
                                    <Select value={engineType} onChange={(e) => setEngineType(e.target.value)}>
                                        <option value="" hidden disabled>Select Engine Type</option>
                                        {data.engineType.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type.pubId}
                                                        value={type.name}
                                                    >
                                                        {type.name}
                                                    </option>
                                                );
                                            }
                                        })}
                                    </Select>
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl>
                                    <FormLabel onClick={chassisModalOpen.onOpen}><Link>Chassis</Link></FormLabel>
                                    <CategoryListModal modalOpen={chassisModalOpen} options={data.chassis} title={"Chassis"} apiPath={vehicleAPI.modify_chassis} />
                                    <AutoComplete openOnFocus suggestWhenEmpty value={chassis} onChange={(value) => setChassis(value)}>
                                        <AutoCompleteInput variant="outline"  />
                                        <AutoCompleteList>
                                            {data.chassis.map((item, cid) => (
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
                                    <FormLabel onClick={tireModalOpen.onOpen}><Link>Tire Size</Link></FormLabel>
                                    <CategoryListModal modalOpen={tireModalOpen} options={data.tireSize} title={"Tire Sizes"} apiPath={vehicleAPI.modify_tire_size} />
                                    <AutoComplete openOnFocus suggestWhenEmpty value={tireSize} onChange={(value) => setTireSize(value)}>
                                        <AutoCompleteInput variant="outline"  />
                                        <AutoCompleteList>
                                            {data.tireSize.map((item, cid) => (
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
                            </Flex>
                            <Flex gap={2}>
                                <FormControl>
                                    <FormLabel>Insurance Amount</FormLabel>
                                    <NumberInput min={0} precision={2} value={insuranceAmount} onChange={(value) => setInsuranceAmount(parseFloat(value))}>
                                        <NumberInputField  />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Insurance Expiry Date</FormLabel>
                                    <Input type={"date"} value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                                </FormControl>
                            </Flex>
                            <FormControl>
                                <FormLabel>Preventive Maintenance</FormLabel>
                                <Flex alignItems={"center"} gap={2}>
                                    <Text>Every</Text>
                                    <NumberInput w={"7em"} min={1} precision={0} value={preventive} onChange={(value) => setPreventive(parseFloat(value))}>
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
                                <FormLabel onClick={gpsModalOpen.onOpen}><Link>GPS Provider</Link></FormLabel>
                                <CategoryListModal modalOpen={gpsModalOpen} options={data.gps} title={"GPS Providers"} apiPath={vehicleAPI.modify_gps} />
                                <AutoComplete openOnFocus suggestWhenEmpty value={gps} onChange={(value) => setGPS(value)}>
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
                                <FormLabel onClick={fuelModalOpen.onOpen}><Link>Fuel Sensor Provider</Link></FormLabel>
                                <CategoryListModal modalOpen={fuelModalOpen} options={data.fuelSensor} title={"Fuel Sensor Providers"} apiPath={vehicleAPI.modify_fuel_sensor} />
                                <AutoComplete openOnFocus suggestWhenEmpty value={fuelSensor} onChange={(value) => setFuelSensor(value)}>
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