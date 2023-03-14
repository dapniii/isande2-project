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
import { BackButton, EditButton, SaveButton, CancelButton } from "@/components/buttons";
import { Router, useRouter } from "next/router";
import { userAPI } from "@/lib/routes";

import ViewUserForm from "@/components/layouts/users/viewUserLayout";

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

export default function UserDetails({categoryList}) {
  const router = useRouter();
  const { userID } = router.query;
  const [isEdit, setIsEdit] = useState(false);
  const [submitForm, setSubmitForm] = useState();

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
                Users
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
        { isEdit ? (
          <Flex gap={2}>
            <CancelButton title={"Cancel"} clickFunction={() => setIsEdit(!isEdit)} />
            <SaveButton title={"Save Changes"} clickFunction={submitForm} />
          </Flex>
          ) 
          : (<EditButton title={"Edit User"} clickFunction={() => setIsEdit(!isEdit)} />)
        }
        
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
          <ViewUserForm 
            userID={userID} 
            data={categoryList} 
            isEdit={isEdit} 
            submitFunc={getSubmit} 
          />
        </GridItem>
      </Grid>
    </>
  );
}
