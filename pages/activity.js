import React from "react";
import Image from "next/image";
import { useState } from "react";
import NotConnected from "./NotConnected";

export default function AddAlbum() {
  const [connected,setConnected] = useState(false);

  /*if(!connected){
    return(<NotConnected/>)
  }*/
 
  return (
    <div
      id="activityFeed"
      className="flex flex-col items-center h-full py-10 mx-auto w-[1152px]"
    >
     <h3 className="font-medium text-lg mb-6">Latest Activity</h3>
     <div className="h-full w-[600px]">
      <div className="flex flex-row w-full p-10 bg-white shadow-sm rounded px-6 py-4 mb-4">
        <div>
          <Image
            src="/profile.jpg"
            alt="pf"
            width={35}
            height={35}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col flex-auto ml-4 text-sm">
          <p className="truncate">
            <span className="font-bold" >0x1dE...c266</span>&nbsp;
            added the album&nbsp;
            <span className="font-bold text-purple-900" >Good Luck</span>
          </p>
          <p className="text-gray-400">
            20 hours ago
          </p>
        </div>
      </div>
     </div>
    </div>
  );
}
