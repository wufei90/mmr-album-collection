const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("AlbumCollection", function () {
  async function deployContractsFixture() {
    /* deploy the collection */
    const Collection = await ethers.getContractFactory("AlbumCollection");
    const collection = await Collection.deploy();
    await collection.deployed();

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();

    return { nft, collection };
  }

  it("Should be able to add an album to the collection", async function () {
    const { nft, collection } = await loadFixture(deployContractsFixture);

    const [owner] = await ethers.getSigners();
    console.log("deployer: ", owner.address);

    /* create a token */
    await nft.createToken("https://www.mytokenlocation.com");

    /* add it to the collection */
    await collection.createAlbum(1);

    /* query for and return user's albums */
    albums = await collection.fetchMyAlbums();
    albums = await Promise.all(
      albums.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let album = {
          tokenId: i.tokenId.toString(),
          albumId: i.albumId.toString(),
          owner: i.owner,
          tokenUri,
        };
        return album;
      })
    );
    console.log("albums: ", albums);
    expect(albums.length).to.equal(1);
  });

  it("Should be able to transfer an album to another collection", async function () {
    const { nft, collection } = await loadFixture(deployContractsFixture);

    const [owner, to] = await ethers.getSigners();
    console.log("deployer: ", owner.address);
    console.log("to: ", to.address);

    /* create a token */
    await nft.createToken("https://www.mytokenlocation.com");

    /* add it to the collection */
    await collection.createAlbum(1);

    /* transfer the token*/
    await collection.transferAlbum(to.address, 1);

    /* query for and return owner's albums */
    albums = await collection.fetchMyAlbums();
    albums = await Promise.all(
      albums.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let album = {
          tokenId: i.tokenId.toString(),
          albumId: i.albumId.toString(),
          owner: i.owner,
          tokenUri,
        };
        return album;
      })
    );
    console.log("albums: ", albums);
    expect(albums.length).to.equal(0);

    /* query for and return to's albums */
    albums = await collection.connect(to).fetchMyAlbums();
    albums = await Promise.all(
      albums.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let album = {
          tokenId: i.tokenId.toString(),
          albumId: i.albumId.toString(),
          owner: i.owner,
          tokenUri,
        };
        return album;
      })
    );
    console.log("albums: ", albums);
    expect(albums[0].owner).to.equal(to.address);
  });

  it("Should be able to remove an album from the collection", async function () {
    const { nft, collection } = await loadFixture(deployContractsFixture);

    const [owner] = await ethers.getSigners();
    console.log("deployer: ", owner.address);

    /* create a token */
    await nft.createToken("https://www.mytokenlocation.com");

    /* add it to the collection */
    await collection.createAlbum(1);

    /* query for and return owner's albums */
    albums = await collection.fetchMyAlbums();
    albums = await Promise.all(
      albums.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let album = {
          tokenId: i.tokenId.toString(),
          albumId: i.albumId.toString(),
          owner: i.owner,
          burned: i.burned.toString(),
          tokenUri,
        };
        return album;
      })
    );
    console.log("albums: ", albums);
    expect(albums.length).to.equal(1);
    expect(albums[0].burned).to.equal("false");

    /* remove the album from the collection */
    await collection.removeAlbum(1);

    /* query for and return to's albums */
    albums = await collection.fetchMyAlbums();
    albums = await Promise.all(
      albums.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let album = {
          tokenId: i.tokenId.toString(),
          albumId: i.albumId.toString(),
          owner: i.owner,
          burned: i.burned.toString(),
          tokenUri,
        };
        return album;
      })
    );
    console.log("albums: ", albums);
    expect(albums.length).to.equal(0);
  });
});
