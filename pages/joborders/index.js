import { useState } from "react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { Grid, GridItem, Flex, Text, Button, Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  useDisclosure 
} from "@chakra-ui/react";
import BasicTable from "@/components/table/basicTable";
import { COLUMNS as JO_COLUMNS } from "@/components/layouts/joborders/jobordersColumns";
import { COLUMNS as PREJOB_COLUMNS } from "@/components/layouts/joborders/JobList/jobListColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";
import { withSessionSsr } from '@/lib/auth/withSession';
import CreateJobModal from "@/components/layouts/joborders/JobList/createJobModal";
import JobDetailsModal from "@/components/layouts/joborders/JobList/jobDetailsModal";
import { jobOrderAPI } from "@/lib/routes";

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
      const user = req.session.user;
      let allowedRoles = ["Inventory", "Driver", "Mechanic", "System Admin"]

      if (user == null) {
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
      
      else if (allowedRoles.findIndex(role => role == user.role) == -1) {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props: { user: {
            isLoggedIn: true 
            }, 
          }
        }
      }

      const catResult = await fetch(jobOrderAPI.get_form_categories)
      const categoryData = await catResult.json()

      const jobOrdersRes = await fetch("http://localhost:3000/api/joborders/getJobOrderList")
      const jobOrders = await jobOrdersRes.json()

      return {
          props: { 
            user: {
              data: user,
              isLoggedIn: true 
            }, 
            categoryList: categoryData,
            jobOrders: jobOrders
          }
      }
});

export default function JobOrdersPage({ user, categoryList, jobOrders }) {
  const router = useRouter();
  const [modalData, setModalData] = useState("");
  const createModalOpen = useDisclosure();
  const detailModalOpen = useDisclosure();

  //Add vehicle entry button function
  function navToCreate() {
    router.push("/joborders/create");
  }

  function navToDetails(query) {
    router.push(`/joborders/${query.id}`)
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
        <AddButton title={"Create Job Order"} clickFunction={navToCreate} />
      </Flex>
    );
  }

  // Table Functions
  function getJobOrderRowData(rowData) {
    let query = {
      id: rowData.jobOrderID
    }
    return query
  }

  function joFilters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <Dropdown
          title="Plate Number"
          options={categoryList.vehicles}
          id="plateNumber"
          name="plateNumber"
          filter={filter}
          setFilter={setFilter}
        />
        <Dropdown
          title="Status"
          options={categoryList.jobOrderStatus}
          id="status"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
      </>
    );
  }

  function preJobFilters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <Dropdown
          title="Categories"
          options={categoryList.specialties}
          id="category"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
      </>
    )
  }

  function getJobRowData(rowData) {
    return rowData;
  }

  function handleJobRowClick(rowData) {
    setModalData(rowData)
    detailModalOpen.onOpen();
  }

  return (
    <>
      <Grid minH="100vh" templateColumns={"1fr 7fr"} templateRows={"0fr 1fr"}>
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user.data} />
        </GridItem>

        <GridItem colStart={2} top={0} position={"sticky"} zIndex={2}>
          <Header
            breadcrumb={headerBreadcrumbs()}
            main={headerMain()}
            withShadow={true}
          />
        </GridItem>

        {/* Job Order */}
        <GridItem colStart={2} bg={"blackAlpha.300"} >
          <Tabs>
            <TabList bg={"white"} top={"1em"} position={"sticky"} zIndex={3} boxShadow={"lg"} mt={-3}>
                <Tab>Home</Tab>
                <Tab>Predefined Jobs</Tab>
            </TabList>
            <TabPanels p={2} >
                <TabPanel>
                  <BasicTable 
                    COLUMNS={JO_COLUMNS}
                    DATA={jobOrders}
                    FILTERS={joFilters}
                    HIDDEN={[]}
                    getRowData={getJobOrderRowData}
                    clickRowFunction={navToDetails}
                  />
                </TabPanel>
                <TabPanel display={"flex"} flexDir={"column"} gap={3}>
                    <Flex w={"100%"} justifyContent={"right"}>
                      <AddButton title={"Create Predefined Job"} clickFunction={createModalOpen.onOpen}>Pre-defined jobs go here</AddButton>
                      <CreateJobModal modalOpen={createModalOpen} options={categoryList} />
                    </Flex>

                    <BasicTable 
                      COLUMNS={PREJOB_COLUMNS}
                      DATA={categoryList.jobNames}
                      FILTERS={preJobFilters}
                      HIDDEN={[]}
                      getRowData={getJobRowData}
                      clickRowFunction={handleJobRowClick}
                    />
                    <JobDetailsModal modalOpen={detailModalOpen} data={modalData} />
                </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </>
  );
}
