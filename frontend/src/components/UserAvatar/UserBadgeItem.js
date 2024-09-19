import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = (props) => {
  const { user, handleFunction, handleDelete } = props;
  return (
    <Box
      backgroundColor="purple"
      color="white"
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant="solid"
      onClick={handleFunction}
      fontSize={12}
      cursor={"pointer"}
    >
      {user.name}
      <CloseIcon pl={1} onClick={handleDelete} />
    </Box>
  );
};

export default UserBadgeItem;
