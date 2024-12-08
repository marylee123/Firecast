import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Features from "../components/Features";


export default function HomePage() {
  return (
  <main className="min-h-screen w-full flex flex-col items-center justify-center mt-[-150px]">
    {/* Header */}
    <Header />

    {/* Use Cases */}
    <div className="flex items-center flex-col sm:mt-10 text-center w-[70%] z-">
          <div className="flex flex-col space-y-10 mt-32 ">
            <div className="text-center">
              <h3 className="font-sora text-7xl mb-16 text-red-500">FIRECAST</h3>
              <p className="font-manrope text-4xl mb-16 text-yellow-500">Predicting wildfires in New Mexico Texas Region</p>
            </div>
        </div>
        <div className="absolute bottom-0 left-0 mb-[-300px] ">
        <Image
          alt="header text"
          src="/Vector.png"
          width={500}
          height={500}
        />
      </div>
    </div>

    {/* Features Title*/}
    <div className="w-full relative text-center font-display font tracking-normal text-white-300">
      <div className="absolute top-0 mt-[-30px] right-0">
      </div>
      <div className="absolute bottom-0 left-0">

      </div>
    </div>
    <Features />

  </main>
  );
}
