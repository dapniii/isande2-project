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
import { BackButton, EditButton } from "@/components/buttons";
import { Router, useRouter } from "next/router";

import ViewUserForm from "@/components/usersModule/viewUserForm";

export default function UserDetails() {
  const router = useRouter();

  // Temp
  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  const tempUserData = {
    firstName: "FirstName",
    lastName: "LastName",
    role: "Role",
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
      <Flex justifyContent={"space-between"}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/users">
              <Text as="u" color="#005DF2">
                Home
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>User Details</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex>
          <BackButton title={"Back"} clickFunction={cancel} />
        </Flex>
      </Flex>
    );
  }

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          User Details
        </Text>
        <EditButton title={"Edit User"} clickFunction={submitForm} />
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
          <ViewUserForm />
        </GridItem>
      </Grid>
    </>
  );
}
