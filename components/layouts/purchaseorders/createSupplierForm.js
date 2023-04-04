import { useState, useRef, useEffect } from "react";
import { 
    Image,
    Text, 
    Button, 
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input, 
    Select,
    Flex,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    useDisclosure,
} from "@chakra-ui/react";
import { generateID } from "@/lib/dataHandler";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import CategoryListModal from "@/components/basicCategoryModal";
import { purchaseOrderAPI } from "@/lib/routes";
import { uploadImage } from "@/lib/images/imageHandler";

function CreateSupplierForm({creatorID, categoryList, submitFunc}) {
    const [name, setName] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [city, setCity] = useState("")
    const [province, setProvince] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState("")
    const inputPhoto = useRef(null);

    const cityModal = useDisclosure();
    const provModal = useDisclosure();


    // TODO: Convert to UseContext (basta prevent it from re-rendering all the time huhu)
    useEffect(() => {
        submitFunc(passSubmitFunc)
    }, [name, streetAddress, city, province, email, phone, photo, inputPhoto])

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

    function passSubmitFunc() {
        return submitForm
    }

    async function submitForm() {
        let uploadConfig = {
            file: inputPhoto.current.files[0],
            params: {
                public_id: name,
                folder: "suppliers",
                // type: "private",
            }
        }
        let imageRes = await uploadImage(uploadConfig)
        console.log(imageRes)

        let supplierData = {
            name: name,
            imageID: imageRes,
            streetAddress: streetAddress,
            cityID: city,
            provinceID: province,
            email: email,
            phone: phone,
            creatorID: creatorID,
        }
        console.log(supplierData)
        
        let result = await fetch(purchaseOrderAPI.create_supplier, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(supplierData),
        }).then(result => result.json())
        .then(data => {
            console.log(data)
            location.reload()
        })
    }

    return (
        <Flex justifyContent={"space-around"} p={5} gap={5}>
            <Card variant={"outline"} w={"40%"}>
                <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                    <Text fontSize={"xl"} fontWeight={"bold"}>Photo</Text>
                </CardHeader>
                <CardBody display={"flex"} gap={5}>
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
                </CardBody>
            </Card>

            <Card variant={"outline"} w={"60%"}>
                <CardHeader borderBottom={"1px ridge #d3d0cf"} py={1}>
                    <Text fontSize={"xl"} fontWeight={"bold"}>Details</Text>
                </CardHeader>
                <CardBody display={"flex"} flexDirection={"column"} gap={5}>
                    <FormControl isRequired>
                        <FormLabel>Supplier Name</FormLabel>
                        <Input
                            name="name"
                            value={name}
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Street Address</FormLabel>
                        <Input
                            name="streetAddress"
                            value={streetAddress}
                            type="text"
                            onChange={(e) => setStreetAddress(e.target.value)}
                        />
                    </FormControl>

                    <Flex gap={5}>
                        <FormControl isRequired>
                            <FormLabel onClick={() => cityModal.onOpen()}>City</FormLabel>
                            <CategoryListModal modalOpen={cityModal} title={"Cities"} options={categoryList.cities} apiPath={purchaseOrderAPI.modify_city}/>
                                <Select
                                    placeholder="Select City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                    
                                    {categoryList.cities.map((category) => {
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
                        <FormControl isRequired>
                            <FormLabel onClick={() => provModal.onOpen()}>Province</FormLabel>
                            <CategoryListModal modalOpen={provModal} title={"Provinces"} options={categoryList.provinces} apiPath={purchaseOrderAPI.modify_status}/>

                                <Select
                                    placeholder="Select Province"
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                >
                                    {categoryList.provinces.map((category) => {
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
                </CardBody>

                <CardFooter display={"flex"} flexDirection={"column"} gap={5}>
                    <Text fontSize={"lg"} fontWeight={"bold"} >Contact Information</Text>
                    <Flex gap={5}>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                name="email"
                                value={email}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                name="phone"
                                value={phone}
                                type="text"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </FormControl>
                    </Flex>
                </CardFooter>
            </Card>

        </Flex>
    )
}

export default CreateSupplierForm