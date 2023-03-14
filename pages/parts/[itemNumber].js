import { useState, useEffect } from "react";
import {
  Grid,
  GridItem,
  Flex,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Image,
  Tabs,
  TabList,
  TabPanels, 
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { BackButton, EditButton, SaveButton, CancelButton } from "@/components/buttons";
import { Router, useRouter } from "next/router";
import { sparePartsAPI } from "@/lib/routes";
import ViewPartLayout from "@/components/layouts/parts/viewPartLayout";
import { qtyStatusIndicator } from "@/components/statusIndicators";

export async function getServerSideProps() {
  const categoryList = {
    brands: [],
    categories: [],
    measures: [],
    status: [],
  }
  
  const res = await fetch(sparePartsAPI.get_categories)
  const data = await res.json()
  
  categoryList.brands = data.brands
  categoryList.categories = data.categories
  categoryList.measures = data.measures
  categoryList.status = data.status
  
  return { props: { categoryList }}
}

export default function ItemDetails({categoryList}) {
  const router = useRouter();
  const { itemNumber, itemName, itemModel } = router.query;

  const [itemInfo, setItemInfo] = useState({
    itemNumber: itemNumber,
    category: "",
    name: itemName,
    model: itemModel,
    rp: "",
    unit: "",
    desc: "",
    photo: "",
    status: "",
    disabled: false,
    detailsArray : [],
  })

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

  // Fetch user data
  useEffect(() => {
    fetch("/api/spareparts/" + itemNumber, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setItemInfo((prevState) => ({
          ...prevState,
          category: data.categoryID.name,
          rp: data.reorderPoint,
          unit: data.unitID.name,
          desc: data.description,
          photo: data.imageID.secure_url,
          status: data.status,
          disabled: data.disabled,
          eoq: data.eoq,
          quantity: data.quantity,
          detailsArray : data.details
        }))  
      });
  }, []);

  // Header Functions
  function cancel() {
    router.back();
  }

  function navToEdit() {
    router.push({
      pathname: "/parts/edit",
      query: {
        id: itemNumber
      }
    })
  }

  function headerBreadcrumbs() {
    return (
      <Flex justifyContent={"space-between"}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/parts">
              <Text as="u" color="#005DF2">
                Spare Parts
              </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>{itemName} { itemModel != "" ? (<>({itemModel})</>) : (<></>)}
            </BreadcrumbLink>
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
        <Flex gap={5}>
          <Image 
            src={itemInfo.photo}
            alt={itemName}
            objectFit={"cover"}
            border={"2px solid gray"}
            borderRadius={"15"}
            w={"8em"}
            h={"8em"}
          />
          <Flex flexDirection={"column"} lineHeight={"1.5"} gap={1} py={1}>
            <Flex gap={5} alignItems={"center"}>
              <Text fontSize={"3xl"} fontWeight={"bold"} lineHeight={"1"}>{itemInfo.name}</Text>
              {qtyStatusIndicator(itemInfo.status)}
            </Flex>
            
            <Text fontSize={"lg"}>{itemInfo.model}</Text>
            <Text 
              w={"7em"}
              py={"0.2"}
              px={"5"} 
              fontWeight={"bold"} 
              bg={"blackAlpha.300"} 
              textAlign={"center"}
              textTransform={"uppercase"} 
              borderRadius={"0.2em"}
            >
                {itemInfo.category}
            </Text>
          </Flex>
        </Flex>
        <Flex alignSelf={"end"}> 
          <EditButton title={"Edit Item"} clickFunction={() => navToEdit()} />
        </Flex>
      </Flex>
    );
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

        <GridItem colStart={2} top={"0"} position={"sticky"} bg={"white"} zIndex={2}>
          <Header
            breadcrumb={headerBreadcrumbs()}
            main={headerMain()}
            withShadow={false}
          />
        </GridItem>

        {/* Main Content */}
        <GridItem colStart={2} bg={"blackAlpha.100"}>
          <Tabs>
            <TabList bg={"white"} top={"12em"} position={"sticky"} zIndex={2} boxShadow={"lg"} mt={-3}> 
                <Tab>General Details</Tab>
                <Tab >Transaction History</Tab>
            </TabList>
            <TabPanels>
              <TabPanel overflowY={"auto"}>
                <ViewPartLayout data={itemInfo} />
              </TabPanel>
              <TabPanel>Transaction History</TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </>
  );
}
