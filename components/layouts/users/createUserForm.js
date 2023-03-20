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
    Button, 
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input, 
    Select,
    Link,
    Divider,
    useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import CategoryListModal from "@/components/basicCategoryModal";
import { uploadImage } from "@/lib/images/imageHandler";
import { userAPI } from "@/lib/routes";
import { generateID } from "@/lib/dataHandler";
import { Router, useRouter } from "next/router";

function CreateUserForm({creatorID, data, userCount, submitFunc}) {
    const router = useRouter()

    const [userID, setUserID] = useState(generateID(userCount, 8))
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("");
    const [userType, setUserType] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
    }, [userID, firstName, lastName, email, phone, department, role, userType, specialty, password, confirmPassword, photo])

    function passSubmitFunc() {
        return submitForm
    }

    function clear() {
        setUserID("")
        setFirstName("")
        setLastName("")
        setEmail("")
        setPhone("")
        setDepartment("")
        setRole("")
        setUserType("")
        setSpecialty("")
        setPassword("")
        setConfirmPassword("")
        setPhoto()
        setPreview("")
        inputPhoto.current.value = null
    }

    async function submitForm() {
        let uploadConfig = {
            file: inputPhoto.current.files[0],
            params: {
                public_id: userID,
                folder: "users",
                // type: "private",
            }
        }
        let imageRes = await uploadImage(uploadConfig)
        console.log(imageRes)
        let userData = {
            userID: userID,
            imageID: imageRes,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            departmentID: department,
            roleID: role,
            userTypeID: userType,
            specialtyID: specialty,
            password: password,
            creatorID: creatorID
        }
        console.log(userData)
        await fetch(userAPI.create_user, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData),
        }).then(result => result.json())
        .then(data => {
            if (data.error != null) 
                console.log(data.error)
            clear()
            router.push("/users")
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
                                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel onClick={() => deptModalOpen.onOpen()}><Link>Department</Link></FormLabel>
                                    <CategoryListModal modalOpen={deptModalOpen} options={data.department} title={"Department List"} apiPath={userAPI.modify_department} /> 
                                    <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
                                        <option value="" hidden disabled>Select Department</option>
                                        {data.department.map((dept) => {
                                            if (dept.disabled == false) {
                                                return (
                                                    <option
                                                        key={dept._id}
                                                        value={dept.name}
                                                    >
                                                        {dept.name}
                                                    </option>
                                                );
                                            }
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel onClick={(() => roleModalOpen.onOpen())}><Link>Role</Link></FormLabel>
                                    <CategoryListModal modalOpen={roleModalOpen} options={data.roles} title={"Role List"} apiPath={userAPI.modify_role} />
                                    <Select value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="" hidden disabled>Select Role</option>
                                        {data.roles.map((roleOption) => {
                                            if (roleOption.disabled == false) {
                                                return (
                                                    <option
                                                        key={roleOption._id}
                                                        value={roleOption.name}
                                                    >
                                                        {roleOption.name}
                                                    </option>
                                                );
                                            }
                                        })}
                                    </Select>
                                </FormControl>
                            </Flex>
                            <Flex gap={2}>
                                <FormControl isRequired>
                                    <FormLabel onClick={() => userModalOpen.onOpen()}><Link>User Type</Link></FormLabel>
                                    <CategoryListModal modalOpen={userModalOpen} options={data.userTypes} title={"User Types"} apiPath={userAPI.modify_user_type} />
                                    <Select value={userType} onChange={(e) => setUserType(e.target.value)}>
                                        <option value="" hidden disabled>Select User Type</option>
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
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel onClick={() => specialModalOpen.onOpen()}><Link>{"Specialty (if Mechanic)"}</Link></FormLabel>
                                    <CategoryListModal modalOpen={specialModalOpen} options={data.specialties} title={"Mechanic Specialties"} apiPath={userAPI.modify_specialties} />
                                    <Select value={specialty} onChange={(e) => setSpecialty(e.target.value)} disabled={role != "Mechanic"}>
                                        <option value="" hidden disabled >Select Specialty</option>
                                        {data.specialties.map((specialtyOption) => {
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
                                        })}
                                    </Select>
                                </FormControl>
                            </Flex>
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter gap={2}>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input type={"password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </FormControl>
                    </CardFooter>
                </Card>
            </GridItem>
        </Grid>
        </>
    )
}

export default CreateUserForm;