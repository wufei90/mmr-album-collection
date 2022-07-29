import React from "react";
import Image from "next/image";

const NotConnected = () => {

  return (
    <div
    id="notConnectedScreen"
    className="flex justify-center h-full mx-auto w-[1152px] mt-20"
    >
        <div className="flex flex-col items-center">
            <p className="mb-6">Please connect your Wallet to manage your collection.</p>
            <div className="relative w-[169px] h-[160px]">
                <Image
                src="/metamask.png"
                alt="wallet-icon"
                layout="fill"
                objectFit="contain"
                />
            </div>
        </div>
    </div>
  );
};

export default NotConnected;
