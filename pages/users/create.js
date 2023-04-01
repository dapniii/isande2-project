import { useEffect, useState } from "react";
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
import { withSessionSsr } from "@/lib/auth/withSession";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
      const user = req.session.user;
      const allowedUserType = ["Admin"]

      if(user == null) {
          return {
            redirect: {
              permanent: false,
              destination: "/login",
            },
            props: { user: {
              isLoggedIn: false 
              }, 
            }
        }
      }

      else if (allowedUserType.findIndex(type => type == user.userType) == -1) {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props: { user: {
            isLoggedIn: true 
            }, 
          }
      }}

      const categoryList = {
        department: [],
        roles: [],
        userTypes: [],
        specialties: [],
      }

      const catResult = await fetch(userAPI.get_categories)
      const data = await catResult.json()

      const userResult = await fetch(userAPI.get_all_users)
      const userData = await userResult.json()

      categoryList.department = data.departments
      categoryList.roles = data.roles
      categoryList.userTypes = data.userTypes
      categoryList.specialties = data.specialties

      return {
          props: { 
            user: {
              data: user,
              isLoggedIn: true 
            }, 
            categoryList: categoryList,
            userList: userData,
          }
      }
});

export default function CreateUsersPage({user, categoryList, userList}) {
  const router = useRouter();
  const [submitForm, setSubmitForm] = useState();


  
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
          <Navbar user={user.data} />
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
          <CreateUserForm creatorID={user.data.userID} data={categoryList} userCount={userList.count} submitFunc={getSubmit} />
        </GridItem>
      </Grid>
    </>
  );
}
