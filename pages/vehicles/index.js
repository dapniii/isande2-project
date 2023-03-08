import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { Grid, GridItem, Flex, Text } from "@chakra-ui/react";
import BasicTable from "@/components/table/basicTable";
import { COLUMNS } from "@/components/layouts/vehicles/vehicleColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";

export async function getServerSideProps() {
  const res = await fetch(
    "https://my.api.mockaroo.com/vehicle.json?key=12757c70"
  );
  const vehicleData = await res.json();

  const category = {
    status: [
      { name: "Active" },
      { name: "Inactive" },
      { name: "Traveling" },
      { name: "Repair" },
    ],
    vehicleType: [{ name: "Truck" }],
    transmission: [{ name: "Manual" }, { name: "Automatic" }],
  };

  let data = {
    vehicle: vehicleData,
    categories: category,
  };

  return { props: { data } };
}

export default function VehiclesPage({ data }) {
  const router = useRouter();

  //Temp
  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  //Add vehicle entry button function
  function addNewVehicle() {
    router.push("/vehicles/create");
  }

  function headerBreadcrumbs() {
    return <></>;
  }

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Vehicles
        </Text>
        <AddButton title={"New Vehicle"} clickFunction={addNewVehicle} />
      </Flex>
    );
  }

  function filters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <Dropdown
          title="Status"
          options={data.categories.status}
          id="status"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown
          title="Vehicle Type"
          options={data.categories.vehicleType}
          id="vehicleType"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown
          title="Transmission"
          options={data.categories.transmission}
          id="transmission"
          name="name"
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

        {/* Vehicle Table */}
        <GridItem colStart={2} bg={"blackAlpha.300"} p={2} overflowY={"auto"}>
          <BasicTable
            COLUMNS={COLUMNS}
            DATA={data.vehicle}
            FILTERS={filters}
            HIDDEN={["refuelType"]}
          />
        </GridItem>
      </Grid>
    </>
  );
}
