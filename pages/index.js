import { useState, useEffect } from "react";
import {
  Image,
  Grid,
  GridItem,
  Flex,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  VStack,
} from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Header from "@/components/header";
import {
  BackButton,
  EditButton,
  SaveButton,
  CancelButton,
  DeleteButton,
} from "@/components/buttons";
import { Router, useRouter } from "next/router";
import { userAPI } from "@/lib/routes";
import { withSessionSsr } from "@/lib/auth/withSession";

import ViewUserForm from "@/components/layouts/users/viewUserLayout";

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  const user = req.session.user;

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

  const categoryList = {
    department: [],
    roles: [],
    userTypes: [],
    specialties: [],
  };

  const result = await fetch(userAPI.get_categories);
  const data = await result.json();

  categoryList.department = data.departments;
  categoryList.roles = data.roles;
  categoryList.userTypes = data.userTypes;
  categoryList.specialties = data.specialties;

  return {
    props: {
      user: {
        data: user,
        isLoggedIn: true,
      },
      categoryList: categoryList,
    },
  };
});

export default function UserDetails({ user, categoryList }) {
  const router = useRouter();
  const { userID } = router.query;
  const [preview, setPreview] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [submitForm, setSubmitForm] = useState();
  const [disabled, setDisabled] = useState("");

  function cancel() {
    router.back();
  }

  // Fetch user data
  useEffect(() => {
    fetch("/api/users/" + userID, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDisabled(data.disabled);
      });
  }, [userID]);

  async function disable() {
    await fetch(userAPI.disable_user, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((result) => result.json())
      .then((data) => {
        if (data.error != null) console.log(data.error);
        router.push("/users");
      });
  }

  function headerBreadcrumbs() {
    return <></>;
  }

  function headerMain() {
    return <></>;
  }

  // Get submit form function from create user form component
  function getSubmit(func) {
    setSubmitForm(func);
  }
  // MAIN
  return (
    <>
      <Grid minH="100vh" templateColumns={"1fr 7fr"} templateRows={"0fr 1fr"}>
        <GridItem colStart={1} rowSpan={2} bg={"#222222"}>
          <Navbar user={user.data} />
        </GridItem>

        <GridItem colStart={2} top={0} position={"sticky"} zIndex={2}>
          <></>
        </GridItem>

        {/* Main Content */}
        <GridItem
          colStart={2}
          bg={"blackAlpha.100"}
          overflowY={"auto"}
          display={"flex"}
          justifyContent={"center"}
          paddingTop={"5em"}
        >
          <VStack spacing={2}>
          <Text fontSize={"5xl"} lineHeight={"8"}>Welcome back to <b>Stockly</b>!</Text>
            <Image
              src={user.data.image}
              alt={"User Photo"}
              objectFit={"cover"}
              borderRadius={"15"}
              w={"15em"}
              h={"15em"}
              paddingTop={"5em"}
            />
            <Text fontSize={"3xl"} fontWeight={"bold"} lineHeight={"8"}>{user.data.lastName + ", " + user.data.firstName}</Text>
            <Text fontSize={"xl"}>{user.data.email}</Text>
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
}
