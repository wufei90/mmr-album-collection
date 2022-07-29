import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";
import NotConnected from "./NotConnected";
import { ShareIcon, XIcon, PlusIcon } from "@heroicons/react/solid";
import { formatAddress } from "./utils";

import { albumcollectionaddress, nftaddress } from "../config";

import Collection from "../artifacts/contracts/Collection.sol/AlbumCollection.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

// Define the collector label
const getCollectorLvl = (count) => {
  switch(true) {
    case (count <= 9):
      return "Rookie";
    case ((count >= 10) && (count <= 24)):
      return "Novice"
    case ((count >= 25) && (count <= 49)):
      return "Advanced";
    case ((count >= 50) && (count <= 99)):
      return "Expert";
    case (count >= 100):
      return "Master";
  }
}

export default function Home(props) {
  const {currentAccount} = props;
  const [albums, setAlbums] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadAlbums();
  }, []);

  async function loadAlbums() {
    if (window.ethereum) {
      try {
        // Providing ethers with an abstraction for a connection to the Ethereum Network
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Allowing ethers to sign messages and transactions in order to perform operations.
        const signer = provider.getSigner();
        // Abstraction which represents a connection to the contract on the Ethereum Network
        const collectionContract = new ethers.Contract(
          albumcollectionaddress,
          Collection.abi,
          signer
        );

        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
        const data = await collectionContract.fetchMyAlbums();

        const albums = await Promise.all(
          data.map(async (i) => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId);
            const meta = await axios.get(tokenUri);
            let item = {
              tokenId: i.tokenId.toNumber(),
              owner: i.owner,
              name: meta.data.name,
              artist: meta.data.artist,
              image: meta.data.image,
            };
            return item;
          })
        );

        setAlbums(albums);
        setLoadingState("loaded");
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          alert('Please connect your MetaMask wallet.');
        } else {
          console.error(error);
        }
      } 
    }
  }

  if(!currentAccount){
    return(<NotConnected/>)
  }

  if (loadingState !== "loaded")
    return (
      <div
      className="flex justify-center h-full mx-auto w-[1152px] mt-20"
      >
        <p className="mb-6">Loading... Check that you are connected to the correct chain.</p>
      </div>
    );

  return (
    <div className="flex flex-row h-full py-10 mx-auto w-[1152px]">
      <div className="w-1/5 bg-white p-4 rounded shadow-sm">
        <div className="flex flex-col h-[180px] justify-center items-center border-b">
          <Image
            src="/profile.jpg"
            alt="pf"
            width={120}
            height={120}
            className="rounded-full"
          />
          <div className="my-2 font-bold text-lg">{formatAddress(currentAccount)}</div>
        </div>
        <div className="py-4 border-b">
          <div className="flex flex-row text-sm font-medium">
            <Image src="/badge.png" alt="badge" width={20} height={20} />
            <p className="ml-2">Novice Collector</p>
          </div>
          <div className="flex flex-row justify-between items-center mt-1">
            <div className="flex-auto h-2 bg-gray-200 rounded-lg">
              <div className="w-[90%] h-2 bg-purple-900 rounded-lg"></div>
            </div>
            <div className="ml-2 text-sm">{albums.length}</div>
          </div>
        </div>
        <div className="py-4">
          <div className="flex flex-row justify-between items-center mb-1 text-sm">
            <div className="text-gray-400">Joined</div>
            <p className="font-medium">Jul 2022</p>
          </div>
          <div className="flex flex-row justify-between items-center mb-1 text-sm">
            <div className="text-gray-400">No. artists</div>
            <p className="font-medium">4</p>
          </div>
          <div className="flex flex-row justify-between items-center text-sm">
            <div className="text-gray-400">Top artist</div>
            <p className="max-w-[60%] truncate font-medium">
              Girls&apos; Generation
            </p>
          </div>
        </div>
      </div>
      <div className="flex-auto">
        <div className="mb-5 px-8">
          {albums.length === 0 
            ? 'No album in the collection'
            : (albums.length + (
                albums.length === 1 ? ' album' : ' albums'
                )
              )
          }
        </div>
        <div className="grid grid-cols-4 gap-6 px-8">
          {
            albums.length === 0 ? (
              <div className="w-[197px] h-[197px] bg-white border-dashed border shadow-sm rounded-lg overflow-hidden flex flex-col justify-center items-center">
                 <Link href="/add-album">
                  <a className="flex flex-col items-center">
                    <PlusIcon className="h-16 w-16 text-gray-300" />
                    <p className="text-gray-400">Add Album</p>
                  </a>
                 </Link>
              </div>
            ) : (
              albums.map((album, i) => (
                <div
                  key={i}
                  className="max-w-[197px] border shadow-sm rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={album.image}
                      alt="Album image"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className="min-h-[75px] p-2 text-sm">
                    <p className="font-medium line-clamp-2 leading-tight mb-1">
                      {album.name}
                    </p>
                    <p className="truncate text-gray-400">
                      {album.artist}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between items-center p-2">
                    <ShareIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
                    <XIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              ))
            )
          }
          {/*<div
            key={1}
            className="max-w-[197px] border shadow-sm rounded-lg overflow-hidden flex flex-col"
          >
            <div className="relative w-full aspect-square">
              <Image
                src="/album_test.jpg"
                alt="Album image"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="min-h-[75px] p-2 text-sm">
              <p className="font-medium line-clamp-2 leading-tight mb-1">
                Good Luck
              </p>
              <p className="truncate text-gray-400">AoA</p>
            </div>
            <div className="flex flex-row justify-between items-center p-2">
              <ShareIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
              <XIcon className="h-4 w-4 text-gray-400 cursor-pointer" />
            </div>
          </div>*/}
         
        </div>
      </div>
    </div>
  );
}
