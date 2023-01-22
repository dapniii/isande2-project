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
} from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { MdLogin, MdPassword, MdPerson } from "react-icons/md";

export default function authForm( props ) {
    const { formName, buttonName } = props;
    
  const [show, setShow] = useState(false);
  const showHandler = () => setShow(!show);

  return (
    <Flex>
      {/* Card Container */}
      <Card maxW="md" variant="outline">
        <CardHeader>
          {/* Form Title */}
          <Heading>{formName}</Heading>
        </CardHeader>
        <CardBody>
          <Stack>
            {/* Employee ID Label */}
            <Text fontWeight="semibold">Employee ID</Text>
            <InputGroup>
              {/* Employee Icon */}
              <InputLeftElement
                pointerEvents="none"
                children={<MdPerson color="gray" />}
              />
              {/* Employee ID Inpu Field */}
              <Input placeholder="Enter Employee ID" />
            </InputGroup>

            {/* Password Label */}
            <Text fontWeight="semibold">Password</Text>
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
              />
              {/* Show/ Hide Password Button */}
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={showHandler}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
            {/* Button */}
            <Button
              bg="green.400"
              color="white"
              //as = contains Logo from react-icon/md
              //boxSize = size of logo
              leftIcon={<Icon as={MdLogin} boxSize={"1em"} />}
            >
              {buttonName}
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
}
