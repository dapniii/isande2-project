import {
  Grid,
  GridItem,
  Flex,
  Text,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { SaveButton, CancelButton } from "@/components/buttons";
import { useState } from "react";
import { Router, useRouter } from "next/router";
import { vehicleAPI } from "@/lib/routes";
import CreateVehicleForm from "@/components/layouts/vehicles/createVehicleForm";

export async function getServerSideProps() {
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

  const res = await fetch(vehicleAPI.get_categories)
  const data = await res.json()

  categoryList.brands = data.brands
  categoryList.chassis = data.chassis
  categoryList.engineType = data.engineType
  categoryList.fuelSensor = data.fuelSensor
  categoryList.gps = data.gps
  categoryList.status = data.status
  categoryList.tireSize = data.tireSize
  categoryList.transmission = data.transmission
  categoryList.vehicleTypes = data.vehicleType

  return { props: { categoryList } };
}

export default function AddVehiclesPage({categoryList}) {
  const router = useRouter();
  const [submitForm, setSubmitForm] = useState();

  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  function cancel() {
    router.back();
  }

  function getSubmit(func) {
    setSubmitForm(func)
  }

  function headerBreadcrumbs() {
    return (
      <Breadcrumb pt={1}>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/vehicles"
            color={"blue"}
            textDecor={"underline"}
            fontSize={"lg"}
          >
            Vehicles
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink fontSize={"lg"}>New Vehicle</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          New Vehicle
        </Text>
        <ButtonGroup>
          <CancelButton title={"Cancel"} clickFunction={cancel} />
          <SaveButton title={"Save Vehicle"} clickFunction={submitForm} />
        </ButtonGroup>
      </Flex>
    );
  }

  function getSubmit(func) {
    setSubmitForm(func);
  }

  return (
    <>
      <Grid minH="100vh" templateColumns={"1fr 7fr"} templateRows={"0fr 1fr"}>
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

        <GridItem colStart={2} bg={"blackAlpha.100"} overflowY={"auto"}>
          <CreateVehicleForm data={categoryList} submitFunc={getSubmit} />
        </GridItem>
      </Grid>
    </>
  );
}
