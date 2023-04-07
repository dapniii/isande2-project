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
import { BackButton, SaveButton, RejectButton } from '@/components/buttons';
import PurchaseOrderLayout from '@/components/layouts/purchaseorders/PurchaseOrderLayout/purchaseOrderLayout';

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


function PurchaseOrderDetailsPage({user, categoryList}) {
  const router = useRouter();
  const { poNumber } = router.query;
  const [initialData, setInitialData] = useState();
  const [confirmPurchase, setConfirmPurchase] = useState();

  useEffect(() => {
      fetch("/api/purchaseorders/" + poNumber, {
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
  },[poNumber])

  async function approve() {
    let poData = {
        poNumber: poNumber,
        approverID: user.data.userID,
    }

    await fetch(purchaseOrderAPI.approve, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(poData),
    }).then(result => result.json())
    .then(data => {
        console.log(data)
        if (data.error != null) 
            console.log(data.error)
        location.reload()
    })
  }

  function getConfirmPurchase(submitFunc) {
    setConfirmPurchase(submitFunc)
  }

  function headerBreadcrumbs() {
      return (
          <Flex justifyContent={"space-between"}>
              <Breadcrumb pt={1}>
                  <BreadcrumbItem  >
                      <BreadcrumbLink href='/joborders' color={"blue"} textDecor={"underline"} fontSize={"lg"}>Purchase Orders</BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbItem isCurrentPage>
                      <BreadcrumbLink fontSize={"lg"}>#{poNumber}</BreadcrumbLink>
                  </BreadcrumbItem>
              </Breadcrumb>
              <Flex>
                  <BackButton title={"Back"} clickFunction={() => router.back()} />
              </Flex>
          </Flex>
      )          
    }
    
    function headerMain() {
      return (
        <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text fontSize={"3xl"} fontWeight={"bold"}>Purchase Order Details</Text>
            {
                initialData != null && initialData.purchaseOrder != null ? (
                  <>
                    {
                      initialData.purchaseOrder.statusID.name == "Posted" && user.data.role == "Purchasing" ? (
                        <ButtonGroup>
                          <RejectButton title={"Reject"} />
                          <SaveButton title={"Approve"} clickFunction={approve} />
                        </ButtonGroup>
                      ) : (<></>)
                    }
                    {
                        initialData.purchaseOrder.statusID.name == "Approved" && user.data.role == "Purchasing" ? (
                        <SaveButton title={"Confirm Purchase"} clickFunction={confirmPurchase} />
                        ) : (<></>)
                    }
                  </>
                ) : (<></>)
            }

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
              withShadow={true}
            />
          </GridItem>
  
          <GridItem colStart={2} bg={"blackAlpha.300"} >
              {
                  initialData != null ? (
                      <PurchaseOrderLayout 
                          user={user.data}
                          initialData={initialData.purchaseOrder}
                          confirmPurchaseFunc={getConfirmPurchase}
                      />
                  ) : (<></>)
              }

          </GridItem>
        </Grid>
      </>
    );
}

export default PurchaseOrderDetailsPage