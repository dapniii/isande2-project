import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { Grid, GridItem, Flex, Text } from "@chakra-ui/react";
import BasicTable from "@/components/table/basicTable";
import { COLUMNS } from "@/components/layouts/fuel/fuelColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";

//add param {data}
export async function getServerSideProps() {
  const res = await fetch("https://my.api.mockaroo.com/fuel.json?key=98539730");
  const data = await res.json()
  console.log(data);
  return { props: { data } }
  
}

export default function FuelPage({ data }) {
  const router = useRouter();

  //Temp
  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  //Add fuel entry button function
  function addFuelEntry() {
    router.push("/fuel/add-fuel");
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

  function filters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <Dropdown
          title="Refuel Type"
          id="refuelType"
          name="refuelType"
          filter={filter}
          setFilter={setFilter}
        />
      </>
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

        {/* ADD GRAPH */}

        {/* Fuel Data Table */}
        <GridItem colStart={2} bg={"blackAlpha.300"} p={2} overflowY={"auto"}>
          <BasicTable
            COLUMNS={COLUMNS}
            DATA={data}
            FILTERS={filters}
            HIDDEN={["refuelType"]}
          />
        </GridItem>
      </Grid>
    </>
  );
}
