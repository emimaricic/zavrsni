import MessageForm from "@/components/Chat/MessageForm";
import Sidebar from "@/components/Chat/Sidebar";
import React from "react";

const Chat = () => {
  return (
    <div className="bg-[#1b1b1b] flex max-h-[70vh] rounded-md shadow-sm w-full pb-2">
      <Sidebar />
      <MessageForm />
    </div>
  );
};

export default Chat;
