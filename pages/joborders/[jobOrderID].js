import React from 'react'
import { withSessionSsr } from '@/lib/auth/withSession'
import { 
    Grid, 
    GridItem,
    Flex,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Text
} from '@chakra-ui/react';
import Navbar from '@/components/navbar';
import Header from '@/components/header';
import { useRouter } from 'next/router';
import JobOrderMainLayout from '@/components/layouts/joborders/JobOrderLayout/mainLayout';
import { JobOrderContext } from '../../components/layouts/joborders/context';

export const getServerSideProps = withSessionSsr(
    async ({req, res}) => {
        const user = req.session.user;
        const allowedUsers = [
            { role: "Mechanic", userType: "Manager" },
            { role: "Mechanic", userType: "Employee" },
            { role: "Inventory", userType: "Manager" },
            { role: "Inventory", userType: "Employee" },
            { role: "System Admin", userType: "Admin" },
        ]

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
        
        else if (allowedUsers.findIndex(option => 
            option.role == user.role 
            && option.userType == user.userType) == -1) 
          {
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

          return {
            props: { 
              user: {
                data: user,
                isLoggedIn: true 
              }, 

            }
        }
});

function JobOrderDetailsPage({user}) {
    const router = useRouter();
    const { jobOrderID } = router.query
    const [initialData, setInitialData] = React.useState("")

    React.useEffect(() => {
        fetch("/api/joborders/" + jobOrderID, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            setInitialData(data)
        });
    },[jobOrderID])

    function headerBreadcrumbs() {
        return (<>
            <Breadcrumb pt={1}>
                <BreadcrumbItem  >
                    <BreadcrumbLink href='/joborders' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Job Orders</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={"lg"}>#{jobOrderID}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </>)
    }

    function headerMain() {
        if (initialData != null) {
            return (<>

                <Flex flexDirection={"column"}>
                    <Flex gap={1}>
                        <Text fontSize={"3xl"} fontWeight={"bold"}>Job Order:</Text>
                        <Text fontSize={"3xl"}>#{jobOrderID}</Text>
                    </Flex>
                    <Flex gap={1}>
                        <Text fontWeight={"bold"}>Handled by: </Text>
                        {   initialData.mechanics != null ? (
                            initialData.mechanics.map(mech => {
                                return (
                                    <Text>{mech.mechanicID.userID.firstName + " " + mech.mechanicID.userID.lastName}</Text>
                                )
                            })
                        ) : (<></>)}
                    </Flex>
                    <Flex gap={10}>
                        <Flex gap={1}>
                            <Text fontWeight={"bold"}>Issue Date: </Text>
                            <Text>{ initialData.jobOrder != null ? (new Date(initialData.jobOrder.creationDate).toLocaleDateString()) : ("")}</Text>
                        </Flex>
                        <Flex gap={1}>
                            <Text fontWeight={"bold"}>Plate #: </Text>
                            <Text>{ initialData.jobOrder != null ? (initialData.jobOrder.vehicleID.plateNumber) : ("")}</Text>
                        </Flex>
                    </Flex>
                </Flex>

            </>)
        }

    }

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
                    <JobOrderMainLayout user={user.data} initialData={initialData} />
                </GridItem>
            </Grid>            
        </>
    )
}

export default JobOrderDetailsPage