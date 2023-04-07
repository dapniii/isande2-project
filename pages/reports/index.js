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
import { Router, useRouter } from "next/router";
import { COLUMNS as USERS_COLUMNS } from "@/components/layouts/users/usersColumns";
import { COLUMNS as VEHICLE_COLUMNS } from "@/components/layouts/vehicles/vehicleColumns";
import { COLUMNS as PARTS_COLUMNS } from "@/components/layouts/parts/partsColumns";
import { COLUMNS as FUEL_COLUMNS } from "@/components/layouts/fuel/fuelColumns";
import { COLUMNS as JO_COLUMNS} from "@/components/layouts/joborders/jobordersColumns";
import { COLUMNS as PO_COLUMNS } from "@/components/layouts/purchaseorders/HomeTab/poColumns";
import BasicTable from "@/components/table/basicTable";
import GlobalFilter from "@/components/table/globalFilter";
import Dropdown from "@/components/table/dropdown";
import { userAPI, vehicleAPI, sparePartsAPI, fuelAPI, jobOrderAPI, purchaseOrderAPI } from "@/lib/routes";
import { withSessionSsr } from "@/lib/auth/withSession";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
  const user = req.session.user;
  const allowedUserType = ["Admin"]

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

  else if (allowedUserType.findIndex(type => type == user.userType) == -1) {
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

  //GET USERS DATA
  const resUsers = await fetch(userAPI.get_all_users)
  const userData = await resUsers.json()
  
  const categoryList_User = {
    departments: [],
    roles: [],
    userTypes: [],
    specialties: [],
  }

  const resCat_User = await fetch(userAPI.get_categories)
  const catData_User = await resCat_User.json()

  categoryList_User.departments = catData_User.departments
  categoryList_User.roles = catData_User.roles
  categoryList_User.userTypes = catData_User.userTypes
  categoryList_User.specialties = catData_User.specialties

  //GET VEHICLES DATA
  const vehicleRes = await fetch(vehicleAPI.get_all);
  const vehicleData = await vehicleRes.json();
  console.log("First:" + vehicleData)

  const categoryList_Vehicle = {
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

  const resCat_Vehicle = await fetch(vehicleAPI.get_categories)
  const catData_Vehicle = await resCat_Vehicle.json()

  categoryList_Vehicle.brands = catData_Vehicle.brands
  categoryList_Vehicle.chassis = catData_Vehicle.chassis
  categoryList_Vehicle.engineType = catData_Vehicle.engineType
  categoryList_Vehicle.fuelSensor = catData_Vehicle.fuelSensor
  categoryList_Vehicle.gps = catData_Vehicle.gps
  categoryList_Vehicle.status = catData_Vehicle.status
  categoryList_Vehicle.tireSize = catData_Vehicle.tireSize
  categoryList_Vehicle.transmission = catData_Vehicle.transmission
  categoryList_Vehicle.vehicleTypes = catData_Vehicle.vehicleType
  
  //STORE DATA
  let data = {
    users: userData.users,
    usersCategories: categoryList_User,
    vehicle: vehicleData,
    vehicleCategories: categoryList_Vehicle,
  }
  console.log("After store:" + data.vehicle)

  return { props: { 
    data,             
    user: {
      data: user,
      isLoggedIn: true 
    },  
  }}
});

export default function ReportsPage({user, data}) {
  const router = useRouter();  

  function headerBreadcrumbs() {return (<></>)}

  function headerMain() {
    return (
      //Header Content
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        {/* Page Title */}
        <Text fontSize={"3xl"} fontWeight={"bold"}>Reports</Text>
      </Flex>
    )
  }

  // Table Functions
  function getRowData(rowData) {
    let query = {
      id: rowData.userID
    }
    return query
  }

  function navToDetails(query) {
    
  }

  function userFilters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter
          filter={globalFilter}
          setFilter={setGlobalFilter} 
        />
        <Dropdown 
          title="Roles"
          options={data.usersCategories.roles}
          id="role"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown 
          title="Departments"
          options={data.usersCategories.departments}
          id="department"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown 
          title="User Types"
          options={data.usersCategories.userTypes}
          id="userType"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
      </>
    )
  }

  function vehicleFilters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <Dropdown
          title="Status"
          options={data.vehicleCategories.status}
          id="status"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown
          title="Vehicle Type"
          options={data.vehicleCategories.vehicleTypes}
          id="vehicleType"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown
          title="Transmission"
          options={data.vehicleCategories.transmission}
          id="transmission"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
      </>
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
        {/* Navbar */}
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user.data} />
        </GridItem>
        
        <GridItem colStart={2} top={0} position={"sticky"} zIndex={2}>
          <Header breadcrumb={headerBreadcrumbs()} main={headerMain()} withShadow={false} />
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.300"} >
          <Tabs>
            <TabList bg={"white"} top={"1em"} position={"sticky"} zIndex={2} boxShadow={"lg"} mt={-3}>
              <Tab>Users</Tab>
              <Tab>Vehicles</Tab>
              <Tab>Spare Parts</Tab>
              <Tab>Fuel</Tab>
              <Tab>Job Orders</Tab>
              <Tab>Purhcase Orders</Tab>
            </TabList>
            <TabPanels p={2} overflowY={"auto"}>
              <TabPanel>
                <BasicTable 
                  COLUMNS={USERS_COLUMNS}
                  DATA={data.users.all}
                  FILTERS={userFilters}
                  HIDDEN={["tableName", "specialty"]}
                  getRowData={getRowData}
                  clickRowFunction={navToDetails}
                /> 
              </TabPanel>
              <TabPanel>
                <BasicTable 
                  COLUMNS={VEHICLE_COLUMNS}
                  DATA={data.vehicle}
                  FILTERS={vehicleFilters}
                  HIDDEN={["photo"]}
                  getRowData={getRowData}
                  clickRowFunction={navToDetails}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>       
        </GridItem>
      </Grid>
    </>
  )
}