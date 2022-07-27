// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract AlbumCollection is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _albumIds;

    constructor() {}

    struct Album {
        uint albumId;
        uint256 tokenId;
        address owner;
        bool burned;
    }

    mapping(uint256 => Album) private idToAlbum;

    event AlbumCreated(
        uint indexed albumId,
        uint256 indexed tokenId,
        address indexed owner,
        bool burned
    );

    // Add an album to a user's collection
    function createAlbum(uint256 tokenId) public {
        _albumIds.increment();
        uint256 albumId = _albumIds.current();

        idToAlbum[albumId] = Album(albumId, tokenId, msg.sender, false);

        emit AlbumCreated(albumId, tokenId, msg.sender, false);
    }

    // Transfer album to another collection
    function transferAlbum(address to, uint256 albumId) public nonReentrant {
        require(
            msg.sender == idToAlbum[albumId].owner,
            "Only the owner can transfer an album"
        );
        idToAlbum[albumId].owner = to;
    }

    // Remove album from the user's collection
    function removeAlbum(uint256 albumId) public {
        require(
            msg.sender == idToAlbum[albumId].owner,
            "Only the owner can remove an album from the collection"
        );
        idToAlbum[albumId].burned = true;
    }

    // Returns all albums from a user's collection
    function fetchMyAlbums() public view returns (Album[] memory) {
        uint totalAlbumCount = _albumIds.current();
        uint albumCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalAlbumCount; i++) {
            if (
                idToAlbum[i + 1].owner == msg.sender && !idToAlbum[i + 1].burned
            ) {
                albumCount += 1;
            }
        }

        Album[] memory albums = new Album[](albumCount);
        for (uint i = 0; i < totalAlbumCount; i++) {
            if (
                idToAlbum[i + 1].owner == msg.sender && !idToAlbum[i + 1].burned
            ) {
                uint currentId = i + 1;
                Album storage currentAlbum = idToAlbum[currentId];
                albums[currentIndex] = currentAlbum;
                currentIndex += 1;
            }
        }
        return albums;
    }
}
