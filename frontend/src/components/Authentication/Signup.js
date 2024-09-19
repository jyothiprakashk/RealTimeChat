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
import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
const Signup = () => {
  const [state, setState] = useState({});
  const [show, setShow] = useState(false);
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const onHandleChange = (e) => {
    setState({ ...state, [e.target.id]: e.target.value });
  };

  const onFileUpload = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an Image",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "chatupload");

      fetch("https://api.cloudinary.com/v1_1/chatupload/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(response.url.toString());
          setPic(response.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an Image",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const onSubmitForm = async () => {
    const { name, email, password, password1 } = state;
    if (!name || !email || !password || !password1) {
      toast({
        title: "Please fill all the fields",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (password !== password1) {
      toast({
        title: "Please make sure password and confirm password must be same",
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
        "/api/user",
        { name, email, password, pic },
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

  return (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Name"
          type="name"
          id="name"
          onChange={onHandleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input
          type="email"
          placeholder="Email"
          id="email"
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
      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            id="password1"
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

      <FormControl>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => onFileUpload(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={onSubmitForm}
        isLoading={loading}
      >
        SignUp
      </Button>
    </VStack>
  );
};

export default Signup;
