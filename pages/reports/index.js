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
  import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteGroup,
    AutoCompleteGroupTitle,
    AutoCompleteTag,
    AutoCompleteCreatable
} from "@choc-ui/chakra-autocomplete";
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
    let joCatData = await joCatRes.json()


    let data = {
        userCategories: userCatData,
        vehicleCategories: vCatData,
        sparePartsCategories: partCatData,
        jobOrderCategories: joCatData,
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
    const [joFilter, setJoFilter] = useState({
      vehicles: [],
      mechanics: []
    })
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
            console.log(data)
            setReportData(data)
            generatePDF("Inventory", convertDataToArray("Inventory", data))
          })

          return state
        }
        case "job order": {
          let query = {
            startDate: startDate,
            endDate: endDate,
            vehicles: joFilter.vehicles,
            mechanics: joFilter.mechanics
          }
          await (fetch(reportAPI.generate_joborder_report, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(query),
          }))
          .then(result => result.json())
          .then(data => {
            console.log(data)
            setReportData(data)
            generatePDF("Job Orders", convertDataToArray("Job Orders", data))          
          })
          return state
        }
        case "purchase order": {
          let query = {
            startDate: startDate,
            endDate: endDate,
          }
          await (fetch(reportAPI.generate_purchaseorder_report, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(query),
          }))
          .then(result => result.json())
          .then(data => {
            console.log(data)
            setReportData(data)
          })
          return state
        }
      }
    })

    function convertDataToArray(type, data) {
      let pdfArr = []

      if (type == "Inventory") {
        data.map(row => {
          let newRow = []

          newRow.push(row.itemNumber)
          newRow.push(row.itemName)
          newRow.push(row.itemModel)
          newRow.push(row.description)
          newRow.push(row.quantity)
          newRow.push(row.totalValue)
          pdfArr.push(newRow)
        })

      }

      else if (type == "Job Orders") {
        data.map(row => {
          let newRow = []
          
          // newRow.push(row.createdAt)
          // newRow.push(row.itemName)
          // newRow.push(row.itemModel)
          // newRow.push(row.description)
          // newRow.push(row.quantity)
          // newRow.push(row.totalValue)
          pdfArr.push(newRow)
        })
      }


      return  pdfArr
    }
    // useEffect(() => {
    //   console.log(reportData)
    // }, [reportData])

    function generatePDF(reportType, arrData) {
      const doc = new jsPDF();
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
        // // Temp category
        // let category = "All"

        doc.setFont("Helvetica", "bold");
        title4 = "FUEL IN REPORT";
        doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
        // doc.text("CATEGORY: " + category, 10, 50,);
        columns = ["DATE & TIME", "QTY", "UNIT COST", "RECORDED BY"]
        data = ["99/99/9999", "Z9", "ZZ,ZZZ.Z9", "XXXXXXXXXX"]
      }
      if (reportType == "Fuel out") {
        // // Temp category
        // let category = "All"

        doc.setFont("Helvetica", "bold");
        title4 = "FUEL CONSUMPTION REPORT";
        doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
        // doc.text("CATEGORY: " + category, 10, 50,);
        columns = ["DATE & TIME", "DRIVER", "PLATE #", "PREVIOUS ROUTE", "QTY", "RECORDED BY"]
        data = ["99/99/9999", "XXXXXXXXXX","XXXXXXX", "XXXXXXXXXX","Z9", "XXXXXXXXXX"]
      } 
      if (reportType == "Inventory") {
        doc.setFont("Helvetica", "bold");
        title4 = "INVENTORY REPORT";
        doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
        // doc.text("CATEGORY: " + category, 10, 50,);
        columns = ["ITEM #", "ITEM", "MODEL", "DESCRIPTION", "QTY", "TOTAL COST"]
        data = arrData
      }
      if (reportType == "Purchase Orders") {
        doc.setFont("Helvetica", "bold");
        title4 = "PURCHASE ORDERS";
        doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
        // doc.text("SUPPLIER: " + category, 10, 50,);
        columns = ["REQUEST DATE", "PO #", "ITEM", "PART #", "QTY", "UNIT COST", "TOTAL COST"]
        data = arrData
      }
      if (reportType == "Job Orders") {
        doc.setFont("Helvetica", "bold");
        title4 = "JOB ORDERS";
        doc.text(title4, doc.internal.pageSize.width / 2, 35, { align: "center" });
        // doc.text("SUPPLIER: " + category, 10, 50,);
        columns = ["ISSUE DATE", "JO #", "PLATE #", "ASSIGNED TO", "DESCRIPTION", "COST"]
        data = arrData
      }
    
        //DATE RANGE
        doc.setFont("Helvetica", "normal");
        const dateRange = startDate + " to " + endDate
        doc.text(dateRange, doc.internal.pageSize.width / 2, 40, { align: "center" });

        //DATE
        doc.autoTable({
          startY: 55,
          head: [columns],
          body: data,
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
                        {/* <option value="Vehicles">Vehicles</option> */}
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
                              <Input type="date" />
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
                              <Input type="date" value={startDate} onChange={() => setStartDate(e.target.value)}/>
                            </FormControl>
                            <FormControl mt={4} isRequired>
                              <FormLabel>End Date:</FormLabel>
                              <Input type="date" value={endDate} onChange={() => setEndDate(e.target.value)} />
                            </FormControl>
                          </Flex>
  
                          <Flex gap={2}>
                            <Button onClick={() => dispatch({type: "purchase order"})}>Generate Report</Button>
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
                              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </FormControl>
                            <FormControl mt={4} isRequired>
                              <FormLabel>End Date:</FormLabel>
                              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </FormControl>
                          </Flex>
  
                          <Flex gap={2}>
                            <FormControl mt={4} >
                              <FormLabel>Plate Number:</FormLabel>
                                <AutoComplete openOnFocus suggestWhenEmpty multiple
                                  value={joFilter.vehicles}
                                  onChange={(vals, items) => {
                                    if (vals.includes("All")) {
                                      setJoFilter((prevState) => ({
                                        ...prevState,
                                        vehicles: "All"
                                      }))
                                    }

                                    else {
                                      setJoFilter((prevState) => ({
                                        ...prevState,
                                        vehicles: vals.filter(v => v != "All")
                                      }))
                                    }
                                  }}
                                >
                                  <AutoCompleteInput variant="outline">
                                    {({ tags }) =>
                                            tags.map((tag, tid) => (
                                                <AutoCompleteTag
                                                key={tid}
                                                label={tag.label}
                                                onRemove={tag.onRemove}
                                                />
                                        ))
                                    }
                                  </AutoCompleteInput>
                                  <AutoCompleteList w={"100%"}>
                                    <AutoCompleteItem
                                      key={"All"}
                                      label={"All Vehicles"}
                                      value={"All"}  
                                    >
                                      <Text fontWeight={"bold"} fontSize={"lg"}>All Vehicles</Text>
                                    </AutoCompleteItem>
                                    {data.jobOrderCategories.vehicles.map((item) => (
                                        <AutoCompleteItem
                                            key={item.plateNumber}
                                            label={item.plateNumber}
                                            value={item}
                                        >
                                          <Flex flexDirection={"column"}>
                                              <Text fontWeight={"bold"}>{item.plateNumber}</Text>
                                              <Text>{item.brandID.name} {item.vehicleTypeID.name}</Text>
                                          </Flex>
                                        </AutoCompleteItem>
                                    ))}
                                  </AutoCompleteList>
                                </AutoComplete>
                            </FormControl>
                           
                            <FormControl mt={4} >
                              <FormLabel>Mechanic:</FormLabel>
                              <AutoComplete openOnFocus suggestWhenEmpty multiple
                                  value={joFilter.mechanics}
                                  onChange={(vals, items) => {
                                    if (vals.includes("All")) {
                                      setJoFilter((prevState) => ({
                                        ...prevState,
                                        mechanics: "All"
                                      }))
                                    }

                                    else {
                                      setJoFilter((prevState) => ({
                                        ...prevState,
                                        mechanics: vals.filter(v => v != "All")
                                      }))
                                    }
                                  }}
                                >
                                  <AutoCompleteInput variant="outline">
                                    {({ tags }) =>
                                            tags.map((tag, tid) => (
                                                <AutoCompleteTag
                                                key={tid}
                                                label={tag.label}
                                                onRemove={tag.onRemove}
                                                />
                                        ))
                                    }
                                  </AutoCompleteInput>
                                  <AutoCompleteList w={"100%"}>
                                    <AutoCompleteItem
                                      key={"All"}
                                      label={"All Mechanics"}
                                      value={"All"}  
                                    >
                                      <Text fontWeight={"bold"} fontSize={"lg"}>All Mechanics</Text>
                                    </AutoCompleteItem>
                                    {data.jobOrderCategories.mechanics.map((item) => (
                                        <AutoCompleteItem
                                            key={item.userID.userID}
                                            label={item.userID.firstName + " " + item.userID.lastName}
                                            value={item}
                                        >
                                          <Flex flexDirection={"column"}>
                                              <Text fontWeight={"bold"}>{item.userID.firstName + " " + item.userID.lastName}</Text>
                                              <Text>{item.specialtyID.name}</Text>
                                          </Flex>
                                        </AutoCompleteItem>
                                    ))}
                                  </AutoCompleteList>
                                </AutoComplete>
                            </FormControl>
                          </Flex>
  
                          <Flex gap={2}>
                            <Button onClick={() => dispatch({type: "job order"})}>Generate Report</Button>
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
  