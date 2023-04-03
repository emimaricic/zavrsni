import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "@/store";
import { useState } from "react";
import { AppContext, socket } from "../context/appContext";
const persistedStore = persistStore(store);

export default function App({ Component, pageProps }) {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <AppContext.Provider
          value={{
            socket,
            currentRoom,
            setCurrentRoom,
            members,
            setMembers,
            messages,
            setMessages,
            privateMemberMsg,
            setPrivateMemberMsg,
            rooms,
            setRooms,
            newMessages,
            setNewMessages,
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppContext.Provider>
      </PersistGate>
    </Provider>
  );
}
