import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  GridItem,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Select,
  Button,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { Router, useRouter } from "next/router";
import { COLUMNS as USERS_COLUMNS } from "@/components/layouts/users/usersColumns";
import { COLUMNS as VEHICLE_COLUMNS } from "@/components/layouts/vehicles/vehicleColumns";
import { COLUMNS as PARTS_COLUMNS } from "@/components/layouts/parts/partsColumns";
import {
  COLUMNS as FUEL_IN_COLUMNS,
  FUEL_OUT_COLUMNS,
} from "@/components/layouts/fuel/fuelColumns";
import { COLUMNS as JO_COLUMNS } from "@/components/layouts/joborders/jobordersColumns";
import { COLUMNS as PO_COLUMNS } from "@/components/layouts/purchaseorders/HomeTab/poColumns";
import BasicTable from "@/components/table/basicTable";
import GlobalFilter from "@/components/table/globalFilter";
import Dropdown from "@/components/table/dropdown";
import {
  userAPI,
  vehicleAPI,
  sparePartsAPI,
  fuelAPI,
  jobOrderAPI,
  purchaseOrderAPI,
} from "@/lib/routes";
import { withSessionSsr } from "@/lib/auth/withSession";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  const user = req.session.user;
  const allowedUserType = ["Admin"];

  if (user == null) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {
        user: {
          isLoggedIn: false,
        },
      },
    };
  } else if (allowedUserType.findIndex((type) => type == user.userType) == -1) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {
        user: {
          isLoggedIn: true,
        },
      },
    };
  }

  //GET USERS DATA
  const resUsers = await fetch(userAPI.get_all_users);
  const userData = await resUsers.json();

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
  };

  const resUser = await fetch(userAPI.get_categories);
  const catUser = await resUser.json();

  categoryList_User.departments = catUser.departments;
  categoryList_User.roles = catUser.roles;
  categoryList_User.userTypes = catUser.userTypes;
  categoryList_User.specialties = catUser.specialties;

  //GET VEHICLES DATA
  // const resVehicles = await fetch(vehicleAPI.get_all);
  // const vehicleData = await resVehicles.json();

  // const categoryList_Vehicle = {
  //   brands: [],
  //   chassis: [],
  //   engineType: [],
  //   fuelSensor: [],
  //   gps: [],
  //   status: [],
  //   tireSize: [],
  //   transmission: [],
  //   vehicleTypes: []
  // };

  // const resVehicle = await fetch(vehicleAPI.get_categories)
  // const catVehicle = await resVehicle.json()

  // categoryList_Vehicle.brands = catVehicle.brands
  // categoryList_Vehicle.chassis = catVehicle.chassis
  // categoryList_Vehicle.engineType = catVehicle.engineType
  // categoryList_Vehicle.fuelSensor = catVehicle.fuelSensor
  // categoryList_Vehicle.gps = catVehicle.gps
  // categoryList_Vehicle.status = catVehicle.status
  // categoryList_Vehicle.tireSize = catVehicle.tireSize
  // categoryList_Vehicle.transmission = catVehicle.transmission
  // categoryList_Vehicle.vehicleTypes = catVehicle.vehicleType

  // //GET PARTS DATA
  // const resParts = await fetch(sparePartsAPI.get_all_parts)
  // const partsData = await resParts.json()

  // const categoryList_Parts = {
  //   brands: [],
  //   itemCategories: [],
  //   measures: [],
  // }
  // const resPart = await fetch(sparePartsAPI.get_categories)
  // const catPart = await resPart.json()

  // categoryList_Parts.brands = catPart.brands
  // categoryList_Parts.itemCategories = catPart.categories
  // categoryList_Parts.measures = catPart.measures
  // categoryList_Parts.status = catPart.status

  // //GET FUEL IN & OUT DATA
  // const [fuelIn, fuelOut] = await Promise.all([
  //   fetch(fuelAPI.get_fuelIn)
  //     .then((res) => res.json())
  //     .then((res) => res.data),
  //   fetch(fuelAPI.get_fuelOut)
  //     .then((res) => res.json())
  //     .then((res) => res.data),
  // ]);

  // const categoryList_Fuel = {
  //   refuelType: [{ name: "Refuel Truck" }],
  // };

  // //GET JO DATA
  // const catJobOrder = await fetch(jobOrderAPI.get_form_categories)
  // const categoryList_JobOrder = await catJobOrder.json()

  // const jobOrdersRes = await fetch("http://localhost:3000/api/joborders/getJobOrderList")
  // const jobOrderData = await jobOrdersRes.json()

  // //GET PO DATA
  // const catPurchaseOrder = await fetch(purchaseOrderAPI.get_form_categories)
  // const categoryList_PurchaseOrder = await catPurchaseOrder.json()

  // const purchaseOrderRes = await fetch(purchaseOrderAPI.get_purchase_orders)
  // const purchaseOrderData = await purchaseOrderRes.json()

  //STORE DATA
  let data = {
    users: userData.users,
    usersCategories: categoryList_User,
    // vehicle: vehicleData,
    // vehicleCategories: categoryList_Vehicle,
    // parts: partsData,
    // partsCategories: categoryList_Parts,
    // fuelIn,
    // fuelOut,
    // fuelCategories: categoryList_Fuel,
    // jobOrders: jobOrderData,
    // jobOrderCategories: categoryList_JobOrder,
    // purchaseOrders: purchaseOrderData,
    // purchaseOrderCategories: categoryList_PurchaseOrder,
  };

  return {
    props: {
      data,
      user: {
        data: user,
        isLoggedIn: true,
      },
    },
  };
});

