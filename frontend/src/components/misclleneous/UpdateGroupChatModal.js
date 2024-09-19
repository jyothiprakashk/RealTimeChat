import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  FetchAllMessages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [updateGroupName, setUpdateGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const toast = useToast();

  const handleRemoveUsers = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only Admin's can remove users",
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
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chats/removefromgroup`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      user._id === user1._id ? setSelectedChat() : setSelectedChat(data);
      FetchAllMessages();
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {}
  };

  const handleAddUsers = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
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

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin's can add someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chats/addtogroup`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleUpdate = async () => {
    if (!updateGroupName) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chats/renameGroup`,
        { chatId: selectedChat._id, chatName: updateGroupName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setUpdateGroupName("");
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

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems="center" flexWrap="wrap">
            {selectedChat.users.map((userItem) => (
              <UserBadgeItem
                key={userItem._id}
                user={userItem}
                handleDelete={() => handleRemoveUsers(userItem)}
              />
            ))}
            <FormControl>
              <Box display="flex" gap={4}>
                <Input
                  placeholder="UpdateGroupName"
                  onChange={(e) => setUpdateGroupName(e.target.value)}
                  mb={3}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleUpdate}
                  isLoading={loading}
                >
                  Update
                </Button>
              </Box>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Users"
                onChange={(e) => handleSearch(e.target.value)}
                mb={3}
              />
            </FormControl>

            {searchResult.map((u) => (
              <UserListItem
                key={u._id}
                user={u}
                handleFunction={() => handleAddUsers(u)}
              />
            ))}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRemoveUsers(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
