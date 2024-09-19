import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
const Login = () => {
  const [state, setState] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const onHandleChange = (e) => {
    setState({ ...state, [e.target.id]: e.target.value });
  };

  const onSubmitForm = async () => {
    setLoading(true);
    const { email, password } = state;
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      let config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      let { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Registration Successfull",
        status: "Success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitGuest = () => {
    setState({ email: "guest@example.com", password: "123456" });
  };

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          placeholder="Email"
          id="email"
          value={state.email}
          onChange={onHandleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            id="password"
            value={state.password}
            onChange={onHandleChange}
          />
          <InputRightElement>
            <Button
              height={"1.75rem"}
              size={"sm"}
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={onSubmitForm}
        isLoading={loading}
      >
        Login
      </Button>
      <Button colorScheme="red" width={"100%"} onClick={onSubmitGuest}>
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
