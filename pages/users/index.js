import { 
  Grid,
  GridItem, 
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels, 
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { Router, useRouter } from "next/router";
import { COLUMNS } from "@/components/usersModule/usersColumns";
import BasicTable from "@/components/table/basicTable";
import GlobalFilter from "@/components/table/globalFilter";
import Dropdown from "@/components/table/dropdown";

export async function getServerSideProps() {
  const res = await fetch("https://my.api.mockaroo.com/users.json?key=abdcd8e0")
  const data = await res.json()

  return { props: { data }}
}

export default function UsersPage({data}) {
  const router = useRouter();  

  // Temp
  const user = {
    firstName: "FirstName",
    role: "Admin"
  };

  // Header Functions
  function navToCreate() {
    router.push("/users/create");
  }

  function headerBreadcrumbs() {return (<></>)}

  function headerMain() {
    return (
      //Header Content
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        {/* Page Title */}
        <Text fontSize={"3xl"} fontWeight={"bold"}>Users</Text>
        {/* Add New User Button */}
        <AddButton title={"Add New User"} clickFunction={navToCreate} />
      </Flex>
    )
  }

  function filters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter
          filter={globalFilter}
          setFilter={setGlobalFilter} 
        />
        <Dropdown 
          title="Role"
          id="role"
          name="role"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown 
          title="Department"
          id="department"
          name="department"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown 
          title="User Type"
          id="userType"
          name="userType"
          filter={filter}
          setFilter={setFilter}
        />
      </>
    )
}
  
  // MAIN
  return (
    <>
      <Grid
        minH="100vh"
        templateColumns={"1fr 7fr"}
        templateRows={"0fr 1fr"}
      >
        {/* Navbar */}
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user} />
        </GridItem>
        
        <GridItem colStart={2} top={0} position={"sticky"} zIndex={2}>
          <Header breadcrumb={headerBreadcrumbs()} main={headerMain()} withShadow={true} />
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.300"} p={2} overflowY={"auto"}>
          <BasicTable 
            COLUMNS={COLUMNS}
            DATA={data}
            FILTERS={filters}
            HIDDEN={["name", "role", "department", "userType"]}
          />        
        </GridItem>
      </Grid>
    </>
  )
}

