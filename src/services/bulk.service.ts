import fs from 'fs';
import { getRepository } from 'typeorm';
import { Bulk } from '../database/entities/bulk.entity';
import { Collection } from '../database/entities/collection.entity';
import { Token } from '../database/entities/token.entity';
import { CreateBulkParams } from '../models/bulk.model';
import { CollectionService } from './collection.service';

const findBulkById = async (id: string): Promise<Bulk | undefined> => {
  return await getRepository(Bulk).findOne({ where: { id } });
};

const findAllBulks = async (skip: number, take: number): Promise<[Bulk[], number]> => {
  const bulks = await getRepository(Bulk).findAndCount({ skip, take });
  return bulks;
};

const findBulkByTitle = async (title: string): Promise<Bulk | undefined> => {
  const bulk: Bulk | undefined = await getRepository(Bulk).findOne({ where: { title } });
  return bulk;
};

const saveBulk = async (params: CreateBulkParams): Promise<Bulk> => {
  const bulk = params as Bulk;
  return await getRepository(Bulk).save(bulk);
};

const saveTokens = async (bulkId: string, collectionAddress: string, startTokenId: number): Promise<boolean> => {
  const bulk = await findBulkById(bulkId);
  const collection = await CollectionService.findCollectionByAddress(collectionAddress);
  if (bulk != undefined && collection != undefined) {
    bulk.startTokenId = collection.lastId + 1;
    collection.lastId += bulk.quantity;
    bulk.collection = collection;
    const tokens: Token[] = bulkToTokens(bulk);
    await getRepository(Token).save(tokens);
    await getRepository(Bulk).save(bulk);
    await getRepository(Collection).save(collection);
    await putBulkDataToMetadata(bulk, `./metadatas/${collection.metadataFile}`);
    return true;
  }
  return false;
};

const bulkToTokens = (bulk: Bulk) => {
  const tokens: Token[] = [];
  for (let i = 0; i < bulk.quantity; i++) {
    const token = { tokenId: bulk.startTokenId + i, skuId: i + 1, bulk } as Token;
    tokens.push(token);
  }
  return tokens;
};

const putBulkDataToMetadata = async (bulk: Bulk, metadataUri: string): Promise<void> => {
  const metadata = JSON.parse(fs.readFileSync(metadataUri).toString());
  for (let i = 0; i < bulk.quantity; i++) {
    const tokenId = bulk.startTokenId + i;
    metadata[`${tokenId.toString()}`] = {
      preview: bulk.previewAsset,
      data: {
        name: `#${tokenId} • ${bulk.skuPrefix}-#${i + 1}`,
        description: `${bulk.description}`,
        image: `${bulk.nftUrl}`,
        animation_url: `${bulk.previewAsset}`,
        attribute: [
          {
            trait_type: 'membership',
            value: bulk.membership,
          },
          {
            trait_type: 'transferable',
            value: bulk.transferable,
          },
          {
            trait_type: 'company',
            value: bulk.company,
          },
          {
            trait_type: 'title',
            value: bulk.title,
          },
          {
            trait_type: 'team',
            value: bulk.team,
          },
          {
            trait_type: 'player',
            value: bulk.player,
          },
          {
            trait_type: 'creator',
            value: bulk.creatorName,
          },
          {
            trait_type: 'royalty',
            value: bulk.royalty + '%',
          },
          {
            trait_type: 'fee',
            value: bulk.fee + '%',
          },
          {
            trait_type: 'sku prefix',
            value: bulk.skuPrefix,
          },
          {
            trait_type: 'sku index',
            value: i + 1,
          },
          {
            trait_type: 'actual asset',
            value: bulk.actualAsset,
          }
        ],
      },
    };
  }
  const metadataString = JSON.stringify(metadata);
  fs.writeFileSync(metadataUri, metadataString);
};

export const BulkService = { findBulkById, findAllBulks, findBulkByTitle, saveBulk, saveTokens };
