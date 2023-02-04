//Frontend
import LoginForm from "@/components/auth/loginForm";
import { Container, Flex, Heading } from "@chakra-ui/react";

import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import { Button, Icon } from "@chakra-ui/react";
import { Stack, Spacer, Divider } from "@chakra-ui/react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { MdLogin, MdPassword, MdPerson } from "react-icons/md";

import { Router, useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import dbConnect from "@/lib/dbConnect";
import { ironOptions } from "@/lib/config";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (req.session.user) {
      return {
        redirect: { destination: "/", permanent: true },
        props: {},
      };
    } else {
      await dbConnect();

      return {
        props: {},
      };
    }
  },
  ironOptions
);

export default function loginPage() {

  const router = useRouter();

  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const disabledRef = useRef(false);

  const [show, setShow] = useState(false);
  const showHandler = () => setShow(!show);

  const [error, setError] = useState(false);

  //Handles data submission when Submit button is clicked
  function submitHandler(event) {
    event.preventDefault();
    let userData = {
      employeeID: employeeID,
      password: password,
      disabled: disabledRef,
    };

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "Logged in") {
          console.log("SUCCESS");
          console.log("SESSION IS", data);
          router.replace("/");
        } else {
          console.log("ERROR IS:", data);
          setError(true);
        }
      });
  }

  function showError() {
    if (error) {
      return <span>AM AN ERROR MESSAGE</span>;
    }
  }


  return (
    // Parent Container, aligns items to middle vertically abd contains black bg
    <Flex alignItems="center" h="100vh" bg="#222222">
      {/* Sub Parent Container, aligns items to middle horizontally */}
      <Container centerContent>
        {/* Container which alings the logo and Stockly text in the middle */}
        <Flex alignItems="center" p="6" gap="4">
          {/* Stockly Logo */}
          <svg
            width="65"
            viewBox="0 0 315 321"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M285.45 60.1485L187.056 7.3574C178.071 2.53748 167.88 0 157.506 0C147.132 0 136.94 2.53748 127.956 7.3574L29.5497 60.1485C20.5769 64.9802 13.1257 71.9152 7.94029 80.2606C2.75491 88.606 0.0169732 98.0696 0 107.706V213.294C0.0169732 222.93 2.75491 232.394 7.94029 240.739C13.1257 249.085 20.5769 256.02 29.5497 260.851L127.956 313.643C136.94 318.463 147.132 321 157.506 321C167.88 321 178.071 318.463 187.056 313.643L285.45 260.851C294.423 256.02 301.874 249.085 307.06 240.739C312.245 232.394 314.983 222.93 315 213.294V107.706C314.983 98.0696 312.245 88.606 307.06 80.2606C301.874 71.9152 294.423 64.9802 285.45 60.1485ZM29.5497 130.848V107.706C29.5497 107.294 29.5497 106.882 29.5497 106.476C29.5497 106.383 29.5497 106.289 29.5497 106.196C29.5497 105.872 29.597 105.542 29.6265 105.218C29.6265 105.142 29.6265 105.065 29.6265 104.993C29.6679 104.636 29.7093 104.285 29.7625 103.933V103.829C30.086 101.772 30.6549 99.7554 31.4586 97.8157C31.5886 97.5082 31.7187 97.2006 31.8605 96.8931C32.2033 96.1462 32.5874 95.4213 33.0011 94.6964C33.2553 94.2571 33.5212 93.8233 33.8049 93.3949C34.3905 92.494 35.0339 91.6266 35.7315 90.7974C36.4596 89.9601 37.2411 89.1642 38.0719 88.414L38.1605 88.3261C38.6097 87.9033 39.0825 87.4969 39.5671 87.096C40.0044 86.7391 40.4536 86.3986 40.9145 86.0636L41.3282 85.7725C41.671 85.5309 42.0256 85.2948 42.3861 85.0696C42.528 84.9762 42.6698 84.8829 42.8175 84.795C43.3081 84.493 43.8104 84.2019 44.3187 83.9218L102.455 52.7183L142.731 31.1362C143.216 30.8726 143.712 30.631 144.214 30.4003L144.498 30.2795L144.74 30.1971C144.859 30.1532 144.977 30.1093 145.095 30.0763L145.355 29.9994L145.698 29.9061L145.97 29.8512L146.307 29.7798L146.578 29.7413L146.909 29.6919H147.187L147.512 29.6644H148.103C148.372 29.6634 148.64 29.6762 148.907 29.7029H149.078C149.309 29.7029 149.533 29.7578 149.764 29.7962L149.923 29.8237C150.183 29.8731 150.438 29.9335 150.692 30.0049C150.751 30.0049 150.804 30.0379 150.863 30.0543C151.082 30.1151 151.297 30.1866 151.507 30.2685C151.556 30.2826 151.603 30.2991 151.649 30.3179C151.891 30.4113 152.134 30.5156 152.37 30.6255L152.53 30.7079C152.731 30.8067 152.932 30.9165 153.121 31.0319L153.239 31.0978C153.458 31.2296 153.67 31.3778 153.883 31.5261L154.025 31.6359C154.208 31.7732 154.385 31.916 154.563 32.0643L154.646 32.1412C154.84 32.3146 155.023 32.4979 155.195 32.6903L155.319 32.8276C155.479 32.9979 155.627 33.1791 155.768 33.3768L155.827 33.4537C155.981 33.6569 156.123 33.871 156.259 34.0852L156.359 34.25C156.478 34.4531 156.596 34.6673 156.696 34.8815L156.732 34.9474C156.838 35.1835 156.939 35.4252 157.027 35.6723C157.027 35.7327 157.069 35.7931 157.086 35.8535C157.169 36.0951 157.24 36.3368 157.299 36.5894C157.299 36.5894 157.299 36.5894 157.299 36.6278C157.358 36.8914 157.4 37.177 157.435 37.4296C157.435 37.4955 157.435 37.5614 157.435 37.6328C157.435 37.9074 157.482 38.182 157.482 38.473V111.402L152.754 113.939C152.719 113.954 152.685 113.973 152.654 113.994L131.183 125.527C125.261 128.716 120.343 133.293 116.921 138.802C113.498 144.31 111.691 150.556 111.68 156.917V174.353C111.675 177.629 110.744 180.846 108.981 183.684C107.218 186.521 104.684 188.878 101.633 190.52L53.875 216.095L43.6449 221.586L43.3908 221.713L43.1662 221.822L42.8175 221.971L42.593 222.064L42.1497 222.223L42.0138 222.267L41.541 222.405H41.4228L40.9618 222.509H40.8082C40.6722 222.536 40.5304 222.558 40.3945 222.575L40.1817 222.608L39.8212 222.641H39.5553H38.9643C38.6978 222.642 38.4314 222.629 38.1664 222.602C37.9773 222.602 37.7882 222.553 37.5754 222.531L37.3095 222.492H37.2504H37.1735L36.9785 222.448C36.7776 222.405 36.5766 222.361 36.3875 222.306H36.3284L36.2398 222.278H36.1629C35.9679 222.218 35.767 222.152 35.5719 222.081L35.4774 222.048C35.2213 221.954 34.9707 221.848 34.7268 221.729L34.5259 221.63C34.3309 221.531 34.1417 221.427 33.9349 221.317L33.8226 221.251C33.6039 221.119 33.3853 220.971 33.1784 220.823L33.0366 220.713C32.8492 220.577 32.6697 220.433 32.4988 220.279L32.4574 220.246L32.4101 220.208C32.221 220.038 32.0378 219.856 31.8605 219.659L31.7364 219.521C31.5827 219.351 31.435 219.17 31.2932 218.972L31.2341 218.895C31.076 218.691 30.93 218.478 30.7967 218.258L30.7022 218.099C30.578 217.896 30.4658 217.682 30.3594 217.468V217.429C30.2471 217.193 30.1525 216.951 30.0639 216.704L30.0048 216.534C29.922 216.292 29.8511 216.051 29.792 215.798C29.7338 215.533 29.6904 215.265 29.662 214.996C29.662 214.996 29.662 214.947 29.662 214.925C29.6649 214.887 29.6649 214.848 29.662 214.81V214.722C29.662 214.623 29.662 214.519 29.662 214.42C29.662 214.035 29.662 213.656 29.662 213.272L29.5497 130.848ZM44.3246 237.073C42.6397 236.164 41.0559 235.103 39.5966 233.904L48.3847 229.192L48.4734 229.143L106.391 198.071C108.084 197.16 109.678 196.097 111.148 194.897C113.075 193.32 114.772 191.517 116.195 189.532C116.904 188.544 117.544 187.515 118.11 186.451C118.394 185.902 118.66 185.38 118.902 184.831C120.393 181.49 121.158 177.909 121.154 174.292V156.856C121.154 151.432 122.884 146.129 126.124 141.617C126.479 141.123 126.851 140.639 127.235 140.167C127.989 139.255 128.805 138.387 129.676 137.57L129.765 137.482C131.602 135.771 133.675 134.294 135.929 133.088L157.5 121.518L166.956 116.443L214.029 91.1818L249.11 72.3619L270.675 83.9273C272.359 84.8356 273.942 85.8951 275.403 87.0905L259.671 95.5531L167.553 144.978C164.576 146.574 161.839 148.53 159.415 150.794C159.078 151.107 158.759 151.42 158.44 151.738C158.121 152.057 157.807 152.386 157.506 152.716C157.009 153.265 156.531 153.786 156.076 154.363C155.306 155.295 154.588 156.263 153.924 157.263C152.811 158.924 151.845 160.667 151.035 162.474C150.745 163.122 150.479 163.776 150.231 164.44C150.065 164.891 149.9 165.341 149.752 165.797C148.622 169.23 148.048 172.8 148.05 176.39V188.752C148.05 193.572 146.684 198.306 144.091 202.48C141.497 206.654 137.767 210.121 133.275 212.531L125.557 216.671L65.8663 248.682L44.3246 237.073ZM285.45 190.152V213.294C285.45 213.903 285.45 214.513 285.385 215.123C285.213 217.523 284.703 219.892 283.866 222.168C283.689 222.646 283.494 223.118 283.275 223.585C283.057 224.052 282.862 224.491 282.637 224.936C282.466 225.282 282.283 225.617 282.093 225.952C282.093 225.991 282.052 226.029 282.034 226.062C281.703 226.644 281.355 227.21 280.982 227.764C280.906 227.874 280.835 227.99 280.764 228.094C280.581 228.357 280.397 228.616 280.208 228.868C280.019 229.121 279.919 229.247 279.771 229.417C279.623 229.588 279.529 229.736 279.398 229.895C279.268 230.054 279.138 230.197 279.014 230.345C278.813 230.582 278.612 230.812 278.423 231.037C278.234 231.263 278.122 231.372 277.962 231.537C277.631 231.878 277.3 232.213 276.952 232.542L276.869 232.63C275.494 233.909 273.988 235.06 272.372 236.068C271.828 236.403 271.272 236.727 270.699 237.034L197.593 276.283L172.281 289.864C171.79 290.127 171.294 290.369 170.797 290.6L170.508 290.72L170.271 290.803C170.153 290.847 170.029 290.891 169.911 290.924L169.651 291.001L169.308 291.094L169.042 291.149L168.705 291.22L168.427 291.259L168.097 291.308H167.819H167.494H166.903C166.634 291.309 166.366 291.296 166.099 291.27H165.933C165.703 291.27 165.473 291.215 165.242 291.176H165.088C164.828 291.127 164.568 291.066 164.314 290.995L164.149 290.946C163.928 290.885 163.711 290.813 163.499 290.731L163.357 290.682C163.114 290.589 162.872 290.484 162.642 290.375L162.482 290.298C162.277 290.195 162.08 290.085 161.891 289.968L161.779 289.902C161.554 289.77 161.341 289.622 161.129 289.474L160.987 289.364C160.804 289.227 160.626 289.084 160.455 288.93L160.366 288.859C160.177 288.689 159.994 288.507 159.817 288.31L159.693 288.172C159.539 288.002 159.385 287.821 159.243 287.623L159.184 287.546C159.031 287.343 158.889 287.129 158.753 286.909C158.718 286.858 158.686 286.805 158.658 286.75C158.534 286.547 158.422 286.333 158.316 286.118C158.303 286.098 158.293 286.076 158.286 286.053C158.174 285.816 158.079 285.575 157.991 285.328L157.926 285.146C157.849 284.905 157.778 284.663 157.719 284.411C157.716 284.398 157.716 284.385 157.719 284.372C157.66 284.109 157.618 283.823 157.583 283.57C157.583 283.504 157.583 283.439 157.583 283.367C157.583 283.093 157.541 282.818 157.541 282.527V176.352C157.541 175.802 157.541 175.253 157.6 174.704V174.397C157.642 173.847 157.701 173.298 157.778 172.749V172.65C158.835 165.538 162.833 159.089 168.924 154.671L169.219 154.462C169.598 154.198 169.982 153.94 170.401 153.693C170.526 153.611 170.656 153.523 170.786 153.446C171.282 153.138 171.784 152.847 172.304 152.567L271.266 99.4632C271.456 99.3643 271.653 99.271 271.857 99.1831C271.976 99.1282 272.094 99.0788 272.212 99.0348L272.33 98.9854L272.431 98.9415L272.88 98.7822L272.986 98.7493L273.465 98.612L273.583 98.5845L274.044 98.4802L274.192 98.4527C274.334 98.4527 274.47 98.4033 274.611 98.3868H274.759H274.818L275.179 98.3539H275.445H276.036C276.302 98.353 276.569 98.3658 276.834 98.3923C277.029 98.3923 277.218 98.4417 277.425 98.4692C277.513 98.4692 277.602 98.4692 277.685 98.5021H277.815L278.016 98.5516C278.216 98.59 278.417 98.6339 278.607 98.6889L278.76 98.7328L278.837 98.7602C279.038 98.8152 279.233 98.8811 279.428 98.9525L279.523 98.9854C279.779 99.0791 280.029 99.1854 280.273 99.3039L280.474 99.4028C280.669 99.5016 280.858 99.606 281.065 99.7158L281.13 99.7542H281.177C281.402 99.886 281.615 100.034 281.822 100.183H281.851L281.969 100.276C282.152 100.413 282.33 100.556 282.501 100.71L282.566 100.765C282.755 100.935 282.939 101.116 283.116 101.314L283.222 101.429C283.376 101.599 283.53 101.781 283.671 101.978C283.683 101.992 283.693 102.006 283.701 102.022L283.73 102.055C283.884 102.258 284.026 102.473 284.162 102.692L284.251 102.835C284.375 103.038 284.487 103.252 284.593 103.467C284.606 103.488 284.616 103.51 284.623 103.532C284.735 103.769 284.83 104.01 284.918 104.257C284.918 104.318 284.96 104.378 284.983 104.439C285.06 104.68 285.131 104.922 285.19 105.174C285.19 105.174 285.19 105.174 285.19 105.213C285.249 105.477 285.291 105.762 285.326 106.015C285.326 106.015 285.326 106.064 285.326 106.086C285.326 106.108 285.326 106.163 285.326 106.201C285.326 106.24 285.326 106.229 285.326 106.24C285.326 106.339 285.326 106.443 285.326 106.542C285.326 106.926 285.356 107.305 285.356 107.69L285.45 190.152Z"
              fill="white"
            />
          </svg>
          {/* Stockly Text */}
          <Heading color="white" size="2xl">
            STOCKLY
          </Heading>
        </Flex>
        <Flex>
      {/* Card Container */}
      <Card maxW="md" variant="outline">
        <CardHeader>
          {/* Form Title */}
          <Heading>Login</Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={submitHandler}>
            <Stack spacing={3}>
              {/* OPTIONAL TODO: HIGHLIGHT TEXTBOX RED IF ERROR REPLACING 'isRequired'
              https://chakra-ui.com/docs/components/form-control */}
              <FormControl isRequired>
                {/* Employee ID Label */}
                <FormLabel>Employee ID</FormLabel>

                <InputGroup>
                  {/* Employee Icon */}
                  <InputLeftElement
                    pointerEvents="none"
                    children={<MdPerson color="gray" />}
                  />
                  {/* Employee ID Input Field */}
                  <Input
                    placeholder="Enter Employee ID"
                    autoComplete="off"
                    onChange={(e) => setEmployeeID(e.target.value)}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                {/* Password Label */}
                <FormLabel>Password</FormLabel>

                <InputGroup>
                  {/* Password Icon */}
                  <InputLeftElement
                    pointerEvents="none"
                    children={<MdPassword color="gray" />}
                  />
                  {/* Password Input Field */}
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* Show/ Hide Password Button */}
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={showHandler}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>At least 8 characters long</FormHelperText>
              </FormControl>
              <Spacer />
              <Divider />
              <Spacer />
              {/* Button */}
              <Button
                type="submit"
                bg="green.400"
                color="white"
                //as = contains Logo from react-icon/md
                //boxSize = size of logo
                leftIcon={<Icon as={MdLogin} boxSize={"1em"} />}
              >
                Login
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Flex>
      </Container>
    </Flex>
  );
}
