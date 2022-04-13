import { Request, Response } from 'express';
import { CreateBulkParams, MintParams } from '../models/bulk.model';
import { PagingParams } from '../models/collection.model';
import { BulkService } from '../services/bulk.service';

const findAll = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = req.query as unknown as PagingParams;
    const skip = page * pageSize;
    const bulks = await BulkService.findAllBulks(skip, pageSize);
    res.send({ error: null, data: bulks });
  } catch (error) {
    console.log(error);
    res.send({ error, data: null });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bulk = await BulkService.findBulkById(id);
    if (bulk) res.send({ error: null, data: bulk });
    else res.send({ error: "Bulk doesn't exist", data: null });
  } catch (error) {
    console.log(error);
    res.send({ error, data: null });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const params = req.body as CreateBulkParams;
    let bulk = await BulkService.findBulkByTitle(params.title);
    if (bulk) {
      res.send({ error: 'Bulk with same title exists', data: null });
      return;
    }
    bulk = await BulkService.saveBulk(params);
    res.send({ error: null, data: bulk });
  } catch (error) {
    console.log(error);
    res.send({ error, data: null });
  }
};

const mint = async (req: Request, res: Response) => {
  try {
    const { bulk, collection, startTokenId } = req.body as MintParams;
    console.log(bulk, collection, startTokenId);
    const result = await BulkService.saveTokens(bulk, collection, startTokenId);
    if (!result) {
      res.send({ error: "Bulk or Collection doesn't exist", data: null });
      return;
    }
    res.send({ error: null, data: 'Success Tokens Saved' });
  } catch (error) {
    console.log(error);
    res.send({ error, data: null });
  }
};

export const BulkController = { findById, findAll, create, mint };
