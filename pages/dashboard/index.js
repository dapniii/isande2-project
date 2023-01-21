import * as React from 'react';
import { Grid, GridItem } from '@chakra-ui/react'
import Navbar from "../components/Navbar/Navbar";

// Dashboard
export default function DashboardPage() {

  const userRole = "Admin"


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
          <Navbar user={userRole} />
        </GridItem>
        
        <GridItem colStart={2}>
          {/* Header */}
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.100"}>
          {/* Main */}
        </GridItem>

      </Grid>
    </>
  )
}
