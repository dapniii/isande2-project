import { useState, useEffect } from "react";
import { 
    Grid,
    GridItem, 
    Flex,
    Text,
    ButtonGroup,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    useDisclosure,
    Button
  } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { SaveButton, CancelButton, AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import CreateJobOrderForm from "@/components/layouts/joborders/JobOrderForm/mainForm";
import { withSessionSsr } from "@/lib/auth/withSession";
import { jobOrderAPI } from "@/lib/routes";
import CreateJobModal from "@/components/layouts/joborders/JobList/createJobModal";

export const getServerSideProps = withSessionSsr(
    async ({req, res}) => {
        const user = req.session.user;
  
        if (user == null) {
          return {
            redirect: {
              permanent: false,
              destination: "/login",
            },
            props: { user: {
              data: user,
              isLoggedIn: false 
              }, 
            }
          }
        }
  
        const result = await fetch(jobOrderAPI.get_form_categories)
        const data = await result.json()
  
        return {
            props: { 
              user: {
                data: user,
                isLoggedIn: true 
              }, 
              categoryList: data
            }
        }
  });

export default function JobOrdersPage({ user, categoryList }) {
    const joLength = 10
    const countJOs = 11
    const currentLength = countJOs.toString().length + 1

    const router = useRouter();
    const [submitForm, setSubmitForm] = useState();
    const [JONumber, setJONumber] = useState("")
    const [issueDate, setIssueDate] = useState(new Date())
    const tempModal = useDisclosure()

    // Do on render
    useEffect(() => {
        setJONumber(String(countJOs).padStart(9, "0").padStart(10,"1"))
    }, [])

    function cancel() {
        router.back()
    }

    function headerBreadcrumbs() {
        return ( 
            <Breadcrumb pt={1}>
                <BreadcrumbItem  >
                    <BreadcrumbLink href='/joborders' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Job Orders</BreadcrumbLink>
                </BreadcrumbItem>
        
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={"lg"}>New Job Order</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        )
    }

    function headerMain() {
        return (
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                {/* Left Side */}
                <Flex flexDirection={"column"}>
                    <Flex gap={1}>
                        <Text fontSize={"3xl"} fontWeight={"bold"}>New Job Order:</Text>
                        <Text fontSize={"3xl"}>#{JONumber}</Text>
                    </Flex>
                    <Flex gap={1}>
                        <Text fontWeight={"bold"}>Issue Date: </Text>
                        <Text>{issueDate.toLocaleDateString()}</Text>
                    </Flex>
                </Flex>
                {/* Right Side Buttons*/}
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <ButtonGroup>
                        <CancelButton title={"Cancel"} clickFunction={cancel} />
                        <AddButton title={"Post Job Order"} clickFunction={submitForm} />
                    </ButtonGroup>
                </Flex>

            </Flex>
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
                        withShadow={false}
                    />
                </GridItem>

                {/* Job Order */}
                <GridItem colStart={2} bg={"blackAlpha.300"}>
                    <Tabs>
                        <TabList bg={"white"} top={"7.4em"} position={"sticky"} zIndex={3} boxShadow={"lg"} mt={-3}>
                            <Tab>Form</Tab>
                            <Tab>Job List</Tab>
                        </TabList>
                        <TabPanels p={2} >
                            <TabPanel><CreateJobOrderForm data={categoryList} /></TabPanel>
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
