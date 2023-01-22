import { 
    Grid,
    GridItem, 
    Flex,
    Text,
    ButtonGroup,
  } from "@chakra-ui/react";
  import Navbar from "@/components/Navbar";
  import Header from "@/components/Header";
  import { SaveButton, CancelButton } from "@/components/Buttons";
  import { Router, useRouter } from "next/router";
  
  export default function CreatePartsPage() {
    const router = useRouter();
  
    // Temp
    const user = {
      firstName: "FirstName",
      role: "Admin"
    };
  
    // Header Functions
    function submitForm() {
      console.log("Save Item");
    }

    function cancel() {
        router.back();
    }
  
    function headerBreadcrumbs() {return (<></>)}
  
    function headerMain() {
      return (
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize={"3xl"} fontWeight={"bold"}>New Item</Text>
          <ButtonGroup>
            <CancelButton title={"Cancel"} clickFunction={cancel} />
            <SaveButton title={"Save Item"} clickFunction={submitForm} />
          </ButtonGroup>
        </Flex>
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
            
          </GridItem>
        </Grid>
      </>
    )
  }
  
  