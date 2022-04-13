// @ts-nocheck

import { Column, PrimaryGeneratedColumn, JoinColumn, Entity, ManyToOne } from 'typeorm';
import { Bulk } from './bulk.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'token_id' })
  public tokenId: number;

  @Column({ name: 'sku_id' })
  public skuId: number;

  @ManyToOne(() => Bulk, b => b.id)
  @JoinColumn({ name: 'bulk_id', nullable: false })
  public bulk: Bulk;
}
