import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className = "flex justify-center ">
      <header className="fixed top-[24px] flex flex-row justify-between items-center w-[87%] h-[96px] border-2 rounded-full  border-gray-700 z-50 bg-[#111823] bg-opacity-80 text-white">
        <Image  className ="ml-20"
            alt="header text"
            src="/head.png"
            width={100}
            height={32}
          />
        <div className ="font-manrope w-[497.41px] text-[22px] flex justify-between">
          <Link href = "">ABOUT US</Link>
          <Link href ="">PROCESS</Link>
          <Link  href = "">DATASET</Link>

        </div>
          <Link 
            className="h-[55px] bg-white rounded-[10px] text-black px-[32px] py-[14px] mr-[85px] font-manrope text-[20px] border"
            href="/dream"
          >
            GET STARTED
          </Link>
      </header>
    </div>
  );
}

