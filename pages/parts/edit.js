import { useState, useEffect, useRef } from "react";
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
import { useRouter } from "next/router";
import { sparePartsAPI } from "@/lib/routes";
import { EditPartContext } from "./context";
import EditPartForm from "@/components/layouts/parts/editPartForm";
import { withSessionSsr } from "@/lib/auth/withSession";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
      const user = req.session.user;
      const allowedUsers = [
        { role: "Inventory", userType: "Manager"},
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

  const result = await fetch(sparePartsAPI.get_categories)
  const categoryList = await result.json()

  return { props: { 
    categoryList,
    user: {
      data: user,
      isLoggedIn: true 
    }, 
  }}
  
});
  
export default function EditPartsPage({categoryList}) {
  const router = useRouter();
  const { id } = router.query;
  const [submitForm, setSubmitForm] = useState()
  const [initial, setInitial] = useState()
  // const initial = useRef() // initial data
    // Fetch user data
    useEffect(() => {
      fetch("/api/spareparts/" + id, {
          method: "GET",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
          },
      })
          .then((res) => res.json())
          .then((data) => {
            setInitial(data)
          })
          
    }, []);
  // Temp
  const user = {
    firstName: "FirstName",
    role: "Admin"
  };

  function cancel() {
    router.back();
  }

  function headerBreadcrumbs() {
    return (
    <Breadcrumb pt={1}>
      <BreadcrumbItem  >
          <BreadcrumbLink href='/' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Spare Parts</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink fontSize={"lg"}>Edit Item</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )}

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>Edit Item</Text>
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
    <EditPartContext.Provider value={initial}>
      <Grid
        minH="100vh"
        templateColumns={"1fr 7fr"}
        templateRows={"0fr 1fr"}
      >
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user} />
        </GridItem>
        
        <GridItem colStart={2} top={0} position={"sticky"} zIndex={3}>
          <Header breadcrumb={headerBreadcrumbs()} main={headerMain()} withShadow={true} />
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.100"} overflowY={"auto"}>
            <EditPartForm categoryList={categoryList} submitFunc={getSubmit} />
        </GridItem>
      </Grid>
    </EditPartContext.Provider>
  )
}
  
  