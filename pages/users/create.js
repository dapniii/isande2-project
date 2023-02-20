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
// import UserCreateForm from "@/components/auth/userCreateForm";
import CreateUserForm from "@/components/usersModule/createUserForm";

export async function getServerSideProps() {
  const data = {
    department: "",
    roles: "",
    userTypes: "",
    specialties: "",
  }

  data.department = await (await fetch("https://my.api.mockaroo.com/department.json?key=abdcd8e0")).json()
  data.roles = await (await fetch("https://my.api.mockaroo.com/role.json?key=abdcd8e0")).json()
  data.userTypes = await (await fetch("https://my.api.mockaroo.com/user_type.json?key=abdcd8e0")).json()
  data.specialties = await (await fetch("https://my.api.mockaroo.com/specialty.json?key=abdcd8e0")).json()
  
  return { props: { data }}
}

export default function CreateUsersPage({data}) {
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
          <CreateUserForm data={data} submitFunc={getSubmit} />
        </GridItem>
      </Grid>
    </>
  );
}
