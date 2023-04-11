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
  Select,
  Button,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { Router, useRouter } from "next/router";
import { COLUMNS as USERS_COLUMNS } from "@/components/layouts/users/usersColumns";
import { COLUMNS as VEHICLE_COLUMNS } from "@/components/layouts/vehicles/vehicleColumns";
import { COLUMNS as PARTS_COLUMNS } from "@/components/layouts/parts/partsColumns";
import { COLUMNS as FUEL_IN_COLUMNS, FUEL_OUT_COLUMNS } from "@/components/layouts/fuel/fuelColumns";
import { COLUMNS as JO_COLUMNS} from "@/components/layouts/joborders/jobordersColumns";
import { COLUMNS as PO_COLUMNS } from "@/components/layouts/purchaseorders/HomeTab/poColumns";
import BasicTable from "@/components/table/basicTable";
import GlobalFilter from "@/components/table/globalFilter";
import Dropdown from "@/components/table/dropdown";
import { userAPI, vehicleAPI, sparePartsAPI, fuelAPI, jobOrderAPI, purchaseOrderAPI } from "@/lib/routes";
import { withSessionSsr } from "@/lib/auth/withSession";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  // for (let key in userData.users) {
  //   console.log("userData.users["+ key + "]: " + userData.users[key]);
  // }

  // for (let user of userData.users.all) {
  //   console.log("user: "+ user);
  // }
  
  

  
  const categoryList_User = {
    departments: [],
    roles: [],
    userTypes: [],
    specialties: [],
  }

  const resUser = await fetch(userAPI.get_categories)
  const catUser = await resUser.json()

  categoryList_User.departments = catUser.departments
  categoryList_User.roles = catUser.roles
  categoryList_User.userTypes = catUser.userTypes
  categoryList_User.specialties = catUser.specialties

  //GET VEHICLES DATA
  const resVehicles = await fetch(vehicleAPI.get_all);
  const vehicleData = await resVehicles.json();

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

  const resVehicle = await fetch(vehicleAPI.get_categories)
  const catVehicle = await resVehicle.json()

  categoryList_Vehicle.brands = catVehicle.brands
  categoryList_Vehicle.chassis = catVehicle.chassis
  categoryList_Vehicle.engineType = catVehicle.engineType
  categoryList_Vehicle.fuelSensor = catVehicle.fuelSensor
  categoryList_Vehicle.gps = catVehicle.gps
  categoryList_Vehicle.status = catVehicle.status
  categoryList_Vehicle.tireSize = catVehicle.tireSize
  categoryList_Vehicle.transmission = catVehicle.transmission
  categoryList_Vehicle.vehicleTypes = catVehicle.vehicleType

  //GET PARTS DATA
  const resParts = await fetch(sparePartsAPI.get_all_parts)
  const partsData = await resParts.json()
  
  const categoryList_Parts = {
    brands: [],
    itemCategories: [],
    measures: [],
  }
  const resPart = await fetch(sparePartsAPI.get_categories)
  const catPart = await resPart.json()

  categoryList_Parts.brands = catPart.brands
  categoryList_Parts.itemCategories = catPart.categories
  categoryList_Parts.measures = catPart.measures
  categoryList_Parts.status = catPart.status

  //GET FUEL IN & OUT DATA
  const [fuelIn, fuelOut] = await Promise.all([
    fetch(fuelAPI.get_fuelIn)
      .then((res) => res.json())
      .then((res) => res.data),
    fetch(fuelAPI.get_fuelOut)
      .then((res) => res.json())
      .then((res) => res.data),
  ]);

  const categoryList_Fuel = {
    refuelType: [{ name: "Refuel Truck" }],
  };

  //GET JO DATA
  const catJobOrder = await fetch(jobOrderAPI.get_form_categories)
  const categoryList_JobOrder = await catJobOrder.json()

  const jobOrdersRes = await fetch("http://localhost:3000/api/joborders/getJobOrderList")
  const jobOrderData = await jobOrdersRes.json()

  //GET PO DATA
  const catPurchaseOrder = await fetch(purchaseOrderAPI.get_form_categories)
  const categoryList_PurchaseOrder = await catPurchaseOrder.json()

  const purchaseOrderRes = await fetch(purchaseOrderAPI.get_purchase_orders)
  const purchaseOrderData = await purchaseOrderRes.json()
  
  //STORE DATA
  let data = {
    users: userData.users,
    usersCategories: categoryList_User,
    vehicle: vehicleData,
    vehicleCategories: categoryList_Vehicle,
    parts: partsData,
    partsCategories: categoryList_Parts,
    fuelIn,
    fuelOut,
    fuelCategories: categoryList_Fuel,
    jobOrders: jobOrderData,
    jobOrderCategories: categoryList_JobOrder,
    purchaseOrders: purchaseOrderData,
    purchaseOrderCategories: categoryList_PurchaseOrder,
  }

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

  function partsFilters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter
          filter={globalFilter}
          setFilter={setGlobalFilter} 
        ></GlobalFilter>
        <Dropdown 
          title="Categories"
          options={data.partsCategories.itemCategories}
          id="categoryID"
          name="name"
          filter={filter}
          setFilter={setFilter}
        ></Dropdown>
        <Dropdown 
          title="Status"
          options={data.partsCategories.status}
          id="status"
          name="name"
          filter={filter}
          setFilter={setFilter}
        ></Dropdown>
      </>
    )
  }

