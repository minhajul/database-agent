import { integer, pgTable, text, varchar, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    email: text().notNull(),
    verifiedAT: timestamp('verified_at').default(sql`NULL`),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const productsTable = pgTable('products', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    title: varchar('title', { length: 255 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    discounted_price: decimal('discounted_price', { precision: 10, scale: 2 }),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});

export const ordersTable = pgTable('orders', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer('user_id').notNull(),
    product_id: integer('product_id').notNull(),
    quantity: integer('quantity').notNull(),
    total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
    order_status: varchar('order_status', { length: 50 }).default('pending'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});
