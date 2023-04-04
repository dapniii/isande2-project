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
    Flex,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@chakra-ui/react";
import { generateID } from "@/lib/dataHandler";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";


function CreateSupplierForm({creatorID}) {
    const [name, setName] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [city, setCity] = useState("")
    const [province, setProvince] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState("")
    const inputPhoto = useRef(null);

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
                            <FormLabel>City</FormLabel>
                                <Select
                                    placeholder="Select City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                >
                                </Select>
                        </FormControl> 
                        <FormControl isRequired>
                            <FormLabel>Province</FormLabel>
                                <Select
                                    placeholder="Select Province"
                                    value={province}
                                    onChange={(e) => setProvince(e.target.value)}
                                >
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