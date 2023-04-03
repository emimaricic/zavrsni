import Image from "next/image";
import { useRouter } from "next/router";
import { AiFillWechat } from "react-icons/ai";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-8">
      <div>
        <h1 className="text-3xl md:text-5xl text-semibold text-gray-100 mb-2">
          Meet the world
        </h1>
        <p className="text-sm md:text-base text-textDescription mb-4 ml-1">
          Chat App lets you coonect with the world
        </p>
        <button
          suppressHydrationWarning={true}
          onClick={() => {
            router.push("login");
          }}
          className="flex items-center gap-2 font-bold bg-primary hover:bg-[#37827e] rounded-xl px-[28px] py-[14px] text-bgPrimary text-xs md:text-sm min-w-[126px]"
        >
          Get Started
          <AiFillWechat className="w-[20px] h-[20px]" />
        </button>
      </div>
      <div>
        <Image
          width={600}
          height={800}
          src={"/images/landing-image.png"}
          className="rounded-2xl"
        />
      </div>
    </div>
  );
}
