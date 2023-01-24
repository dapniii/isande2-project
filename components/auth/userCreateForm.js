import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Stack,
  Text,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Spacer,
  Divider,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdLogin, MdPassword, MdPerson } from "react-icons/md";

async function createUser(employeeID, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ employeeID, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export default function UserCreateForm(props) {
  const employeeIDInputRef = useRef();
  const passwordInputRef = useRef();

  const { formName, buttonName } = props;

  const [show, setShow] = useState(false);
  const showHandler = () => setShow(!show);

  //Handles data submission when Submit button is clicked
  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmployeeID = employeeIDInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    try {
      const result = await createUser(enteredEmployeeID, enteredPassword);
      console.log("Emp ID: " + enteredEmployeeID);
      console.log("Pass: " + enteredPassword);
      console.log(result)
      //Once user successfully created, clear all inputs
      employeeIDInputRef.current.value = "";
      passwordInputRef.current.value = "";
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Flex>
      {/* Card Container */}
      <Card maxW="md" variant="outline">
        <CardHeader>
          {/* Form Title */}
          <Heading>{formName}</Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={submitHandler}>
            <Stack spacing={3}>
              {/* OPTIONAL TODO: HIGHLIGHT TEXTBOX RED IF ERROR REPLACING 'isRequired'
              https://chakra-ui.com/docs/components/form-control */}
              <FormControl isRequired>
                {/* Employee ID Label */}
                <FormLabel>Employee ID</FormLabel>

                <InputGroup>
                  {/* Employee Icon */}
                  <InputLeftElement
                    pointerEvents="none"
                    children={<MdPerson color="gray" />}
                  />
                  {/* Employee ID Input Field */}
                  <Input
                    placeholder="Enter Employee ID"
                    autoComplete="off"
                    ref={employeeIDInputRef}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                {/* Password Label */}
                <FormLabel>Password</FormLabel>

                <InputGroup>
                  {/* Password Icon */}
                  <InputLeftElement
                    pointerEvents="none"
                    children={<MdPassword color="gray" />}
                  />
                  {/* Password Input Field */}
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter Password"
                    ref={passwordInputRef}
                  />
                  {/* Show/ Hide Password Button */}
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={showHandler}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>At least 8 characters long</FormHelperText>
              </FormControl>
              <Spacer />
              <Divider />
              <Spacer />
              {/* Button */}
              <Button
                type="submit"
                bg="green.400"
                color="white"
                //as = contains Logo from react-icon/md
                //boxSize = size of logo
                leftIcon={<Icon as={MdLogin} boxSize={"1em"} />}
              >
                {buttonName}
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Flex>
  );
}
