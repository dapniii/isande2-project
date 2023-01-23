import * as React from "react";
import { 
    Grid, 
    GridItem,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Text,
    Button,
    Flex,
    Image
} from "@chakra-ui/react";
import { SaveButton } from "./buttons";

// TODO: breadcrumb and main will replace the samples in the GridItems
function Header({ breadcrumb, main, withShadow, }) {
    return (
        <Grid
            w={"100%"}
            autoFlow={"row"}
            py={"0.2em"}
            px={"1em"}
            // NOTE: No box shadow if page has tabs
            boxShadow={ withShadow == true ? ("lg") : ("none")}
            
        >
            <GridItem pt={2}>
                {breadcrumb}
            </GridItem>
            <GridItem py={2}> 
                {main}
            </GridItem>
            {/* NOTE: Tabs should be part of main content not header */}
        </Grid>
    )
}

export default Header;

{/* SAMPLE BREADCRUMB FROM CHAKRA */}
{/* 
<Flex justifyContent={"space-between"}>
    <Breadcrumb>
        <BreadcrumbItem>
            <BreadcrumbLink href='/'>Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
            <BreadcrumbLink href='/'>Docs</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href='/'>Breadcrumb</BreadcrumbLink>
        </BreadcrumbItem>
    </Breadcrumb>
<Flex /> 
<Text>{"< Back"}</Text> */}
// TODO: Create custom button for back button

{/* SAMPLE BASIC MAIN CONTENT */}
{/* <Flex justifyContent={"space-between"} alignItems={"center"}>
    <Text fontSize={"3xl"} fontWeight={"bold"}>Page Title</Text>
    <SaveButton title={"Save Changes"} clickFunction={() => console.log("test")} />
</Flex>  */}

{/* SAMPLE COMPLEX MAIN CONTENT */}
{/* <Flex gap={4}>
    <Image 
    borderRadius={"1em"}
    border={"solid"}
    boxSize='9em'
    src='sample.jpg'
    alt='Sample'
    />
    
    <Flex flexDirection={"column"} gap={1}>
        <Text fontSize={"2xl"} fontWeight={"bold"} lineHeight={6}>Item Name</Text>
        <Text>Hello | Hello | Hello</Text>*/}
        {/* TODO: Create custom component for this */}
        {/* <Button 
            border={"solid"}
            borderRadius={"1em"}
            w={"50%"}
            size={"xs"}
        >
            Sample
        </Button>
    </Flex>
</Flex>  */}
