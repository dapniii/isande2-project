import { useState } from "react"
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
import { Router, useRouter } from "next/router";
import { vehicleAPI } from "@/lib/routes";
import EditVehicleForm from "@/components/layouts/vehicles/editVehicleForm";
import { withSessionSsr } from "@/lib/auth/withSession";

export const getServerSideProps = withSessionSsr(
    async ({req, res}) => {
    const user = req.session.user;
    const allowedRoles = ["Mechanic", "System Admin"]
    const allowedUserType = ["Manager", "Admin"]

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
    
    else if (allowedUserType.findIndex(type => type == user.userType) == -1 
    && allowedRoles.findIndex(role => role == user.role) == -1) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
            props: { 
                user: {
                    isLoggedIn: true 
                }, 
            }
        }}

    const result = await fetch(vehicleAPI.get_categories)
    const categoryList = await result.json()
  
    return { 
        props: { 
            categoryList, 
            user: {
                data: user,
                isLoggedIn: true 
            }, 
        } 
    }
});

function EditVehiclesPage({user, categoryList}) {
    const router = useRouter();
    const { plate } = router.query
    const [submitForm, setSubmitForm] = useState()

    function cancel() {
    router.back();
    }

    function headerBreadcrumbs() {
        return (
            <Breadcrumb pt={1}>
            <BreadcrumbItem  >
                <BreadcrumbLink href='/vehicles' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Vehicles</BreadcrumbLink>
            </BreadcrumbItem>
        
            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink fontSize={"lg"}>Edit Vehicle</BreadcrumbLink>
            </BreadcrumbItem>
            </Breadcrumb>
        )
    }

    function headerMain() {
        return (
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text fontSize={"3xl"} fontWeight={"bold"}>Edit Vehicle</Text>
            <ButtonGroup>
              <CancelButton title={"Cancel"} clickFunction={cancel} />
              <SaveButton title={"Save Changes"} clickFunction={submitForm} />
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
            
            <GridItem colStart={2} top={0} position={"sticky"} zIndex={3}>
                <Header breadcrumb={headerBreadcrumbs()} main={headerMain()} withShadow={true} />
            </GridItem>

            <GridItem colStart={2} bg={"blackAlpha.100"} overflowY={"auto"}>
                <EditVehicleForm id={plate} data={categoryList} submitFunc={getSubmit} />
            </GridItem>
        </Grid>
    </>
    )
}

export default EditVehiclesPage