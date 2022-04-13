// @ts-nocheck
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';

@Entity('bulks')
export class Bulk {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'membership', nullable: false, default: false })
  public membership: boolean;

  @Column({ name: 'transferable', nullable: false, default: false })
  public transferable: boolean;

  @Column({ name: 'company', length: 100 })
  public company: string;

  @Column({ name: 'title', length: 100, unique: true })
  public title: string;

  @Column({ name: 'team', length: 100 })
  public team: string;

  @Column({ name: 'player', length: 100 })
  public player: string;

  @Column({ name: 'creator_name', length: 100 })
  public creatorName: string;

  @Column({ name: 'creator_wallet', length: 50 })
  public creatorWallet: string;

  @Column({ name: 'royalty', type: 'decimal', precision: 4, scale: 2, default: 0 })
  public royalty: number;

  @Column({ name: 'fee', type: 'decimal', precision: 4, scale: 2, default: 0 })
  public fee: number;

  @Column({ name: 'quantity', default: 0 })
  public quantity: number;

  @Column({ name: 'sku_prefix', length: 100 })
  public skuPrefix: string;

  @Column({ name: 'nft_url', length: 300 })
  public nftUrl: string;

  @Column({ name: 'description', type: 'text' })
  public description: string;

  @Column({ name: 'actual_asset', length: 250 })
  public actualAsset: string;

  @Column({ name: 'preview_asset', length: 250 })
  public previewAsset: string;

  @Column({ name: 'photo', length: 250 })
  public photo: string;

  @Column({ name: 'start_token_id', default: 0})
  public startTokenId: number;

  @ManyToOne(() => Collection, c => c.id)
  @JoinColumn({ name: 'collection_id', nullable: true })
  public collection: Collection;
}
