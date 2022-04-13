// @ts-nocheck
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'symbol' })
  public symbol: string;

  @Column({ name: 'address' })
  public address: string;

  @Column({ name: 'last_id', default: 0 })
  public lastId: number = 0;

  @Column({ name: 'metadata_file' })
  public metadataFile: string;
}
