import e, { Request, Response } from 'express';
import { CollectionService } from '../services/collection.service';
import { CreateParams, NameSymbolParams, PagingParams } from '../models/collection.model';
import fs from 'fs';

const findAll = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = req.query as unknown as PagingParams;
    const skip = page * pageSize;
    const collections = await CollectionService.findAllCollections(skip, pageSize);
    res.send({ error: null, data: collections });
  } catch (error) {
    console.log(error);
    res.send({ error, data: null });
  }
};

const findByNameOrSymbol = async (req: Request, res: Response) => {
  try {
    const { name, symbol } = req.query as NameSymbolParams;
    const collection = await CollectionService.findCollectionByNameOrSymbol(name, symbol);
    res.send({ error: null, data: collection ?? null });
  } catch (error) {
    console.log(error);
    res.send({ error, data: null });
  }
};

const findByAddress = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const collection = await CollectionService.findCollectionByAddress(address);
    res.send({ error: null, data: collection ?? null });
  } catch (error) {
    console.log(error);
    res.send({ error, data: null });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const param = req.body as CreateParams;
    console.log(param);
    const createdCollection = await CollectionService.createCollection(param);
    res.send({ error: null, data: createdCollection });
  } catch (error) {
    console.log(error);
  }
};

const getMetadata = async (req: Request, res: Response) => {
  try {
    const { address, tokenId } = req.params;
    const collection = await CollectionService.findCollectionByAddress(address);
    if (!collection) {
      res.send({ error: "Collection doesn't exist", data: null });
      return;
    }
    const metadataUri = `./metadatas/${collection.metadataFile}`;
    const metadata = JSON.parse(fs.readFileSync(metadataUri).toString());
    res.send(metadata[`${tokenId}`].data);
  } catch (error) {
    console.log(error);
  }
};

export const CollectionController = { findAll, findByAddress, findByNameOrSymbol, create, getMetadata };
