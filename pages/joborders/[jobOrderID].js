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
import { jobOrderAPI } from '@/lib/routes';
import { BackButton, SaveButton, CancelButton } from '@/components/buttons';
import { joStatusIndicator } from '@/components/statusIndicators';

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

function JobOrderDetailsPage({user, categoryList}) {
    const router = useRouter();
    const { jobOrderID } = router.query
    const [initialData, setInitialData] = React.useState("")
    const [editState, setEditState] = React.useState("")
    const [partsList, setPartsList] = React.useState({
        partsList: [],
        returnList: []
    })

    React.useEffect(() => {
        console.log(partsList)
    })

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

    function cancel() {
        router.back()
    }

    async function submitInvForm() {
        let jobOrderData = {
            jobOrderID: jobOrderID,
            details: partsList,
            inventoryStaffID: user.data.userID
        } 
        await fetch("/api/joborders/transactions/handoverItems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jobOrderData),
        }).then(result => result.json())
        .then(data => {
            console.log(data)
            if (data.error != null) 
                console.log(data.error)
        })
    }

    function headerBreadcrumbs() {
        return (<>
            <Flex justifyContent={"space-between"}>
                <Breadcrumb pt={1}>
                    <BreadcrumbItem  >
                        <BreadcrumbLink href='/joborders' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Job Orders</BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink fontSize={"lg"}>#{jobOrderID}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Flex>
                    <BackButton title={"Back"} clickFunction={cancel} />
                </Flex>
            </Flex>


        </>)
    }

    function headerMain() {
        if (initialData != null) {
            return (<>
                <Flex justifyContent={"space-between"}>
                    <Flex flexDirection={"column"}>
                            <Flex gap={1} alignItems={"center"}>
                                <Text fontSize={"3xl"} fontWeight={"bold"}>Job Order:</Text>
                                <Text fontSize={"3xl"} mr={5}>#{jobOrderID}</Text>
                                { initialData.jobOrder != null ? (joStatusIndicator(initialData.jobOrder.statusID.name)) : (<></>)}
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
                                <Text>{ initialData.jobOrder != null ? (new Date(initialData.jobOrder.createdAt).toLocaleDateString()) : ("")}</Text>
                            </Flex>
                            <Flex gap={1}>
                                <Text fontWeight={"bold"}>Plate #: </Text>
                                <Text>{ initialData.jobOrder != null ? (initialData.jobOrder.vehicleID.plateNumber) : ("")}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex alignItems={"end"}>
                        {user.data.role == "Inventory" ? (<SaveButton title={"Save"} clickFunction={submitInvForm} />) : (<></>)}
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
                    <JobOrderMainLayout 
                        user={user.data} 
                        initialData={initialData} 
                        categoryList={categoryList} 
                        setFormState={setEditState}
                        setSubmitArray={setPartsList}
                    />
                </GridItem>
            </Grid>            
        </>
    )
}

export default JobOrderDetailsPage