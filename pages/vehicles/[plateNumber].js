import { useState, useEffect } from "react";
import {
    Grid,
    GridItem,
    Flex,
    Text,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Tabs,
    TabList,
    TabPanels, 
    TabPanel,
    Tab,
    Image,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { BackButton, EditButton, SaveButton, CancelButton } from "@/components/buttons";
import { vehicleStatusIndicator } from "@/components/statusIndicators";
import { Router, useRouter } from "next/router";
import { vehicleAPI } from "@/lib/routes";
import { addCommasToNum } from "@/lib/dataHandler";
import ViewVehicleLayout from "@/components/layouts/vehicles/viewVehicleLayout";
import { withSessionSsr } from "@/lib/auth/withSession";
import VehicleServiceHistoryTab from "@/components/layouts/vehicles/serviceHistoryTab";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;
    const allowedRoles = ["Mechanic", "Driver", "System Admin"]

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

    else if (allowedRoles.findIndex(role => role == user.role) == -1) {
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
        brands: [],
        chassis: [],
        engineType: [],
        fuelSensor: [],
        gps: [],
        status: [],
        tireSize: [],
        transmission: [],
        vehicleTypes: []
    };

    const catRes = await fetch(vehicleAPI.get_categories)
    const catData = await catRes.json()
  
    categoryList.brands = catData.brands
    categoryList.chassis = catData.chassis
    categoryList.engineType = catData.engineType
    categoryList.fuelSensor = catData.fuelSensor
    categoryList.gps = catData.gps
    categoryList.status = catData.status
    categoryList.tireSize = catData.tireSize
    categoryList.transmission = catData.transmission
    categoryList.vehicleTypes = catData.vehicleType

    return { props: { 
      categoryList,
      user: {
        data: user,
        isLoggedIn: true 
      }, 
    }}
});

export default function VehicleDetails({user, categoryList}) {
    const router = useRouter();
    const { plateNumber } = router.query

    const [vehicleInfo, setVehicleInfo] = useState({
        plateNumber: plateNumber,
        photo: "",
        vehicleType: "",
        brand: "",
        manufacturingYear: "",
        transmission: "",
        model: "",
        engineNumber: "",
        engineType: "",
        chassis: "",
        tireSize: "",
        insuranceAmount: "",
        expiry: "",
        preventive: "",
        gps: "",
        fuelSensor: "",
        status: "",
        disabled: false,
      })

    // Fetch data
    useEffect(() => {
        fetch("/api/vehicles/" + plateNumber, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        })
        .then((res) => res.json())
        .then((data) => {
            setVehicleInfo((prevState) => ({
            ...prevState,
            photo: data.imageID.secure_url,
            vehicleType: data.vehicleTypeID.name,
            brand: data.brandID.name,
            manufacturingYear: data.manufactureYear,
            transmission: data.transmissionID.name,
            model: data.model,
            engineNumber: data.engineNumber,
            engineType: data.engineTypeID.name,
            chassis: data.chassisTypeID.name,
            tireSize: data.tireSizeID.name,
            insuranceAmount: addCommasToNum(parseFloat(data.insuranceAmount.$numberDecimal)),
            expiry: new Date(data.insuranceExpiry).toLocaleDateString(),
            preventive: data.preventive,
            gps: data.gpsID.name,
            fuelSensor: data.fuelSensorID.name,
            status: data.vehicleStatusID.name,
            disabled: data.disabled,
            serviceHistory: data.serviceHistory
            }))  
        });
    }, []);

    useEffect(() => {
      console.log(vehicleInfo.serviceHistory)
    })

    function cancel() {
        router.back()
    }

    function headerBreadcrumbs() {
        return (
          <Flex justifyContent={"space-between"}>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink href="/vehicles">
                  <Text as="u" color="#005DF2">
                    Vehicles
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>{plateNumber}</BreadcrumbLink>
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
                src={vehicleInfo.photo}
                alt={vehicleInfo.plateNumber}
                objectFit={"cover"}
                border={"2px solid gray"}
                borderRadius={"15"}
                w={"8em"}
                h={"8em"}
              />
              <Flex flexDirection={"column"} lineHeight={"1.5"} gap={1} py={1}>
                <Text fontSize={"3xl"} fontWeight={"bold"} lineHeight={"1"}>{vehicleInfo.plateNumber}</Text>
                <Flex gap={2}>
                    <Text fontSize={"xl"} >{vehicleInfo.vehicleType} | {vehicleInfo.brand} | {vehicleInfo.transmission}</Text>
                </Flex>
                {vehicleStatusIndicator(vehicleInfo.status)}
              </Flex>
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
              <Navbar user={user.data} />
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
                    <Tab>Overview</Tab>
                    <Tab >Service History</Tab>
                    <Tab >Fuel History</Tab>
                    <Tab >Cost History</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel overflowY={"auto"}>
                    <ViewVehicleLayout data={vehicleInfo} />
                  </TabPanel>
                  <TabPanel>
                  {
                    vehicleInfo.serviceHistory != null ? (<VehicleServiceHistoryTab data={vehicleInfo.serviceHistory} />
                    ) : (<></>)
                  }
                  </TabPanel>
                  <TabPanel>Fuel History</TabPanel>
                  <TabPanel>Cost History</TabPanel>
                </TabPanels>
              </Tabs>
            </GridItem>
          </Grid>
        </>
      );
}