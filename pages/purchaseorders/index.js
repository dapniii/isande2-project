import { useState } from "react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { Grid, GridItem, Flex, Text, Button, Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  useDisclosure 
} from "@chakra-ui/react";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { withSessionSsr } from "@/lib/auth/withSession";

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

      return {
          props: { 
            user: {
              data: user,
              isLoggedIn: true 
            }, 
          }
      }
});

export default function PurchaseOrdersPage({user}) {
  const [tabIndex, setTabIndex] = useState(0)
  const router = useRouter()

  function navToCreate() {
    router.push("/purchaseorders/create")
  }

  function navToCreateSupplier() {
    router.push("/purchaseorders/createSupplier")
  }
  
  function headerBreadcrumbs() {
    return <></>
  }

  function headerMain() {
    return (      
    <Flex alignItems={"center"} justifyContent={"space-between"}>
      <Text fontSize={"3xl"} fontWeight={"bold"}>
        Purchase Orders
      </Text>
      {
        tabIndex == 0 
          ? (<AddButton title={"Add Purchase Order"} clickFunction={navToCreate} />) 
          : (<AddButton title={"Add Supplier"} clickFunction={navToCreateSupplier} />)
      }
      
    </Flex>)
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
            withShadow={false}
          />
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.300"} >
          <Tabs onChange={(index) => setTabIndex(index)}>
            <TabList bg={"white"} top={"1em"} position={"sticky"} zIndex={3} boxShadow={"lg"} mt={-3}>
                <Tab>Home</Tab>
                <Tab>Suppliers</Tab>
            </TabList>
            <TabPanels p={2} >
                <TabPanel>
                  Home
                </TabPanel>
                <TabPanel>
                  Suppliers
                </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </>
  );
}
