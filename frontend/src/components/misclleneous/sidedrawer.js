import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useToast,
  Tooltip,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogic";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isChatLoading, setChatLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onHandleLogout = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const onHandleSearch = async () => {
    if (!searchValue) return;
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/user?search=${searchValue}`,
        config
      );
      setLoading(false);
      setUsers(data);
    } catch (error) {
      setLoading(false);
      setUsers([]);
      toast({
        title: "Error Occured!",
        description: "Failed to load searched results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const accessChat = async (userId) => {
    setChatLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chats", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setChatLoading(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to load Chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
    >
      <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <i className="fas fa-search"></i>
          <Text d={{ base: "none", md: "flex" }} px="4">
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="20px" fontFamily="Work sans">
        Talk-A-Tive
      </Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize="20px" m={1} />
          </MenuButton>
          <MenuList>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={onHandleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          // finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Search Users</DrawerHeader>

            <DrawerBody>
              <Box display="flex" pb="2">
                <Input
                  placeholder="Search by Name or Email"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  mr={2}
                />
                <Button onClick={onHandleSearch}>Go</Button>
              </Box>
              {isLoading ? (
                <ChatLoading />
              ) : (
                <>
                  {users.map((user) => {
                    return (
                      <UserListItem
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                        key={user._id}
                      />
                    );
                  })}
                </>
              )}
            </DrawerBody>

            {isChatLoading && <Spinner ml="auto" display="flex" />}

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </Box>
  );
};

export default SideDrawer;
