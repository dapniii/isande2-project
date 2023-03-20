import { useState, useEffect } from 'react';
import { Grid, GridItem,     
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Button,
  Flex, } from '@chakra-ui/react'
import Navbar from "../components/navbar";
import Header from '@/components/header';
import { SaveButton } from '@/components/buttons'; // Temp
import getSessionUser from '@/lib/auth/getSessionUser';
import { useRouter } from 'next/router';

//TEMP INDEX PAGE, SOON TO BE CHANGED FOR SIGNIN PAGE (TENTATIVE)
export default function HomePage() {
  const [user, setUser] = useState("")
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/getUser", {
      method: "GET",
      headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
    })
      .then((res) => res.json())
      .then((user) => {
        if (!user.isLoggedIn)
          router.replace("/login")
        else
          setUser(user.data)
      })
    
  }, [])

  const user2 = {
    firstName: "FirstName",
    role: "Admin"
  };

  function test() {
    console.log("test")
  }
  
  // Sample how to pass header components as props
  // QUESTION: Should it be in a separate file nalang?
  function headerBreadcrumbs() {
    return (
      <Breadcrumb>
        <BreadcrumbItem>
            <BreadcrumbLink href='#'>Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
            <BreadcrumbLink href='#'>Docs</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='#'>Breadcrumb</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    )
  }

  function headerMain() {
    return (
      <>
        {/* SAMPLE BASIC CONTENT */}
        <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize={"3xl"} fontWeight={"bold"}>Page Title</Text>
            <SaveButton title={"Save Changes"} clickFunction={test} />
        </Flex>
      </>

    )
  }

  // MAIN
  return (
    <>
      <Grid
        minH="100vh"
        templateColumns={"1fr 7fr"}
        templateRows={"0fr 1fr"}
        overflowY={"auto"}
      >
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user} />
        </GridItem>
        
        <GridItem colStart={2}>
          <Header breadcrumb={headerBreadcrumbs()} main={headerMain()} withShadow={true} />
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.100"}>
          {/* Main */}
        </GridItem>

      </Grid>
    </>
  )
}
