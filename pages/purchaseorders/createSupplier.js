import { useState } from "react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
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
import { CancelButton, SaveButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { withSessionSsr } from "@/lib/auth/withSession";
import CreateSupplierForm from "@/components/layouts/purchaseorders/createSupplierForm";
import { purchaseOrderAPI } from "@/lib/routes";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
      const user = req.session.user;
      let allowedUsers = [
        {role: "System Admin", userType: "Admin"},
        {role: "Purchasing", userType: "Manager"},
        {role: "Purchasing", userType: "Employee"},
        {role: "Inventory", userType: "Manager"},

      ]

      if (user == null) {
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
      
      // If user role and user type not allowed
      else if (allowedUsers.findIndex(option => 
        option.role == user.role 
        && option.userType == user.userType) == -1) {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props: { user: {
            isLoggedIn: true 
            }, 
          }
        }
      }

      const catRes = await fetch(purchaseOrderAPI.get_supplier_categories)
      const catData = await catRes.json()

      return {
          props: { 
            user: {
              data: user,
              isLoggedIn: true 
            }, 
            categoryList: catData
          }
      }
});


function CreateSupplierPage({user, categoryList}) {
    const router = useRouter()
    const [submitForm, setSubmitForm] = useState()

    function getSubmit(submitFunc) {
      setSubmitForm(submitFunc)
    }

    function headerBreadcrumbs() {
        return (
            <Breadcrumb pt={1}>
                <BreadcrumbItem  >
                    <BreadcrumbLink href='/purchaseorders' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Purchase Orders</BreadcrumbLink>
                </BreadcrumbItem>
        
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={"lg"}>Suppliers</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        )
      }
    
      function headerMain() {
        return (      
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text fontSize={"3xl"} fontWeight={"bold"}>
              New Supplier
            </Text>
            <ButtonGroup>
              <CancelButton title={"Cancel"} clickFunction={() => router.back()}/>
              <SaveButton title={"Save"} clickFunction={submitForm} />
            </ButtonGroup>
          </Flex>
        )
      }
    
      return (
        <>
          <Grid minH="100vh" templateColumns={"1fr 7fr"} templateRows={"0fr 1fr"}>
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
    
            <GridItem colStart={2} bg={"blackAlpha.300"} >
                <CreateSupplierForm creatorID={user.data.userID} categoryList={categoryList} submitFunc={getSubmit} />
            </GridItem>
          </Grid>
        </>
      );
}

export default CreateSupplierPage