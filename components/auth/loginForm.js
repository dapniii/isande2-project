import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import { Button, Container, Heading, Icon } from "@chakra-ui/react";
import { Flex, Stack, Spacer, Divider } from "@chakra-ui/react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { MdLogin, MdPassword, MdPerson } from "react-icons/md";

import { signIn } from "next-auth/react";

export default function LoginForm(props) {
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

    const result = await signIn("credentials", {
      redirect: false,
      employeeID: enteredEmployeeID,
      password: enteredPassword,
    });
    console.log("*** loginForm.js ***")
    console.log(result)
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
