import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const settings=sqliteTable('settings',{id:integer('id').primaryKey(),configJson:text('config_json').notNull(),keyCipher:text('key_cipher'),updatedAt:text('updated_at').notNull()});
export const sends=sqliteTable('sends',{id:text('id').primaryKey(),company:text('company').notNull(),phone:text('phone').notNull(),message:text('message').notNull(),type:text('type').notNull(),openedAt:text('opened_at').notNull(),status:text('status').notNull().default('opened'),confirmedAt:text('confirmed_at')});
