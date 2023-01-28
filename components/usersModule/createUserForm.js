import { useState, useEffect, useRef } from "react";
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
    ButtonGroup,
    Button, 
    IconButton,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
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
    Divider
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

function CreateUserForm() {
    const firstName = useRef();
    const lastName = useRef();
    const emailAddress = useRef();
    const phoneNumber = useRef();
    const department = useRef();
    const role = useRef();
    const userType = useRef();
    const specialty = useRef();
    const password = useRef();
    const confirmPassword = useRef();

    const [photo, setPhoto] = useState();
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
        <Grid templateColumns={"1fr 1.2fr"} p={2} gap={2}>
            <GridItem>
                <Card variant={"outline"}>
                    <CardHeader><Text fontSize={"xl"} fontWeight={"bold"}>Profile Picture</Text></CardHeader>
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
                    </CardBody>
                </Card>
            </GridItem>
            <GridItem>
                <Card variant={"outline"}>
                    <CardHeader>
                        <Text fontSize={"xl"} fontWeight={"bold"}>User Details</Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Stack>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel>First Name</FormLabel>
                                    <Input 
                                        ref={firstName}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input 
                                        ref={lastName}
                                    />
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input 
                                        ref={emailAddress}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input 
                                        ref={phoneNumber}
                                    />
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel>Department</FormLabel>
                                    <Select
                                        placeholder="Select Department"
  
                                        ref={department}
                                    >
                                        {/* {units.map((unit) => {
                                            if (unit.disabled == false) {
                                                return (
                                                    <option
                                                        key={unit.id}
                                                        value={unit.name}
                                                    >
                                                        {unit.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        placeholder="Select Role"
                                        ref={role}
                                    >
                                        {/* {units.map((unit) => {
                                            if (unit.disabled == false) {
                                                return (
                                                    <option
                                                        key={unit.id}
                                                        value={unit.name}
                                                    >
                                                        {unit.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel>User Type</FormLabel>
                                    <Select
                                        placeholder="Select User Type"
                                        ref={userType}
                                    >
                                        {/* {units.map((unit) => {
                                            if (unit.disabled == false) {
                                                return (
                                                    <option
                                                        key={unit.id}
                                                        value={unit.name}
                                                    >
                                                        {unit.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>{"Specialty (if Mechanic)"}</FormLabel>
                                    <Select
                                        placeholder="Select Specialty"
                                        ref={specialty}
                                    >
                                        {/* {units.map((unit) => {
                                            if (unit.disabled == false) {
                                                return (
                                                    <option
                                                        key={unit.id}
                                                        value={unit.name}
                                                    >
                                                        {unit.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                            </Flex>
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter gap={2}>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input 
                                type={"password"}
                                ref={password}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input 
                                type={"password"}
                                ref={confirmPassword}
                            />
                        </FormControl>
                    </CardFooter>
                </Card>
            </GridItem>
        </Grid>
    )
}

export default CreateUserForm;