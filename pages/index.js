import * as React from 'react';
import { Grid, GridItem } from '@chakra-ui/react'
import Navbar from "../components/Navbar/Navbar";

import { AddButton, CancelButton, EditButton, SaveButton } from '@/components/Buttons';

//TEMP INDEX PAGE, SOON TO BE CHANGED FOR SIGNIN PAGE (TENTATIVE)
export default function HomePage() {

  const user = {
    firstName: "FirstName",
    role: "Admin"
  };
  
  function temp() {
    console.log("test function")
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
          {/* Header */}
        </GridItem>

        <GridItem colStart={2} bg={"blackAlpha.100"}>
          {/* Main */}
        </GridItem>

      </Grid>
    </>
  )
}
