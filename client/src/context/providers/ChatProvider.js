import { createContext, useContext, useEffect, useReducer } from "react";
import notif from '../../assets/audio/notif.wav'
import { useGetUserId } from "../../hooks/useGetUserId";
import { io } from "socket.io-client";
export const ChatContext = createContext();
import { ToastContainer, toast } from "react-toastify";
import reducer from '../reducers/ChatReducer';
import "react-toastify/dist/ReactToastify.css";
import { getSetSeenMessage, setNewChat, setNewMessage } from "../actions/ChatActions";
import { UserContext } from "./UserProvider";

const ChatProvider = ({ children }) => {

  const initialState = null;
  const [chats, dispatch] = useReducer(reducer, initialState);

  const { id } = useGetUserId();
  const { state: { user } } = useContext(UserContext);
  let socket = io("http://localhost:4000", {
    transports: ["websocket"],
    auth: {
      token: user?.token
    },
    upgrade: false,
  });

  useEffect(() => {
    socket.emit("user:connect", { id });


    socket.on("user:notification", ({ message }) => {
      const audio = new Audio(notif);
      audio.play();
      toast.success(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    });

    socket.on("send message", ({ type, data }) => {
      if (type === "new") {
        dispatch(setNewChat(data));
      } else {
        dispatch(setNewMessage(data));
      }
    });



    socket.on("client-message:seen", ({ id, chatId }) => {
      dispatch(getSetSeenMessage(chatId, id));
    })
  }, []);


  return (
    <ChatContext.Provider value={{ socket, chats, dispatch }}>
      <ToastContainer />
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
