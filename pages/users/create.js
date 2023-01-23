import {
  Grid,
  GridItem,
  Flex,
  Text,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Center,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { SaveButton, CancelButton } from "@/components/buttons";
import { Router, useRouter } from "next/router";
import AuthForm from "@/components/auth/authForm";

export default function CreateUsersPage() {
  const router = useRouter();

  // Temp
  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  // Header Functions
  function submitForm() {
    console.log("Save User");
  }

  function cancel() {
    router.back();
  }

  function headerBreadcrumbs() {
    return (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/users">
            <Text as="u" color="#005DF2">
              Home
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink>New User</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          New User
        </Text>
        <ButtonGroup>
          <CancelButton title={"Cancel"} clickFunction={cancel} />
          <SaveButton title={"Save User"} clickFunction={submitForm} />
        </ButtonGroup>
      </Flex>
    );
  }

  // MAIN
  return (
    <>
      <Grid
        minH="100vh"
        templateColumns={"1fr 7fr"}
        templateRows={"0fr 1fr"}
        overflowY={"auto"}
      >
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user} />
        </GridItem>

        <GridItem colStart={2}>
          <Header
            breadcrumb={headerBreadcrumbs()}
            main={headerMain()}
            withShadow={true}
          />
        </GridItem>

        {/* Main Content */}
        <GridItem colStart={2} bg={"blackAlpha.100"}>
          <AuthForm formName={"Build a Guy"} buttonName={"Create User"} />
        </GridItem>
      </Grid>
    </>
  );
}
