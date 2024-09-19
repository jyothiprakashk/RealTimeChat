import { Button, ButtonGroup } from "@chakra-ui/react";
import "./App.css";
import HomePage from "./pages/homepage";
import { Route } from "react-router-dom";
import ChatPage from "./pages/chat";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatPage} />
    </div>
  );
}

export default App;
