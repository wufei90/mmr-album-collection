import React from "react";
import Link from "next/link";
import {useRouter} from 'next/router';
import Image from "next/image";
import { formatAddress } from "./utils";

const navigation = [
  { name: "Collection", href: "/" },
  { name: "Add Album", href: "/add-album" },
  { name: "Activity", href: "/activity" },
];

const NavBar = (props) => {
  const {currentAccount, connectAccount} = props;
  const router = useRouter();

  return (
    <nav className="flex flex-row items-center justify-between border-b shadow-sm bg-white px-10">
      <Image src="/logo.png" alt="Logo" width={109} height={30} />
      <div className="flex px-10">
      {navigation.map((item) => (
           <Link href={item.href} key={item.name}>
             <a
               className={"px-6 py-5 " + (router.route === item.href ? "border-b-2 border-purple-900 font-medium text-purple-900" : "text-gray-400")}
               aria-current={router.route === item.href ? "page" : undefined}
             >
               {item.name}
             </a>
           </Link>
         ))}
      </div>
      <div>
        {currentAccount ? (
          <button className="bg-purple-900 text-white font-medium text-sm rounded-3xl px-6 py-2 transition duration-200 hover:bg-purple-700">
            {formatAddress(currentAccount)}
          </button>
        ) : (
          <button onClick={connectAccount} className="bg-purple-900 text-white font-medium text-sm rounded-3xl px-6 py-2 transition duration-200 hover:bg-purple-700">
            Connect Wallet
          </button>
        )
        }
      </div>
    </nav>
  );
};

export default NavBar;
