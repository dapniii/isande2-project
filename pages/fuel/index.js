import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { Grid, GridItem, Flex, Text, Button, Icon } from "@chakra-ui/react";
import BasicTable from "@/components/table/basicTable";
import { COLUMNS } from "@/components/layouts/fuel/fuelColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";
import { useDisclosure } from "@chakra-ui/hooks";
import AddFuelEntryForm from "@/components/layouts/fuel/addFuelEntryForm";
import { MdAddCircle } from "react-icons/md";
import { useState } from "react";

/* TODO: FIX DROPDOWN REFUEL TYPE*/
//To be Revised
export async function getServerSideProps() {
  const res = await fetch("https://my.api.mockaroo.com/fuel.json?key=98539730");
  const fuelData = await res.json();

  const category = {
    refuelType: [{ name: "Refuel Truck" }],
  };

  let data = {
    fuel: fuelData,
    categories: category,
  };
  console.log(data.categories.refuelType[0]);
  return { props: { data } };
}
//***************************************************************************************/

export default function FuelPage({ data }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //Temp
  const user = {
    firstName: "FirstName",
    role: "Admin",
  };


  //Add fuel entry button function -OPEN CLOSE FORMS
  const [isFormOpen, setIsFormOpen] = useState(false)

  
  function addFuelEntry() {
    setIsFormOpen(true)
  }
  function closeFuelEntryForm() {
    setIsFormOpen(false)
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
        <AddFuelEntryForm isOpen={isFormOpen} onClose={closeFuelEntryForm} />
      </Flex>
    );
  }

  function filters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <Dropdown
          title="Refuel Tank"
          options={data.categories.refuelType}
          id="refuelType"
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

        {/* ADD GRAPH */}

        {/* Fuel Data Table */}
        <GridItem colStart={2} bg={"blackAlpha.300"} p={2} overflowY={"auto"}>
          <BasicTable
            COLUMNS={COLUMNS}
            DATA={data.fuel}
            FILTERS={filters}
            HIDDEN={["refuelType"]}
          />
        </GridItem>
      </Grid>
    </>
  );
}
