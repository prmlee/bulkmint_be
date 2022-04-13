export interface MetajsonInterface {
  [key: string]: MetadataInterface;
}

interface MetadataInterface {
  url: string;
  data: NFTdataInterface;
}

interface NFTdataInterface {
  name: string;
  description: string;
  image: string;
  attributes: string[];
}
