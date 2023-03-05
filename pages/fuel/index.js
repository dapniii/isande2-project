import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { Grid, GridItem, Flex, Text } from "@chakra-ui/react";

//add param {data}
export default function FuelPage() {
  const router = useRouter();

  //Temp
  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  function addFuelEntry() {
    router.push("/fuel/addFuel");
  }

  function headerBreadcrumbs() {
    return <></>;
  }

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Fuel
        </Text>
        <AddButton title={"Add Fuel Entry"} clickFunction={addFuelEntry} />
      </Flex>
    );
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

        {/* ADD GRAPH AND TABLE */}
      </Grid>
    </>
  );
}
