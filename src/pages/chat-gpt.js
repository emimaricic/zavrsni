import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const MessageForm = () => {
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: format(new Date(), "hh:mm"),
      sender: "ChatGPT",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message) return;

    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
      sentTime: format(new Date(), "hh:mm"),
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            sentTime: format(new Date(), "hh:mm"),
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="w-full flex justify-center">
      {!user ? (
        <div className="h-[54vh] rounded-lg flex items-center justify-center">
          <p>To use the chat GPT, you need to login first.</p>
        </div>
      ) : (
        <div className="w-full px-4 bg-bgSecondary p-4 rounded-xl shadow-sm max-w-[968px]">
          <div className="px-6 h-[56px] mb-2 border-b border-gray-800 flex items-center">
            <p className="text-lg text-primary">Chat GPT</p>
          </div>
          <div className="overflow-y-scroll scrollbar-hide h-[54vh] mb-2 flex flex-col">
            <div className="flex-1">
              {messages.map((message, i) => {
                console.log(message);
                return (
                  <div
                    className={
                      message.sender === "user" ? "message" : "incoming-message"
                    }
                    key={i}
                  >
                    <div className="message-inner">
                      <p
                        className={`text-xs ${
                          message.sender === "user"
                            ? "text-accent"
                            : "text-primaryLight"
                        }`}
                      >
                        {message.sender === "user"
                          ? user.name.charAt(0).toUpperCase() +
                            user.name.slice(1)
                          : message.sender}
                      </p>
                      <div className="flex flex-col">
                        <p className="text-sm break-all">{message.message}</p>
                        <div className="w-full">
                          <p className="text-xs text-end">{message.sentTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {isTyping && (
              <div className="ml-2 text-xs text-textDescription">
                Chat GPT is typing...
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
          <form
            onSubmit={(e) => {
              handleSend(e);
            }}
          >
            <div className="flex w-full">
              <input
                placeholder="Message..."
                id="message"
                type="text"
                autoComplete="off"
                className="block w-full p-2 border rounded-lg bg-[#171717] border-primary placeholder-gray-400 text-white outline-none"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                disabled={isTyping}
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MessageForm;