export default function ReportsPage({ user, data }) {
  const router = useRouter();

  const [generatedDate, setGeneratedDate] = useState(new Date().toLocaleDateString());
  const [generatedBy, setGeneratedBy] = useState({
    display: user.data.firstName + " " + user.data.lastName,
    data: user.data
  });
  const [reportType, setReportType] = useState("");

  function headerBreadcrumbs() {
    return <></>;
  }

  function headerMain() {
    return (
      //Header Content
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        {/* Page Title */}
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Reports
        </Text>
      </Flex>
    );
  }

  // Table Functions
  function getRowData(rowData) {
    let query = {
      id: rowData.userID,
    };
    return query;
  }

  function navToDetails(query) {}

  function userFilters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
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
    );
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
    );
  }

  function fuelFilters(filter, setFilter, globalFilter, setGlobalFilter) {
    return;
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

  function purchaseOrderFilters(
    filter,
    setFilter,
    globalFilter,
    setGlobalFilter
  ) {
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
    );
  }

  // Use "reportData" in jspdf
  function generatePDF() {
    const doc = new jsPDF();
    //TEMPS
    const category = "All"

    let columns = []
    let data = []

    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");

    doc.text("Date Generated: " + generatedDate, 10, 10);

    const text = "Generated by: " + generatedBy.display;
    const textWidth = doc.getTextWidth(text);
    const pageWidth = doc.internal.pageSize.width;
    const x = pageWidth - textWidth - 10; // 10 is the margin
    doc.text(text, x, 10); // draw the text at (x, 10)

    const title1 = "Milaor Trading Corporation";
    doc.text(title1, doc.internal.pageSize.width / 2, 15, { align: "center" });
    const title2 = "Brgy. San Jose, Milaor, Cam. Sur";
    doc.text(title2, doc.internal.pageSize.width / 2, 20, { align: "center" });
    const title3 = ".Tel 473-64-89";
    doc.text(title3, doc.internal.pageSize.width / 2, 25, { align: "center" });


    let title4 = ""
    if (reportType == "Fuel in") {
      doc.setFont("Helvetica", "bold");
      title4 = "FUEL IN REPORT";
      doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
      // doc.text("CATEGORY: " + category, 10, 50,);
      columns = ["DATE & TIME", "QTY", "UNIT COST", "RECORDED BY"]
      data = ["99/99/9999", "Z9", "ZZ,ZZZ.Z9", "XXXXXXXXXX"]
    }
    if (reportType == "Fuel out") {
      doc.setFont("Helvetica", "bold");
      title4 = "FUEL CONSUMPTION REPORT";
      doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
      doc.text("CATEGORY: " + category, 10, 50,);
      columns = ["DATE & TIME", "DRIVER", "PLATE #", "PREVIOUS ROUTE", "QTY", "RECORDED BY"]
      data = ["99/99/9999", "XXXXXXXXXX","XXXXXXX", "XXXXXXXXXX","Z9", "XXXXXXXXXX"]
    } 
    if (reportType == "Inventory") {
      doc.setFont("Helvetica", "bold");
      title4 = "INVENTORY REPORT";
      doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
      doc.text("CATEGORY: " + category, 10, 50,);
      columns = ["ITEM #", "ITEM", "MODEL", "DESCRIPTION", "QTY", "TOTAL COST"]
      data = ["XXXXXXX", "XXXXXXXXXX","XXXXXXX", "XXXXXXXXXX","Z9", "ZZ,ZZZ.Z9"]
    }
    if (reportType == "Purchase Orders") {
      doc.setFont("Helvetica", "bold");
      title4 = "PURCHASE ORDERS";
      doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
      doc.text("SUPPLIER: " + category, 10, 50,);
      columns = ["REQUEST DATE", "PO #", "ITEM", "PART #", "QTY", "UNIT COST", "TOTAL COST"]
      data = ["99/99/9999", "XXXXXXXXXX","XXXXXXX", "XXXXXXXXXX","Z9", "ZZ,ZZZ.Z9", "ZZ,ZZZ.Z9"]
    }
    //JOB ORDER: VEHICLE
    // if (reportType == "JOB ORDERS") {
    //   doc.setFont("Helvetica", "bold");
    //   title4 = "JOB ORDERS";
    //   doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
    //   doc.text("VEHICLE: " + category, 10, 50,);
    //   columns = ["ISSUE DATE", "JO #", "ASSIGNED TO", "DESCRIPTION", "COST"]
    // }
    //JOB ORDER: MECHANIC
    // if (reportType == "JOB ORDERS") {
    //   doc.setFont("Helvetica", "bold");
    //   title4 = "JOB ORDERS";
    //   doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
    //   doc.text("MECHANIC: " + category, 10, 50,);
    //   columns = ["ISSUE DATE", "JO #", "PLATE #", "DESCRIPTION", "COST"]
    // }
    if (reportType == "Job Orders") {
      doc.setFont("Helvetica", "bold");
      title4 = "JOB ORDERS";
      doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
      // doc.text("SUPPLIER: " + category, 10, 50,);
      columns = ["ISSUE DATE", "JO #", "PLATE #", "ASSIGNED TO", "DESCRIPTION", "COST"]
      data = ["99/99/9999", "XXXXXXXXXX","XXXXXXX", "XXXXXXXXXX","XXXXXXXXXX", "ZZ,ZZZ.Z9"]
    }

    //DATE RANGE
    doc.setFont("Helvetica", "normal");
    const dateRange = startDate + " to " + endDate
    doc.text(dateRange, doc.internal.pageSize.width / 2, 40, { align: "center" });

    //DATE
    doc.autoTable({
      startY: 55,
      head: [columns],
      body: [data],
    });

    //PAGE NUMBER
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
    }

    // Save the PDF document
    doc.save("my-report.pdf");
  }
  console.log("rowData: " + Object.values(data.users.all));

  // MAIN
  return (
    <>
      <Grid minH="100vh" templateColumns={"1fr 7fr"} templateRows={"0fr 1fr"}>
        {/* Navbar */}
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user.data} />
        </GridItem>

        <GridItem colStart={2} top={0} position={"sticky"} zIndex={2}>
          <Header
            breadcrumb={headerBreadcrumbs()}
            main={headerMain()}
            withShadow={false}
          />
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.100"} overflowY={"auto"}>
          <Grid templateColumns={"1fr 1.2fr"} px={2} py={5} gap={2}>
            <GridItem>
              <Card variant={"outline"}>
                <CardHeader>
                  <Text fontSize={"xl"} fontWeight={"bold"}>
                    Report Type
                  </Text>
                </CardHeader>
                <Divider />
                <CardBody>
                  <FormControl>
                    <FormLabel>Generated on:</FormLabel>
                    <Input
                      value={generatedDate}
                      // onChange={(e) => setGeneratedAt(e.target.value)}

                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Generated by:</FormLabel>
                    <Input
                      value={generatedBy.display}
                      // onChange={(e) => setGeneratedBy(e.target.value)}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Report Type:</FormLabel>
                    <Select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="" hidden disabled>
                        Select Report Type
                      </option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Fuel in">Fuel in</option>
                      <option value="Fuel out">Fuel out</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Job Orders">Job Orders</option>
                      <option value="Purchase Orders">Purchase Orders</option>
                    </Select>
                  </FormControl>
                </CardBody>
              </Card>
            </GridItem>
            {reportType === "Inventory" && (
              <>
                <GridItem>
                  <Card variant={"outline"}>
                    <CardHeader>
                      <Text fontSize={"xl"} fontWeight={"bold"}>
                        Generate Inventory Report Form
                      </Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <Stack>
                        <Flex gap={2}>
                          <FormControl >
                            <FormLabel>All Items:</FormLabel>
                            <Switch id="" />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Item Category:</FormLabel>
                            <Select placeholder="Select Item Category">
                              <option value="Vehicles">Vehicles</option>
                              <option value="Fuel in">Fuel in</option>
                            </Select>
                          </FormControl>
                        </Flex>
                        <Flex gap={2}>
                        <FormControl mt={4} isRequired>
                            <FormLabel>Start Date</FormLabel>
                            <Input type="date" />
                          </FormControl>
                          <FormControl mt={4} isRequired>
                            <FormLabel>End Date</FormLabel>
                            <Input type="date" />
                          </FormControl>
                        </Flex>
                        <Flex gap={2}>
                          <Button>Generate Report</Button>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                </GridItem>
              </>
            )}
            {reportType === "Fuel in" && (
              <>
                <GridItem>
                  <Card variant={"outline"}>
                    <CardHeader>
                      <Text fontSize={"xl"} fontWeight={"bold"}>
                        Generate Fuel In Report Form
                      </Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <Stack>
                        <Flex gap={2}>
                          <FormControl mt={4} isRequired>
                            <FormLabel>Start Date:</FormLabel>
                            <Input type="datetime-local" />
                          </FormControl>
                          <FormControl mt={4} isRequired>
                            <FormLabel>End Date:</FormLabel>
                            <Input type="datetime-local" />
                          </FormControl>
                        </Flex>

                        <Flex gap={2} mt={4}>
                          <Button>Generate Report</Button>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                </GridItem>
              </>
            )}
            {reportType === "Fuel out" && (
              <>
                <GridItem>
                  <Card variant={"outline"}>
                    <CardHeader>
                      <Text fontSize={"xl"} fontWeight={"bold"}>
                        Generate Fuel Out Report Form
                      </Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <Stack>
                      <Flex gap={2}>
                          <FormControl mt={4} >
                            <FormLabel>Plate Number:</FormLabel>
                            <Select>
                              <option value="Vehicles">Vehicles</option>
                              <option value="Fuel in">Fuel in</option>
                            </Select>
                          </FormControl>
                          <Text mt={10}>or</Text>
                          <FormControl mt={4}>
                            <FormLabel>Driver:</FormLabel>
                            <Select>
                              <option value="Vehicles">Vehicles</option>
                              <option value="Fuel in">Fuel in</option>
                            </Select>
                          </FormControl>
                        </Flex>

                        <Flex gap={2}>
                          <FormControl mt={4} isRequired>
                            <FormLabel>Start Date:</FormLabel>
                            <Input type="datetime-local" />
                          </FormControl>
                          <FormControl mt={4} isRequired>
                            <FormLabel>End Date:</FormLabel>
                            <Input type="datetime-local" />
                          </FormControl>
                        </Flex>

                        <Flex gap={2}>
                          <Button>Generate Report</Button>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                </GridItem>
              </>
            )}
            {reportType === "Purchase Orders" && (
              <>
                <GridItem>
                  <Card variant={"outline"}>
                    <CardHeader>
                      <Text fontSize={"xl"} fontWeight={"bold"}>
                        Generate Purchase Order Report Form
                      </Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <Stack>
    
                        <Flex gap={2}>
                          <FormControl mt={4} isRequired>
                            <FormLabel>Start Date:</FormLabel>
                            <Input type="datetime-local" />
                          </FormControl>
                          <FormControl mt={4} isRequired>
                            <FormLabel>End Date:</FormLabel>
                            <Input type="datetime-local" />
                          </FormControl>
                        </Flex>

                        <Flex gap={2}>
                          <Button>Generate Report</Button>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                </GridItem>
              </>
            )}
            {reportType === "Job Orders" && (
              <>
                <GridItem>
                  <Card variant={"outline"}>
                    <CardHeader>
                      <Text fontSize={"xl"} fontWeight={"bold"}>
                        Generate Job Order Report Form
                      </Text>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <Stack>

                        <Flex gap={2}>
                          <FormControl mt={4} isRequired>
                            <FormLabel>Start Date:</FormLabel>
                            <Input type="datetime-local" />
                          </FormControl>
                          <FormControl mt={4} isRequired>
                            <FormLabel>End Date:</FormLabel>
                            <Input type="datetime-local" />
                          </FormControl>
                        </Flex>

                        <Flex gap={2}>
                          <FormControl mt={4} >
                            <FormLabel>Plate Number:</FormLabel>
                            <Select>
                              <option value="Vehicles">Vehicles</option>
                              <option value="Fuel in">Fuel in</option>
                            </Select>
                          </FormControl>
                         
                          <FormControl mt={4} >
                            <FormLabel>Mechanic:</FormLabel>
                            <Select>
                              <option value="Vehicles">Vehicles</option>
                              <option value="Fuel in">Fuel in</option>
                            </Select>
                          </FormControl>
                        </Flex>

                        <Flex gap={2}>
                          <Button>Generate Report</Button>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                </GridItem>
              </>
            )}
          </Grid>
        </GridItem>
      </Grid>
    </>
  );
}