function fuelFilters(filter, setFilter, globalFilter, setGlobalFilter) {
  return
  }

function jobOrderFilters(filter, setFilter, globalFilter, setGlobalFilter) {
  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <Dropdown
        title="Plate Number"
        options={data.jobOrderCategories.vehicles}
        id="plateNumber"
        name="plateNumber"
        filter={filter}
        setFilter={setFilter}
      />
      <Dropdown
        title="Status"
        options={data.jobOrderCategories.jobOrderStatus}
        id="status"
        name="name"
        filter={filter}
        setFilter={setFilter}
      />
    </>
  );
  }

function purchaseOrderFilters(filter, setFilter, globalFilter, setGlobalFilter) {
  return (
    <>
      <GlobalFilter
        filter={globalFilter}
        setFilter={setGlobalFilter} 
      ></GlobalFilter>
      <Dropdown 
        title="Supplier"
        options={data.purchaseOrderCategories.suppliers}
        id="supplier"
        name="name"
        filter={filter}
        setFilter={setFilter}
      ></Dropdown>
        <Dropdown 
        title="Status"
        options={data.purchaseOrderCategories.poStatus}
        id="status"
        name="name"
        filter={filter}
        setFilter={setFilter}
      ></Dropdown>
    </>
  )
  }


  function generatePDF(data, type) {
    const doc = new jsPDF();

    let columnList = []
    let allData = []

    if (type == "users") {
      columnList = ["LASTNAME", "FIRSTNAME", "EMAIL", "PHONENUMBER", "DEPARTMENT", "ROLE", "USERTYPE"];
      data.map(user => {
        let newRow = [];

        newRow.push(user.lastName)
        newRow.push(user.firstName)
        newRow.push(user.email)
        newRow.push(user.phone)
        newRow.push(user.departmentID.name)
        newRow.push(user.roleID.name)
        newRow.push(user.userTypeID.name)
        allData.push(newRow)
      })
    }

    if (type == "vehicles") {
      columnList = ["PLATE NUMBER", "VEHICLE TYPE", "BRAND", "TRANSMISSION", "INSURANCE EXPIRY"];
      data.map(vehicle => {
        let newRow = [];

        newRow.push(vehicle.plateNumber)
        newRow.push(vehicle.vehicleType)
        newRow.push(vehicle.brandID.name)
        newRow.push(vehicle.transmissionID.name)
        newRow.push(vehicle.insuranceExpiry)
        allData.push(newRow)
      })
    }

    if (type == "parts") {
      columnList = ["ITEM CODE", "NAME", "MODEL", "CATEGORY", "CURRENT QTY", "REORDER POINT", "EOQ"];
      data.map(part => {
        let newRow = [];

        newRow.push(part.itemNumber)
        newRow.push(part.itemName)
        newRow.push(part.itemModel)
        newRow.push(part.categoryID.name)
        newRow.push(part.quantity)
        newRow.push(part.reorderPoint)
        newRow.push(part.eoq)
        allData.push(newRow)
      })
    }

    if (type == "fuelIn") {
      columnList = ["DATE & TIME", "QUANTITY", "UNIT COST", "RECORDED BY", ];
      data.map(fuelIn => {
        let newRow = [];

        newRow.push(fuelIn.fRecordDateTime)
        newRow.push(fuelIn.fLiters)
        newRow.push(fuelIn.fUnitCost)
        newRow.push(fuelIn.recordedby)
        allData.push(newRow)
      })
    }

    if (type == "fuelOut") {
      columnList = ["DATE & TIME", "DRIVER", "PLATE NUMBER", "PREVIOUS ROUTE", "QUANTITY", "RECORDED BY", ];
      data.map(fuelOut => {
        let newRow = [];

        newRow.push(fuelOut.oRecordDateTime)
        newRow.push(fuelOut.oDriver)
        newRow.push(fuelOut.oPlateNumber)
        newRow.push(fuelOut.oPreviousRoute)
        newRow.push(fuelOut.ofLiters)
        newRow.push(fuelOut.recordedby)
        allData.push(newRow)
      })
    }

    if (type == "jobOrder") {
      columnList = ["JO NUMBER", "PLATE NUMBER", "ISSUE DATE", "STATUS", "ASSIGNED TO", "COST", ];
      data.map(jobOrder => {
        let newRow = [];

        newRow.push(jobOrder.jobOrderID)
        newRow.push(jobOrder.vehicleID.plateNumber)
        newRow.push(jobOrder.updatedAt)
        newRow.push(jobOrder.statusID.name)
        newRow.push(jobOrder.mechanics)
        newRow.push("null")
        allData.push(newRow)
      })
    }

    if (type == "purchaseOrder") {
      columnList = ["", "SUPPLIER", "ITEMS", "STATUS", "TOTAL COST", ];
      data.map(purchaseOrder => {
        let newRow = [];

        newRow.push(purchaseOrder.index)
        newRow.push(purchaseOrder.supplierID.name)
        newRow.push(purchaseOrder.partsList.length)
        newRow.push(purchaseOrder.statusID.name)
        newRow.push(purchaseOrder.totalCost)
        allData.push(newRow)
      })
    }

    console.log("allData: " + allData);

    doc.autoTable({
      head: [columnList],
      body: allData,
    });

    doc.save("report.pdf")
  }
  console.log("rowData: " + Object.values(data.users.all))
  
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
              <Tab>Fuel In</Tab>
              <Tab>Fuel Out</Tab>
              <Tab>Job Orders</Tab>
              <Tab>Purhcase Orders</Tab>
            </TabList>
            <TabPanels p={2} overflowY={"auto"}>
              {/* Users */}
              <TabPanel>
                <BasicTable 
                  COLUMNS={USERS_COLUMNS}
                  DATA={data.users.all}
                  FILTERS={userFilters}
                  HIDDEN={["tableName", "specialty"]}
                  getRowData={getRowData}
                  clickRowFunction={navToDetails}
                /> 
                <Button onClick={() => generatePDF(data.users.all, "users")}>
                  Generate PDF
                </Button>
              </TabPanel>
              {/* Vehicles */}
              <TabPanel>
                <BasicTable 
                  COLUMNS={VEHICLE_COLUMNS}
                  DATA={data.vehicle}
                  FILTERS={vehicleFilters}
                  HIDDEN={["photo", "status"]}
                  getRowData={getRowData}
                  clickRowFunction={navToDetails}
                />
                <Button onClick={() => generatePDF(data.vehicle, "vehicles")}>
                  Generate PDF
                </Button>
              </TabPanel>
              {/* Spare Parts */}
              <TabPanel>
                <BasicTable 
                  COLUMNS={PARTS_COLUMNS}
                  DATA={data.parts.parts}
                  FILTERS={partsFilters}
                  HIDDEN={["photo", "item", "status"]}
                  getRowData={getRowData}
                  clickRowFunction={navToDetails}
                />
                <Button onClick={() => generatePDF(data.parts.parts, "parts")}>
                  Generate PDF
                </Button>
              </TabPanel>
              {/* Fuel In */}
              <TabPanel>
                <BasicTable 
                  COLUMNS={FUEL_IN_COLUMNS}
                  DATA={data.fuelIn}
                  FILTERS={fuelFilters}
                  HIDDEN={["refuelType"]}
                />
                <Button onClick={() => generatePDF(data.fuelIn, "fuelIn")}>
                  Generate PDF
                </Button>
              </TabPanel>
              {/* Fuel Out */}
              <TabPanel>
                <BasicTable 
                  COLUMNS={FUEL_OUT_COLUMNS}
                  DATA={data.fuelOut}
                  FILTERS={fuelFilters}
                  HIDDEN={["refuelType"]}
                />
                <Button onClick={() => generatePDF(data.fuelOut, "fuelOut")}>
                  Generate PDF
                </Button>
              </TabPanel>
              {/* Job Orders */}
              <TabPanel>
                <BasicTable 
                  COLUMNS={JO_COLUMNS}
                  DATA={data.jobOrders}
                  FILTERS={jobOrderFilters}
                  HIDDEN={[]}
                  getRowData={getRowData}
                  clickRowFunction={navToDetails}
                />
                <Button onClick={() => generatePDF(data.jobOrders, "jobOrder")}>
                  Generate PDF
                </Button>
              </TabPanel>
              {/* Purchase Orders */}
              <TabPanel>
                <BasicTable 
                  COLUMNS={PO_COLUMNS}
                  DATA={data.purchaseOrders.purchaseOrders}
                  FILTERS={purchaseOrderFilters}
                  HIDDEN={[]}
                  getRowData={getRowData}
                  clickRowFunction={navToDetails}
                />
                <Button onClick={() => generatePDF(data.purchaseOrders.purchaseOrders, "purchaseOrder")}>
                  Generate PDF
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>       
        </GridItem>
      </Grid>
    </>
  )
}