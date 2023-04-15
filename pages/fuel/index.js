import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { AddButton } from "@/components/Buttons";
import { useRouter } from "next/router";
import {
  Grid,
  GridItem,
  Flex,
  Text,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Select,
} from "@chakra-ui/react";
import BasicTable from "@/components/table/basicTable";
import {
  COLUMNS,
  FUEL_OUT_COLUMNS,
} from "@/components/layouts/fuel/fuelColumns";
import Dropdown from "@/components/table/dropdown";
import GlobalFilter from "@/components/table/globalFilter";
import { useDisclosure } from "@chakra-ui/hooks";
import AddFuelEntryForm from "@/components/layouts/fuel/addFuelEntryForm";
import { useState } from "react";
import { withSessionSsr } from "@/lib/auth/withSession";
import { fuelAPI } from "@/lib/routes";
import { useEffect } from "react";
import Vehicle from "@/models/vehicles/VehicleSchema";

/* TODO: FIX DROPDOWN REFUEL TYPE*/
//To be Revised
export const getServerSideProps = withSessionSsr(
  async ({ req, res, context }) => {
    const user = req.session.user;

    // TODO: Add allowed users here
    const allowedUsers = ["System Admin", "Inventory", "Mechanic"];

    // If not logged in
    if (user == null) {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props: {
          user: {
            data: user,
            isLoggedIn: false,
          },
        },
      };
    }

    // If user role and user type not allowed
    else if (allowedUsers.findIndex(role => role == user.role) == -1) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
        props: {
          user: {
            isLoggedIn: true,
          },
        },
      };
    }

    const vehicles = await Vehicle.find({}, '-_id plateNumber imageID brandID')
      .populate('imageID', '-_id secure_url')
      .populate('brandID', '-_id name')
      .populate('vehicleTypeID', '-_id name')
      .lean()

    const [fuelIn, fuelOut] = await Promise.all([
      fetch(fuelAPI.get_fuelIn)
        .then((res) => res.json())
        .then((res) => res.data),
      fetch(fuelAPI.get_fuelOut)
        .then((res) => res.json())
        .then((res) => res.data),
    ]);

    const categories = {
      refuelType: [{ name: "Refuel Truck" }],
    };

    let data = {
      fuelIn,
      fuelOut,
      categories,
      vehicles
    };

    return {
      props: {
        data,
        user: {
          data: user,
          isLoggedIn: true,
        },
      },
    };
  }
);
//***************************************************************************************/

export default function FuelPage({ user, data }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refuelType, setRefuelType] = useState("");
 
  //Add fuel entry button function -OPEN CLOSE FORMS
  const [isFormOpen, setIsFormOpen] = useState(false);

  //TOTAL LITERS COMPUTATION
  const [total, setTotal] = useState(0);
  const totalStyle = {
    color: total <= 5000 ? "#FF575F" : "#25C685",
  };

  const calculateTotal = () => {
    let sum = 0;
    let sum1 = 0;
    let totalLiters = 0;
    for (let i = 0; i < data.fuelIn.length; i++) {
      sum += data.fuelIn[i].fLiters;
    }
    for (let i = 0; i < data.fuelOut.length; i++) {
      sum1 += data.fuelOut[i].ofLiters;
    }
    totalLiters = sum - sum1;
    return totalLiters;
  };

  useEffect(() => {
    setTotal(calculateTotal());
  }, [data.fuelIn, data.fuelOut]);

  //DATE SORTING
  const sortedFuelIn = data.fuelIn.sort(
    (a, b) => new Date(b.fRecordDateTime) - new Date(a.fRecordDateTime)
  );
  const sortedFuelOut = data.fuelOut.sort(
    (a, b) => new Date(b.oRecordDateTime) - new Date(a.oRecordDateTime)
  );

  //END OF CODE

  function addFuelEntry() {
    setIsFormOpen(true);
  }
  function closeFuelEntryForm() {
    setIsFormOpen(false);
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
        <AddFuelEntryForm
          creatorID={user.data.userID}
          isOpen={isFormOpen}
          onClose={closeFuelEntryForm}
          fuelInCount={data.fuelIn.length}
          fuelOutCount={data.fuelOut.length}
          data={data}
          total={total}
        />
      </Flex>
    );
  }

  function filters(filter, setFilter, globalFilter, setGlobalFilter) {
    return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

        <Select
          w={"25%"}
          value={refuelType}
          name={refuelType}
          onChange={(e) => setRefuelType(e.target.value)}
          border={"1px solid #9F9F9F"}
        >
          <option key="00000" value="" defaultValue>
            {" "}
            Refuel Tank{" "}
          </option>
          <option key="00001" value="Refuel Truck" defaultValue>
            {" "}
            Refuel Truck{" "}
          </option>
        </Select>
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

        <GridItem colStart={2} bg={"blackAlpha.300"} gap={2} p={4}>
          <Flex flexDirection={"column"} gap={5} height={100}>
            <StatGroup bg={"white"} p={5} boxShadow={"xl"} borderRadius={5}>
              <Stat>
                <StatLabel>Total Fuel Tank Liters</StatLabel>
                <StatNumber>
                  <span style={totalStyle}>{total.toLocaleString()}L</span> out
                  of 64,000L
                </StatNumber>
              </Stat>
            </StatGroup>
            {refuelType == "" && (
              <BasicTable
                COLUMNS={COLUMNS}
                DATA={sortedFuelIn}
                FILTERS={filters}
                HIDDEN={["refuelType"]}
              />
            )}
            {refuelType == "Refuel Truck" && (
              <BasicTable
                COLUMNS={FUEL_OUT_COLUMNS}
                DATA={sortedFuelOut}
                FILTERS={filters}
                HIDDEN={["refuelType"]}
              />
            )}
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
}
