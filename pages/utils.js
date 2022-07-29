import { utils } from "ethers";

// Format wallet address
export const formatAddress = (address) => {
    // Convert address to a checksum standard address
    address = utils.getAddress(address)
    // Extract first 5 and last 4 characters
    const formattedAddress = address.slice(0,5) + "..." + address.slice(-4);
    return formattedAddress;
}