import { AppContext, socket } from "@/context/appContext";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/legacy/image";
import { addNotifications, resetNotifications } from "../../features/userSlice";

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    rooms,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);
  const [toggleCollapse, setToggleCollapse] = useState(false);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  const getRooms = () => {
    fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };

  const joinRoom = (room, isPublic = true) => {
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);
    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    // dispatch for notifications
    dispatch(resetNotifications(room));
  };

  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) dispatch(addNotifications(room));
  });

  const handlePrivateMemberMsg = (member) => {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  };

  const orderIds = (id1, id2) => {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  };

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, []);

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  if (!user) {
    return <></>;
  }
  return (
    <div
      className={`w-full max-w-[260px] overflow-scroll scrollbar-hide ${
        toggleCollapse && "max-w-[80px] min-w-[80px] items-center"
      } ease-in-out duration-300`}
    >
      <div
        className={`flex justify-center m-2 mt-4 ml-1 ${
          !toggleCollapse && "!justify-end"
        }`}
      >
        <Image
          onClick={handleSidebarToggle}
          width={30}
          height={30}
          layout="fixed"
          src={"/icons/collapsebtn.svg"}
          alt="collapse"
          className={`cursor-pointer ${
            toggleCollapse && "rotate-180"
          } ease-in-out duration-300`}
        />
      </div>
      {!toggleCollapse && (
        <h1 className="text-2xl text-accent font-semibold mb-2 ml-2">
          Available rooms
        </h1>
      )}
      <div className="flex flex-col mb-4">
        {rooms.map((room, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                joinRoom(room);
              }}
              className={`text-primary cursor-pointer flex justify-between px-4 py-3 rounded-md ${
                room !== currentRoom &&
                !toggleCollapse &&
                "hover:bg-primary hover:text-white"
              }  ${
                room === currentRoom &&
                !toggleCollapse &&
                "bg-[#4E6090] hover:bg-[#4E6090] text-white"
              }`}
            >
              {!toggleCollapse ? (
                <>
                  <p className="text-sm">#{room}</p>
                  {currentRoom !== room && user.newMessages[room] && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
                      <p className="text-sm text-white">
                        {user.newMessages[room]}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`w-[40px] h-[40px] rounded-full flex items-center justify-center bg-primary hover:bg-accent text-white  ${
                    room === currentRoom &&
                    "!bg-[#4E6090] !hover:bg-[#4E6090] text-white"
                  }`}
                >
                  <p>{room.slice(0, 1).toUpperCase()}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col mb-4">
        {!toggleCollapse && (
          <h1 className="text-2xl text-accent font-semibold mb-2 ml-2">
            Members
          </h1>
        )}
        {members.map((member) => (
          <div
            key={member.id}
            className={`cursor-pointer flex items-center justify-between px-4 py-3 rounded-md ${
              privateMemberMsg?._id !== member?._id &&
              !toggleCollapse &&
              "hover:bg-primary"
            }  ${
              privateMemberMsg?._id === member?._id &&
              "bg-[#4E6090] hover:bg-[#4E6090]"
            }`}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={member._id === user._id}
          >
            <div className="flex items-center justify-center gap-2 relative">
              <div className="flex relative">
                {member.picture ? (
                  <Image
                    src={member.picture}
                    width={40}
                    height={40}
                    layout="fixed"
                    objectFit="cover"
                    className="rounded-full flex-1"
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
                {member.status === "online" ? (
                  <div className="w-[14px] h-[14px] rounded-full border border-green-500 bg-green-500 absolute bottom-0 mb-1"></div>
                ) : (
                  <div className="w-[14px] h-[14px] rounded-full border border-gray-500 bg-body absolute bottom-0 mb-1"></div>
                )}
              </div>
              {!toggleCollapse && (
                <div className="flex gap-1 items-center">
                  <p className="text-sm">{member.name}</p>
                  <p className="text-sm">
                    {member._id === user?._id && " (You)"}
                  </p>
                  <p className="text-sm">
                    {member.status == "offline" && " (Offline)"}
                  </p>
                </div>
              )}
              {user.newMessages[orderIds(member._id, user._id)] && (
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-full bg-primary ${
                    toggleCollapse && "absolute top-0 right-0"
                  }`}
                >
                  <p className="text-sm">
                    {user.newMessages[orderIds(member._id, user._id)]}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
