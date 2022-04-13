import { Collection } from '../database/entities/collection.entity';

export interface BulkParams {
  membership: boolean;
  transferable: boolean;
  company: string;
  title: string;
  team: string;
  player: string;
  creatorName: string;
  creatorWallet: string;
  royalty: number;
  fee: number;
  quantity: number;
  skuPrefix: string;
  nftUrl: string;
  description: string;
  actualAsset: string;
  previewAsset: string;
  photo: string;
  collection: Collection;
  startTokenId: number;
}

export type CreateBulkParams = Omit<BulkParams, 'startTokenId' | 'collection'>;

export type MintParams = {
  bulk: string; // bulk uuid
  collection: string; // collection uuid
  startTokenId: number;
};

export type MintBulk = Pick<BulkParams, 'skuPrefix' | 'quantity' | 'royalty' | 'fee'> & { address: string; tokenUri: string };
