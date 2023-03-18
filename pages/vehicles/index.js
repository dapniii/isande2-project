import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { Grid, GridItem, Flex, Text } from "@chakra-ui/react";
import BasicTable from "@/components/table/basicTable";
import { COLUMNS } from "@/components/layouts/vehicles/vehicleColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";
import { vehicleAPI } from "@/lib/routes";

export async function getServerSideProps() {
  const vehicleRes = await fetch(vehicleAPI.get_all);
  const vehicleData = await vehicleRes.json();

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

  let data = {
    vehicle: vehicleData,
    categories: categoryList,
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
          options={data.categories.vehicleTypes}
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

  // Table Functions
  function getRowData(rowData) {
    let query = {
      id: rowData.plateNumber,
    }

    return query;
  }

  function navToDetails(query) {
    router.push({
      pathname: `/vehicles/${query.id}`,
    })
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
            HIDDEN={[]}
            getRowData={getRowData}
            clickRowFunction={navToDetails}
          />
        </GridItem>
      </Grid>
    </>
  );
}
