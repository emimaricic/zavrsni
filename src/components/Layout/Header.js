import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useLogoutUserMutation } from "@/services/appApi";

const path = [
  { name: "Home", id: 1, path: "/" },
  { name: "Chat", id: 2, path: "/chat" },
  { name: "Chat GPT", id: 3, path: "/chat-gpt" },
];

export default function Header() {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [navbar, setNavbar] = useState(false);
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    await logoutUser(user);
    router.push("/");
  };

  return (
    <header
      className={`bg-[rgba(30, 33, 36, 0.6)] fixed top-0 w-full backdrop-blur-sm z-10`}
    >
      <nav className="w-full shadow">
        <div className="justify-between px-7 mx-auto lg:max-w-[1440px] md:items-center md:flex md:px-[60px] pt-[20px]">
          <div>
            <div className="flex items-center justify-between md:block">
              <div className="flex items-center gap-[14px] mr-4">
                <Link href="/" legacyBehavior>
                  <a>
                    <Image
                      className="md:min-w-[50px]"
                      width={100}
                      height={100}
                      src={"/images/logo.png"}
                      alt="logo"
                    />
                  </a>
                </Link>
              </div>

              <div className="md:hidden">
                {navbar ? (
                  <div
                    onClick={() => setNavbar(!navbar)}
                    className="rounded-lg"
                  >
                    <Image
                      width={32}
                      height={32}
                      src={"/icons/close3-icon.svg"}
                      alt="raffle-logo-text"
                      className="rounded-lg cursor-pointer"
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => setNavbar(!navbar)}
                    className="rounded-lg"
                  >
                    <Image
                      width={32}
                      height={32}
                      src={"/icons/menu.svg"}
                      alt="menu"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className="items-center justify-center space-y-4 md:flex md:space-x-[32px] md:space-y-0">
                {path.map((value, i) => {
                  return (
                    <React.Fragment key={value.id}>
                      {value.path === "/tickets" ||
                      value.path === "/creator" ? null : (
                        <li
                          className={`pb-2 text-lg md:text-sm font-normal hover:text-primary ${
                            router.pathname === value.path &&
                            "text-primary border-b-2 border-primary"
                          }`}
                        >
                          <Link href={value.path} legacyBehavior>
                            <a>{value.name}</a>
                          </Link>
                        </li>
                      )}
                    </React.Fragment>
                  );
                })}
                <div>
                  {user ? (
                    <button
                      suppressHydrationWarning={true}
                      onClick={handleLogout}
                      className="font-bold text-primary hover:text-white hover:bg-[#37827e] rounded-xl px-[28px] py-[14px] border border-primary text-sm min-w-[126px]"
                    >
                      LOGOUT
                    </button>
                  ) : (
                    <button
                      suppressHydrationWarning={true}
                      onClick={() => {
                        router.push("login");
                      }}
                      className="font-bold bg-primary hover:bg-[#37827e] rounded-xl px-[28px] py-[14px] text-bgPrimary text-sm min-w-[126px]"
                    >
                      LOGIN
                    </button>
                  )}
                </div>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
