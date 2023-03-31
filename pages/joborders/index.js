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
import { COLUMNS } from "@/components/layouts/joborders/jobordersColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";
import { withSessionSsr } from '@/lib/auth/withSession';
import CreateJobModal from "@/components/layouts/joborders/JobList/createJobModal";
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

      const jobOrdersRes = await fetch("/api/joborders/getJobOrderList")
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

export default function JobOrdersPage({ user, categoryList }) {
  const router = useRouter();
  const tempModal = useDisclosure();

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
        <AddButton title={"Create Job Order"} clickFunction={addNewJobOrder} />
      </Flex>
    );
  }

  function filters(filter, setFilter, globalFilter, setGlobalFilter) {
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
                <Tab>Active</Tab>
                <Tab>Predefined Jobs</Tab>
            </TabList>
            <TabPanels p={2} >
                <TabPanel>

                </TabPanel>
                <TabPanel>
                    <Button onClick={tempModal.onOpen}>Pre-defined jobs go here</Button>
                    <CreateJobModal modalOpen={tempModal} options={categoryList} />
                </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </>
  );
}
