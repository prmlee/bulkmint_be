import { Request, Response } from 'express';
import httpStatus from 'http-status';
// import metadata from '../../metadata.json';
import { MetajsonInterface } from '../interfaces/metadata.interface';
import { CollectionService } from '../services/collection.service';
import fs from 'fs';

const get = async (req: Request, res: Response) => {
  // try {
  //   const { id } = req.params;
  //   const data = (metadata as MetajsonInterface)[id]?.data;
  //   if (data) res.status(httpStatus.OK).send({ data });
  //   else res.status(httpStatus.NOT_FOUND).json({ message: 'Out of Index' });
  // } catch (error) {
  //   res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  // }
};

const getMetaData = async (req: Request, res: Response) => { 
  try {
    const { address, tokenId } = req.params;
    console.log(address, tokenId);
    const collection = await CollectionService.findCollectionByAddress(address);
    if (!collection) {
      res.send({ error: "Nft doesn't exist", data: null });
      return;
    }
    const metadataUri = `./metadatas/${collection.metadataFile}`;
    const metadata = JSON.parse(fs.readFileSync(metadataUri).toString());
    res.send(metadata[`${tokenId}`].data);
  } catch (error) {
    console.log(error);
  }
}

export const TokenController = { get, getMetaData };
