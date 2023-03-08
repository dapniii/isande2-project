import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { Grid, GridItem, Flex, Text } from "@chakra-ui/react";
import BasicTable from "@/components/table/basicTable";
import { COLUMNS } from "@/components/layouts/joborders/jobordersColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";

export async function getServerSideProps() {
  const res = await fetch(
    "https://my.api.mockaroo.com/joborders.json?key=12757c70"
  );
  const jobOrderData = await res.json();

  const category = {
    plateNumber: [{ name: 'PlateNumber' }],
    status: [
      { name: "Active" },
      { name: "Inactive" },
      { name: "Traveling" },
      { name: "Repair" },
    ],
  };

  let data = {
    jobOrder: jobOrderData,
    categories: category,
  };

  return { props: { data } };
}

export default function JobOrdersPage({ data }) {
  const router = useRouter();

  //Temp
  const user = {
    firstName: "FirstName",
    role: "Admin",
  };

  //Add vehicle entry button function
  function addNewJobOrder() {
    router.push("/joborders/create");
  }

  function headerBreadcrumbs() {
    return <></>;
  }

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Job Orders
        </Text>
      </Flex>
    );
  }

  function filters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <Dropdown
          title="Plate #"
          options={data.categories.plateNumber}
          id="plateNumber"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown
          title="Status"
          options={data.categories.status}
          id="status"
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

        {/* Job Order */}
        <GridItem colStart={2} bg={"blackAlpha.300"} p={2} overflowY={"auto"}>
          <BasicTable
            COLUMNS={COLUMNS}
            DATA={data.jobOrder}
            FILTERS={filters}
            HIDDEN={["refuelType"]}
          />
        </GridItem>
      </Grid>
    </>
  );
}
