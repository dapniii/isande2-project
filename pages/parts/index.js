import { 
  Grid,
  GridItem, 
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels, 
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { Router, useRouter } from "next/router";
import PartsHomeTab from "@/components/parts/homeTab";

export default function PartsPage() {
  const router = useRouter();

  // Temp
  const user = {
    firstName: "FirstName",
    role: "Admin"
  };

  // Header Functions
  function navToCreate() {
    router.push("/parts/create");
  }

  function headerBreadcrumbs() {return (<></>)}

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>Spare Parts</Text>
        <AddButton title={"Add New Item"} clickFunction={navToCreate} />
      </Flex>
    )
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
          <Header breadcrumb={headerBreadcrumbs()} main={headerMain()} withShadow={false} />
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.100"}>
          <Tabs>
            <TabList bg={"white"} position={"sticky"} zIndex={2} boxShadow={"lg"} mt={-3}> 
                <Tab>Home</Tab>
                <Tab >Bulk Manage Parts</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <PartsHomeTab />
              </TabPanel>
              <TabPanel>Bulk Manage Parts</TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </>
  )
}

