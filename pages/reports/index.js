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
  import { useState, useEffect, useReducer } from "react";
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
    reportAPI
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
    } else if (!allowedUserType.includes(user.userType)) {
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
    

    let userCatRes = await fetch(userAPI.get_categories)
    let userCatData = await userCatRes.json()

    let vCatRes = await fetch(vehicleAPI.get_categories)
    let vCatData = await vCatRes.json()

    let partCatRes = await fetch(sparePartsAPI.get_categories)
    let partCatData = await partCatRes.json()

    let joCatRes = await fetch(jobOrderAPI.get_form_categories)


    let data = {
        userCategories: userCatData,
        vehicleCategories: vCatData,
        sparePartsCategories: partCatData,

    }

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
    const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA'))
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString('en-CA'))
    const [invFilter, setInvFilter] = useState("All")
    const [reportData, setReportData] = useState([])

    // Use "reportData" in jspdf

    // Data fetcher 
    const [dataFetcher, dispatch] = useReducer(async (state, action) => {
      switch(action.type) {
        case "inventory": {
          let query = {
            startDate: startDate,
            endDate: endDate,
            category: invFilter,
          }
          await (fetch(reportAPI.generate_inventory_report, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(query),
          }))
          .then(result => result.json())
          .then(data => {
            setReportData(data)
          })

        }
      }
    })

    // Temp show data in console
    useEffect(() => {
      console.log(reportData)
    }, [reportData])

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
                              <Select value={invFilter} onChange={(e) => setInvFilter(e.target.value)}>
                                <option key="all" value="All">All</option>
                                {
                                    data.sparePartsCategories.categories.map(category => {
                                        return (
                                            <option
                                                key={category.pubId}
                                                value={category.name}
                                            >
                                                {category.name}
                                            </option>
                                        );
                                    })
                                }

                              </Select>
                            </FormControl>
                          </Flex>
                          <Flex gap={2}>
                          <FormControl mt={4} isRequired>
                              <FormLabel>Start Date</FormLabel>
                              <Input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                              />
                            </FormControl>
                            <FormControl mt={4} isRequired>
                              <FormLabel>End Date</FormLabel>
                              <Input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                              />
                            </FormControl>
                          </Flex>
                          <Flex gap={2}>
                            <Button onClick={() => dispatch({type: "inventory"})}>Generate Report</Button>
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
  