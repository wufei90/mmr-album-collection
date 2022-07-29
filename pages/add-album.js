import React from "react";
import { ethers } from "ethers";
import { useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import NotConnected from "./NotConnected";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { albumcollectionaddress, nftaddress } from "../config";

import Collection from "../artifacts/contracts/Collection.sol/AlbumCollection.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

export default function AddAlbum(props) {
  const {currentAccount} = props;
  const [formParams, updateFormParams] = useState({ name: '', artist: ''});
  const [fileURL, setFileURL] = useState(null);
  const [message, updateMessage] = useState('');
  const router = useRouter();

  // Upload the Album Cover to IPFS
  async function onChangeFile(e){
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileURL(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  // Upload metadata
  async function uploadMetadataToIPFS() {
    const { name, artist } = formParams;
    if (!name || !artist || !fileURL) return;
    // First, upload to IPFS
    const data = JSON.stringify({
      name,
      artist,
      image: fileURL,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      // After metadata are uploaded to IPFS, pass the URL to mint the album
      return url;
    } catch (error) {
      console.log("Error uploading metadata: ", error);
    }
  }

  // Mint an album to the collection
  async function mintAlbum(e) {
    e.preventDefault();

    try {
      // First, get url of metadata on IPFS
     /*const metadataURL = await uploadMetadataToIPFS();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      updateMessage("Please wait.. uploading (upto 5 mins)")

      // Next, create the NFT
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await contract.createToken(metadataURL);
      let tx = await transaction.wait();

      // Finally, add the album to the collection
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      contract = new ethers.Contract(albumcollectionaddress, Collection.abi, signer);
      transaction = await contract.createAlbum(tokenId);
      await transaction.wait();*/

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      updateMessage("Please wait.. uploading (upto 5 mins)")

      // Next, create the NFT
      let tokenId = 3;
      let contract = new ethers.Contract(albumcollectionaddress, Collection.abi, signer);
      let transaction = await contract.createAlbum(tokenId);
      await transaction.wait();

      alert("Successfully listed your NFT!");
      updateMessage("");
      updateFormParams({ name: '', artist: ''});
      router.push("/");

    } catch(error) {
      alert("Error when trying to add the album. Please try again");
      console.log("Error when minting: ", error);
    }

  }

  if(!currentAccount){
    return(<NotConnected/>)
  }

  return (
    <div
      id="albumForm"
      className="flex justify-center h-full py-10 mx-auto w-[1152px]"
    >
      <form className="min-w-[450px] bg-white shadow-sm rounded px-8 pt-4 pb-8">
        <h3 className="text-center font-medium mb-8">
          Add an Album to your Collection
        </h3>
        <div className="mb-4">
          <label
            className="block text-purple-900 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Album Name
          </label>
          <input
            className="shadow-sm appearance-none border rounded w-full text-sm py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Type Album Name"
            onChange={(e) =>
              updateFormParams({ ...formParams, name: e.target.value })
            }
            value={formParams.name}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-purple-900 text-sm font-bold mb-2"
            htmlFor="artist"
          >
            Artist
          </label>
          <input
            className="shadow-sm appearance-none border rounded w-full text-sm py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Type Artist"
            onChange={(e) =>
              updateFormParams({ ...formParams, artist: e.target.value })
            }
            value={formParams.artist}
          />
        </div>
        <div>
          <label
            className="block text-purple-900 text-sm font-bold mb-3"
            htmlFor="image"
          >
            Upload Cover
          </label>
          <input className="text-sm" type={"file"} onChange={onChangeFile}></input>
        </div>
        <br></br>
                <div className="text-green-700 text-center">{message}</div>
                <button onClick={mintAlbum} className="font-bold text-sm mt-5 w-full bg-purple-900 text-white rounded p-2 shadow-lg">
                    Add Album
                </button>
      </form>
    </div>
  );
}
