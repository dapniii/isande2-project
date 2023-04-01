import Navbar from "@/components/navbar";
import Header from "@/components/header";
import { AddButton } from "@/components/buttons";
import { useRouter } from "next/router";
import { Grid, GridItem, Flex, Text, Button, Icon } from "@chakra-ui/react";
import BasicTable from "@/components/table/basicTable";
import { COLUMNS } from "@/components/layouts/fuel/fuelColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";
import { useDisclosure } from "@chakra-ui/hooks";
import AddFuelEntryForm from "@/components/layouts/fuel/addFuelEntryForm";
import { MdAddCircle } from "react-icons/md";
import { useState } from "react";
import { withSessionSsr } from "@/lib/auth/withSession";

/* TODO: FIX DROPDOWN REFUEL TYPE*/
//To be Revised
export const getServerSideProps = withSessionSsr(
  async ({req, res}) => {
    const user = req.session.user;

    // TODO: Add allowed users here
    const allowedUsers = [
      { role: "System Admin", userType: "Admin"}
    ]

    // If not logged in
    if (user == null) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props: { user: {
          data: user,
          isLoggedIn: false 
          }, 
        }
      }
    }

    // If user role and user type not allowed
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
        }
      }

  const result = await fetch("https://my.api.mockaroo.com/fuel.json?key=98539730");
  const fuelData = await result.json();

  const category = {
    refuelType: [{ name: "Refuel Truck" }],
  };

  let data = {
    fuel: fuelData,
    categories: category,
  };
  console.log(data.categories.refuelType[0]);
  return { props: { 
    data,
    user: {
      data: user,
      isLoggedIn: true 
    }, 
  } };
});
//***************************************************************************************/

export default function FuelPage({ user, data }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  //Add fuel entry button function -OPEN CLOSE FORMS
  const [isFormOpen, setIsFormOpen] = useState(false)

  
  function addFuelEntry() {
    setIsFormOpen(true)
  }
  function closeFuelEntryForm() {
    setIsFormOpen(false)
  }

  function headerBreadcrumbs() {
    return <></>;
  }

  function headerMain() {
    return (
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text fontSize={"3xl"} fontWeight={"bold"}>
          Fuel
        </Text>
        <AddButton title={"Add Fuel Entry"} clickFunction={addFuelEntry} />
        <AddFuelEntryForm isOpen={isFormOpen} onClose={closeFuelEntryForm} />
      </Flex>
    );
  }

  function filters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <Dropdown
          title="Refuel Tank"
          options={data.categories.refuelType}
          id="refuelType"
          name="name"
          filter={filter}
          setFilter={setFilter}
        />
      </>
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

        {/* ADD GRAPH */}

        {/* Fuel Data Table */}
        <GridItem colStart={2} bg={"blackAlpha.300"} p={2} overflowY={"auto"}>
          <BasicTable
            COLUMNS={COLUMNS}
            DATA={data.fuel}
            FILTERS={filters}
            HIDDEN={["refuelType"]}
          />
        </GridItem>
      </Grid>
    </>
  );
}
