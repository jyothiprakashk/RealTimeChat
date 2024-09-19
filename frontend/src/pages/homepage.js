import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    console.log(user, "useerdata");
    if (user) history.push("/chats");
  }, [history]);
  console.log("amma");
  return (
    <Container>
      <Box
        display={"flex"}
        justifyContent={"center"}
        backgroundColor={"white"}
        m={"40px 0 15px 0"}
        borderRadius="lg"
        p={3}
      >
        <Text fontSize="large">Talk-A-Tive</Text>
      </Box>
      <Box p={4} w={"100%"} borderRadius={"lg"} bg={"white"}>
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>SignUp</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
