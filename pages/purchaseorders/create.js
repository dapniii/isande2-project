import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { withSessionSsr } from '@/lib/auth/withSession';
import Navbar from '@/components/navbar';
import Header from '@/components/header';
import { 
  Grid, 
  GridItem, 
  Flex, 
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup
} from "@chakra-ui/react";
import { purchaseOrderAPI } from '@/lib/routes';
import { SaveButton, CancelButton } from '@/components/buttons';
import CreatePurchaseOrderForm from '@/components/layouts/purchaseorders/PurchaseOrderForm/createPurchaseOrderForm';

export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
      const user = req.session.user;
      let allowedUsers = [
        {role: "System Admin", userType: "Admin"},
        {role: "Purchasing", userType: "Manager"},
        {role: "Purchasing", userType: "Employee"},
        {role: "Inventory", userType: "Manager"},

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
      
      // If user role and user type not allowed
      else if (allowedUsers.findIndex(option => 
        option.role == user.role 
        && option.userType == user.userType) == -1) {
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

      const catRes = await fetch(purchaseOrderAPI.get_form_categories)
      const catData = await catRes.json()

      return {
          props: { 
            user: {
              data: user,
              isLoggedIn: true 
            }, 
            categoryList: catData,
          },
          
      }
});

function CreatePurchaseOrderPage({user, categoryList}) {
  const router = useRouter();
  const [issueDate, setIssueDate] = useState(new Date());
  const [submitForm, setSubmitForm] = useState();

  function getSubmit(submitFunc) {
    setSubmitForm(submitFunc)
  }

  function headerBreadcrumbs() {
    return (
      <Breadcrumb pt={1}>
        <BreadcrumbItem  >
            <BreadcrumbLink href='/purchaseorders' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Purchase Orders</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontSize={"lg"}>New Purchase Order</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    )
  }

  function headerMain() {
    return (      
      // Main container
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        {/* Left side */}
        <Flex flexDir={"column"}>
          <Text fontSize={"3xl"} fontWeight={"bold"}>New Purchase Order</Text>
          <Flex gap={2}>
            <Text fontWeight={"semibold"}>Issue Date:</Text>
            <Text>{issueDate.toLocaleDateString()}</Text>
          </Flex>
        </Flex>
        {/* Right side */}
        <ButtonGroup gap={2}>
          <CancelButton title={"Cancel"} clickFunction={() => router.back()} />
          <SaveButton title={"Save"} clickFunction={submitForm} />
        </ButtonGroup>
      </Flex> 
    )
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

        <GridItem colStart={2} bg={"blackAlpha.300"} overflowY={"auto"}>
          <CreatePurchaseOrderForm options={categoryList} creatorID={user.data.userID} submitFunc={getSubmit} />
        </GridItem>
      </Grid>
    </>
  );
}

export default CreatePurchaseOrderPage