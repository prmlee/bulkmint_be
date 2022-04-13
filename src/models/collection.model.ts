export interface CollectionParams {
  name: string;
  symbol: string;
  address: string;
  lastId: number;
  metadata: string;
  page: number;
  pageSize: number;
}

export type NameSymbolParams = Pick<CollectionParams, 'name' | 'symbol'>;

export type CreateParams = Pick<CollectionParams, 'name' | 'symbol' | 'address'>;

export type PagingParams = Pick<CollectionParams, 'page' | 'pageSize'>;
