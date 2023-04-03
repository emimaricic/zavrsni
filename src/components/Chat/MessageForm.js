import React, { useContext, useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { messageSchema } from "../shared/schemas/messageSchema";
import { useSelector } from "react-redux";
import { AppContext, socket } from "@/context/appContext";
import Image from "next/legacy/image";

const MessageForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(messageSchema),
    defaultValues: { email: "", password: "" },
  });
  const { currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);
  const user = useSelector((state) => state.user);
  const messageEndRef = useRef(null);

  const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  };
  const todayDate = getFormattedDate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const onSubmit = (data) => {
    const { message } = data;
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    reset();
  };

  return (
    <div className="w-full">
      {!user ? (
        <div className="h-[54vh] rounded-lg flex items-center justify-center">
          <p>To use the chat, you need to login first.</p>
        </div>
      ) : (
        <div className="px-4">
          {user && !privateMemberMsg?._id && (
            <div className="px-6 h-[56px] mb-2 border-b border-gray-800 flex items-center">
              <p className="text-lg text-primary">#{currentRoom} chat</p>
            </div>
          )}
          {user && privateMemberMsg?._id && (
            <>
              <div className="px-6 flex items-center gap-2 h-[56px] mb-2 border-b border-gray-800">
                {privateMemberMsg.picture ? (
                  <Image
                    width={40}
                    height={40}
                    layout="fixed"
                    objectFit="cover"
                    src={privateMemberMsg.picture}
                    className="rounded-full"
                  />
                ) : (
                  <Image
                    src={"/images/no-profile.png"}
                    width={40}
                    height={40}
                    layout="fixed"
                    objectFit="cover"
                    className="rounded-full"
                  />
                )}
                <p className="text-lg text-primary">{privateMemberMsg.name}</p>
              </div>
            </>
          )}
          <div className="overflow-y-scroll scrollbar-hide h-[54vh] mb-2">
            {messages.map(({ _id: date, messagesByDate }, idx) => (
              <div key={idx}>
                <div className="flex justify-center">
                  <p className="bg-primary w-fit px-4 py-2 rounded-lg text-xs">
                    {date}
                  </p>
                </div>
                {messagesByDate?.map(
                  ({ content, time, from: sender }, msgIdx) => (
                    <div
                      className={
                        sender?.email === user?.email
                          ? "message"
                          : "incoming-message"
                      }
                      key={msgIdx}
                    >
                      <div
                        className={`w-full flex items-center  gap-2 ${
                          sender?.email !== user?.email && "justify-end"
                        }`}
                      >
                        {sender.picture ? (
                          <Image
                            src={sender.picture}
                            width={35}
                            height={35}
                            layout="fixed"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        ) : (
                          <div>
                            <Image
                              src={"/images/no-profile.png"}
                              width={35}
                              height={35}
                              layout="fixed"
                              objectFit="cover"
                              className="rounded-full"
                            />
                          </div>
                        )}

                        <div className="message-inner">
                          {sender._id !== user?._id && (
                            <p className="text-xs text-primaryLight">
                              {sender.name}
                            </p>
                          )}
                          <div className="flex flex-col">
                            <p className="text-sm break-all">{content}</p>
                            <div className="w-full">
                              <p className="text-xs text-end">{time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full">
              <input
                placeholder="Message..."
                id="message"
                type="text"
                autoComplete="off"
                className="block w-full p-2 border rounded-lg bg-[#171717] border-primary placeholder-gray-400 text-white outline-none"
                {...register("message")}
              />
              {/* <button type="submit">
                <MdSend className="w-[36px] h-[42px] text-primary cursor-pointer" />
              </button> */}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MessageForm;
