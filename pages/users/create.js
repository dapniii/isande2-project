import { useState } from "react";
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
import CreateUserForm from "@/components/layouts/users/createUserForm";
import { userAPI } from "@/lib/routes";

export async function getServerSideProps() {
  const categoryList = {
    department: [],
    roles: [],
    userTypes: [],
    specialties: [],
  }
  
  const res = await fetch(userAPI.get_categories)
  const data = await res.json()
  
  categoryList.department = data.departments
  categoryList.roles = data.roles
  categoryList.userTypes = data.userTypes
  categoryList.specialties = data.specialties
  
  return { props: { categoryList }}
}

export default function CreateUsersPage({categoryList}) {
  const router = useRouter();
  const [submitForm, setSubmitForm] = useState();
  
  // Temp
  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  // Header Functions

  function cancel() {
    router.back();
  }

  function headerBreadcrumbs() {
    return (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/users">
            <Text as="u" color="#005DF2">
              Users
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

  // Get submit form function from create user form component
  function getSubmit(func) {
    setSubmitForm(func)
  }

  // MAIN
  return (
    <>
      <Grid
        minH="100vh"
        templateColumns={"1fr 7fr"}
        templateRows={"0fr 1fr"}
      >
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user} />
        </GridItem>

        <GridItem colStart={2} top={0} position={"sticky"} zIndex={2}>
          <Header
            breadcrumb={headerBreadcrumbs()}
            main={headerMain()}
            withShadow={true}
          />
        </GridItem>

        {/* Main Content */}
        <GridItem colStart={2} bg={"blackAlpha.100"} overflowY={"auto"}>
          {/* <UserCreateForm formName={"Build a Guy"} buttonName={"Create User"} /> */}
          <CreateUserForm data={categoryList} submitFunc={getSubmit} />
        </GridItem>
      </Grid>
    </>
  );
}
