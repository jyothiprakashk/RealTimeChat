import { Box, Image, background } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px="3"
      py="2"
      mb="2"
      gap={"8px"}
      borderRadius={"8px"}
      fontFamily="work sans"
    >
      <Image
        src={user.pic}
        width={"40px"}
        height={"40px"}
        borderRadius="50%"
        objectFit="cover"
      />
      <Box display="flex" flexDir={"column"}>
        <p>{user.name}</p>
        <Box fontSize={10}>Email: {user.email}</Box>
      </Box>
    </Box>
  );
};

export default UserListItem;
