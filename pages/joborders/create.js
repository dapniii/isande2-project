import { useState, useEffect } from "react";
import { 
    Grid,
    GridItem, 
    Flex,
    Text,
    ButtonGroup,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink
  } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { SaveButton, CancelButton, AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { customAlphabet } from "nanoid";
import numbers from "nanoid-dictionary/numbers";
import CreateJobOrderForm from "@/components/layouts/joborders/CreateJobOrderForm/mainForm";

export async function getServerSideProps() {
    let res = await fetch("http://localhost:3000/api/joborders/getFormCategories")
    let data = await res.json()

    return { props: { data } }
}

export default function JobOrdersPage({ data }) {
    const joLength = 10
    const countJOs = 11
    const currentLength = countJOs.toString().length + 1

    const router = useRouter();
    const nanoid = customAlphabet(numbers, 10)
    const [submitForm, setSubmitForm] = useState();
    const [JONumber, setJONumber] = useState("")
    const [issueDate, setIssueDate] = useState(new Date())
    
    //Temp
    const user = {
        firstName: "FirstName",
        role: "Admin",
    };


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
                    <Navbar user={user} />
                </GridItem>

                <GridItem colStart={2} top={0} position={"sticky"} zIndex={2}>
                    <Header
                    breadcrumb={headerBreadcrumbs()}
                    main={headerMain()}
                    withShadow={true}
                    />
                </GridItem>

                {/* Job Order */}
                <GridItem colStart={2} bg={"blackAlpha.300"} p={2} overflowY={"auto"}>
                    <CreateJobOrderForm data={data} />
                </GridItem>
            </Grid>
        </>
    );
}
