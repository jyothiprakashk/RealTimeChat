import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupModalChat = ({ children }) => {
  const { user, setChats, chats } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!groupName || !selectedUsers.length) {
      toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `api/chats/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat is Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleUser = (item) => {
    if (selectedUsers.includes(item)) {
      toast({
        title: "User already added",
        description: "user is alread added to group.Please check",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, item]);
  };

  const handleDeleteUser = (user) => {
    let res = selectedUsers.filter(
      (currentUser) => currentUser._id !== user._id
    );
    setSelectedUsers(res);
  };

  const handleSelectedBadge = (name) => {
    console.log(name);
  };

  return (
    <div>
      <Button onClick={onOpen}>{children}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" justifyContent="center" alignItems="center">
            <FormControl>
              <Input
                placeholder="GroupName"
                onChange={(e) => setGroupName(e.target.value)}
                mb={3}
              />

              <Input
                placeholder="Users"
                onChange={(e) => handleSearch(e.target.value)}
                mb={3}
              />
            </FormControl>
            <Box display="flex" flexWrap="wrap" alignItems="center">
              {selectedUsers.map((userItem) => (
                <UserBadgeItem
                  key={userItem._id}
                  user={userItem}
                  handleFunction={() => handleSelectedBadge(userItem.name)}
                  handleDelete={() => handleDeleteUser(userItem)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                .slice(0, 4)
                .map((userData, index) => (
                  <UserListItem
                    key={index}
                    user={userData}
                    handleFunction={() => handleUser(userData)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupModalChat;
