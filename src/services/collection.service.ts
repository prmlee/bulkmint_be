import fs from 'fs';
import { getManager, getRepository } from 'typeorm';
import { Collection } from '../database/entities/collection.entity';
import { getRootPath } from '../utils/other.utils';
import { NftContract } from './contract/factory.contract.service';
import { CreateParams } from '../models/collection.model';

const findAllCollections = async (skip: number, take: number): Promise<[Collection[], number]> => {
  const collections = await getRepository(Collection).findAndCount({ skip, take });
  return collections;
};

const findCollection = async (id: string): Promise<Collection | undefined> => {
  const nftData: Collection | undefined = await getRepository(Collection).findOne({ where: { id } });
  return nftData;
};

const findCollectionByAddress = async (address: string): Promise<Collection | undefined> => {
  const nftData: Collection | undefined = await getRepository(Collection).findOne({ where: { address } });
  return nftData;
};

const findCollectionByNameOrSymbol = async (name: string, symbol: string): Promise<Collection | undefined> => {
  const collectionData: Collection | undefined = await getRepository(Collection)
    .createQueryBuilder('collection')
    .where('collection.name = :name', { name })
    .orWhere('collection.symbol = :symbol', { symbol })
    .getOne();
  return collectionData;
};

const createCollection = async (param: CreateParams): Promise<Collection> => {
  // create the metadata json file
  const now = new Date();
  const metadataFileName: string = `metadata_${now.getTime()}.json`;
  fs.writeFileSync(`${getRootPath()}/metadatas/${metadataFileName}`, JSON.stringify({}));

  const collectionData = new Collection();
  collectionData.name = param.name;
  collectionData.symbol = param.symbol;
  collectionData.address = param.address;
  collectionData.metadataFile = metadataFileName;

  const collection = await getManager().save(collectionData);

  // const serverUri = process.env.SERVER_URI || 'localhost:3001';
  // const uri = `${serverUri}/api/nft/${collection.address}/`;
  // await NftContract.setBaseUri(collection.address, uri);
  // console.log('uri: ', uri);
  return collection;
};

const revealNft = async (address: string): Promise<void> => {
  const collection = await findCollectionByAddress(address);
  if (!collection) {
    return;
  }
  const serverUri = process.env.SERVER_URI || '';
  const uri = `${serverUri}/api/nft/${collection.address}/`;
  console.log(`setting the base uri of ${collection.address} contract ....`);
  await NftContract.setBaseUri(collection.address, uri);
  console.log('set the base uri');
};

const createNft = async (name: string, symbol: string): Promise<Collection> => {
  // call the contract function and get the contract address
  console.log('creating the nft contract ....');
  // const address: string = await NftContract.createERC721(name, symbol);
  const address = await NftContract.createNftContract(name, symbol);
  console.log('contract created at ', address);

  // create the metadata json file
  const now = new Date();
  const metadataFileName: string = `metadata_${now.getTime()}.json`;
  fs.writeFileSync(`${getRootPath()}/metadatas/${metadataFileName}`, JSON.stringify({}));

  // check name and symbol duplicated or not

  // insert the data into nfts table
  const nftData = new Collection();
  nftData.name = name;
  nftData.symbol = symbol;
  nftData.address = address;
  nftData.metadataFile = metadataFileName;

  const createdNftData = await getManager().save(nftData);
  return createdNftData;
};

export const CollectionService = {
  findAllCollections,
  findCollection,
  findCollectionByAddress,
  findCollectionByNameOrSymbol,
  createCollection,
};
