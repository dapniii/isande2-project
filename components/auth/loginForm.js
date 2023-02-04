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

import { Router, useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import dbConnect from "@/lib/dbConnect";
import { ironOptions } from "@/lib/config";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (req.session.user) {
      return {
        redirect: { destination: "/", permanent: true },
        props: {},
      };
    } else {
      await dbConnect();

      return {
        props: {},
      };
    }
  },
  ironOptions
);

export default function LoginForm(props) {
  const router = useRouter();

  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const disabledRef = useRef(false);

  const { formName, buttonName } = props;

  const [show, setShow] = useState(false);
  const showHandler = () => setShow(!show);

  const [error, setError] = useState(false);

  //Handles data submission when Submit button is clicked
  function submitHandler(event) {
    event.preventDefault();
    let userData = {
      employeeID: employeeID,
      password: password,
      disabled: disabledRef,
    };

    fetch("../../pages/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "Logged in") {
          console.log("SUCCESS");
          console.log("SESSION IS", data);
          router.replace("/");
        } else {
          console.log("ERROR IS:", data);
          setError(true);
        }
      });
  }

  function showError() {
    if (error) {
      return <span>AM AN ERROR MESSAGE</span>;
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
                    onChange={(e) => setEmployeeID(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
