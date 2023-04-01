import { 
  Grid,
  GridItem, 
  Flex,
  Text,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { SaveButton, CancelButton } from "@/components/buttons";
import { useState, useEffect } from "react";
import { Router, useRouter } from "next/router";
import CreatePartForm from "@/components/layouts/parts/createPartForm";
import { sparePartsAPI } from "@/lib/routes";
import { withSessionSsr } from "@/lib/auth/withSession";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
      const user = req.session.user;
      const allowedUsers = [
        { role: "Inventory", userType: "Manager"},
        { role: "Inventory", userType: "Employee"},
        { role: "System Admin", userType: "Admin"}
      ]

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

      else if (allowedUsers.findIndex(option => 
        option.role == user.role 
        && option.userType == user.userType) == -1) 
      {
        return {
          redirect: {
            permanent: false,
            destination: "/parts",
          },
          props: { user: {
            isLoggedIn: true 
            }, 
          }
      }}

      const partCategories = await fetch(sparePartsAPI.get_categories)
      const catData = await partCategories.json()

      const partsList = await fetch(sparePartsAPI.get_all_parts)
      const partsData = await partsList.json()

      return {
          props: { 
            user: {
              data: user,
              isLoggedIn: true 
            }, 
            categoryList: catData,
            partsList: partsData
          }
      }
});

export default function CreatePartsPage({user, categoryList, partsList}) {
  const router = useRouter();
  const [submitForm, setSubmitForm] = useState();

  function cancel() {
      router.back();
  }

  function headerBreadcrumbs() {return (
    <Breadcrumb pt={1}>
      <BreadcrumbItem  >
          <BreadcrumbLink href='/' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Spare Parts</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink fontSize={"lg"}>New Item</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )}

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>New Item</Text>
        <ButtonGroup>
          <CancelButton title={"Cancel"} clickFunction={cancel} />
          <SaveButton title={"Save Item"} clickFunction={submitForm} />
        </ButtonGroup>
      </Flex>
    )
  }

    // Get submit form function from create part form component
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
          <Header breadcrumb={headerBreadcrumbs()} main={headerMain()} withShadow={true} />
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.100"} overflowY={"auto"} zIndex={1}>
          <CreatePartForm creatorID={user.data.userID} categoryList={categoryList} submitFunc={getSubmit} />
        </GridItem>
      </Grid>
    </>
  )
}
  
  