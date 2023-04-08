import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from './article'
import { User } from './user'

@Entity({name: 'comments'})
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  content!: string;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;


  // JoinColumn定义后 指定的外健列会被创建在comment实体中
  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user!: User;

  @ManyToOne(() => Article)
  @JoinColumn({name: 'article_id'})
  article!: Article;
}