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
import CreatePartForm from "@/components/layouts/parts/createPartForm";

export async function getServerSideProps() {
  const categoryList = {
    categories: [],
    brands: [],
    units: [],
    currencies: [],
  };

  // const res = await fetch(sparePartsAPI.get_categories)
  // const data = await res.json()

  return { props: { categoryList } };
}

export default function AddVehiclesPage() {
  const router = useRouter();
  const [submitForm, setSubmitForm] = useState();

  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  function cancel() {
    router.back();
  }

  function headerBreadcrumbs() {
    return (
      <Breadcrumb pt={1}>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            color={"blue"}
            textDecor={"underline"}
            fontSize={"lg"}
          >
            Spare Parts
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink fontSize={"lg"}>New Item</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          New Item
        </Text>
        <ButtonGroup>
          <CancelButton title={"Cancel"} clickFunction={cancel} />
          <SaveButton title={"Save Item"} clickFunction={submitForm} />
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
          <CreatePartForm data={categoryList} submitFunc={getSubmit} />
        </GridItem>
      </Grid>
    </>
  );
}
