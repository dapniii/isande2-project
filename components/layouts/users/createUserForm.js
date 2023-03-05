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
    Link,
    Divider,
    useDisclosure
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import CategoryListModal from "@/components/basicCategoryModal";
import uploadImage from "@/lib/imageHandler";
import { userApi } from "@/lib/routes";
import { nanoid } from "nanoid";

function CreateUserForm({data, submitFunc}) {
    const [userID, setUserID] = useState(nanoid(20))
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

    const deptModalOpen = useDisclosure();
    const roleModalOpen = useDisclosure();
    const userModalOpen = useDisclosure();
    const specialModalOpen = useDisclosure();


    // TODO: Convert to UseContext (basta prevent it from re-rendering all the time huhu)
    useEffect(() => {
        submitFunc(passSubmitFunc)
    }, [userID, firstName, lastName, emailAddress, phoneNumber, department, role, userType, specialty, password, confirmPassword, photo])

    function passSubmitFunc() {
        return submitForm
    }

    async function submitForm() {
        let uploadConfig = {
            file: photo,
            params: {
                public_id: userID,
                folder: "parts",
                type: "authenticated",
            }
        }
        let imageRes = await uploadImage(uploadConfig)
        console.log(imageRes)
        let userData = {
            userID: userID,
            photo: uploadConfig.params,
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            email: emailAddress.current.value,
            phone: phoneNumber.current.value,
            department: department.current.value,
            role: role.current.value,
            userType: userType.current.value,
            specialty: specialty.current.value,
            password: password.current.value,
        }



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
        
        <Grid templateColumns={"1fr 1.2fr"} px={2} py={5} gap={2}>
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
                                    <Input ref={firstName} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input ref={lastName} />
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input ref={emailAddress} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input ref={phoneNumber} />
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel onClick={() => deptModalOpen.onOpen()}><Link>Department</Link></FormLabel>
                                    <CategoryListModal modalOpen={deptModalOpen} options={data.department} title={"Department List"} apiPath={userApi.create_department} /> 
                                    <Select placeholder="Select Department" ref={department}>
                                        {/* {data.department.map((dept) => {
                                            if (dept.disabled == false) {
                                                return (
                                                    <option
                                                        key={dept.name}
                                                        value={dept.name}
                                                    >
                                                        {dept.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel onClick={(() => roleModalOpen.onOpen())}><Link>Role</Link></FormLabel>
                                    <CategoryListModal modalOpen={roleModalOpen} options={data.roles} title={"Role List"} apiPath={userApi.create_role} />
                                    <Select placeholder="Select Role" ref={role}>
                                        {/* {data.roles.map((roleOption) => {
                                            if (roleOption.disabled == false) {
                                                return (
                                                    <option
                                                        key={roleOption.name}
                                                        value={roleOption.name}
                                                    >
                                                        {roleOption.name}
                                                    </option>
                                                );
                                            }
                                        })} */}
                                    </Select>
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel onClick={() => userModalOpen.onOpen()}><Link>User Type</Link></FormLabel>
                                    <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userApi.create_user_type} />
                                    <Select placeholder="Select User Type" ref={userType}>
                                        {/* {data.userTypes.map((type) => {
                                            if (type.disabled == false) {
                                                return (
                                                    <option
                                                        key={type.name}
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
                                    <FormLabel onClick={() => specialModalOpen.onOpen()}><Link>{"Specialty (if Mechanic)"}</Link></FormLabel>
                                    <CategoryListModal modalOpen={specialModalOpen} options={data.specialties} title={"Mechanic Specialties"} apiPath={userApi.create_specialties} />
                                    <Select placeholder="Select Specialty" ref={specialty}>
                                        {/* {data.specialties.map((specialtyOption) => {
                                            if (specialtyOption.disabled == false) {
                                                return (
                                                    <option
                                                        key={specialtyOption.id}
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
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter gap={2}>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input type={"password"} ref={password} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input type={"password"} ref={confirmPassword} />
                        </FormControl>
                    </CardFooter>
                </Card>
            </GridItem>
        </Grid>
        </>
    )
}

export default CreateUserForm;