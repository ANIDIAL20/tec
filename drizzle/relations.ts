import { relations } from "drizzle-orm/relations";
import { clients, contactLensPrescriptions, supplierOrders, supplierOrderItems, products, suppliers, supplierPayments, supplierOrderPayments, materials, colors, brands, stockMovements, devis, sales, users, sessions, prescriptionsLegacy, clientTransactions, lensOrders, prescriptions, reservations, clientInteractions, marketCreditAccounts, marketCreditMovements, frameReservations, saleItems, saleContactLensDetails, saleLensDetails, cashSessions, cashMovements, comptabiliteJournal, goodsReceipts, goodsReceiptItems, user, session, supplierCredits, supplierCreditAllocations, accounts, account } from "./schema";

export const contactLensPrescriptionsRelations = relations(contactLensPrescriptions, ({one}) => ({
	client: one(clients, {
		fields: [contactLensPrescriptions.clientId],
		references: [clients.id]
	}),
}));

export const clientsRelations = relations(clients, ({many}) => ({
	contactLensPrescriptions: many(contactLensPrescriptions),
	devis: many(devis),
	prescriptionsLegacies: many(prescriptionsLegacy),
	sales: many(sales),
	clientTransactions: many(clientTransactions),
	lensOrders: many(lensOrders),
	prescriptions: many(prescriptions),
	reservations: many(reservations),
	clientInteractions: many(clientInteractions),
	frameReservations: many(frameReservations),
}));

export const supplierOrderItemsRelations = relations(supplierOrderItems, ({one, many}) => ({
	supplierOrder: one(supplierOrders, {
		fields: [supplierOrderItems.orderId],
		references: [supplierOrders.id]
	}),
	product: one(products, {
		fields: [supplierOrderItems.productId],
		references: [products.id]
	}),
	goodsReceiptItems: many(goodsReceiptItems),
}));

export const supplierOrdersRelations = relations(supplierOrders, ({one, many}) => ({
	supplierOrderItems: many(supplierOrderItems),
	supplier: one(suppliers, {
		fields: [supplierOrders.supplierId],
		references: [suppliers.id]
	}),
	supplierOrderPayments: many(supplierOrderPayments),
	supplierPayments: many(supplierPayments),
	lensOrders: many(lensOrders),
	supplierCredits: many(supplierCredits),
	supplierCreditAllocations: many(supplierCreditAllocations),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	supplierOrderItems: many(supplierOrderItems),
	material: one(materials, {
		fields: [products.matiereId],
		references: [materials.id]
	}),
	color: one(colors, {
		fields: [products.couleurId],
		references: [colors.id]
	}),
	supplier: one(suppliers, {
		fields: [products.fournisseurId],
		references: [suppliers.id]
	}),
	brand: one(brands, {
		fields: [products.marqueId],
		references: [brands.id]
	}),
	stockMovements: many(stockMovements),
	saleItems: many(saleItems),
	goodsReceiptItems: many(goodsReceiptItems),
}));

export const suppliersRelations = relations(suppliers, ({many}) => ({
	supplierOrders: many(supplierOrders),
	products: many(products),
	supplierPayments: many(supplierPayments),
	lensOrders: many(lensOrders),
	supplierCredits: many(supplierCredits),
	goodsReceipts: many(goodsReceipts),
}));

export const supplierOrderPaymentsRelations = relations(supplierOrderPayments, ({one}) => ({
	supplierPayment: one(supplierPayments, {
		fields: [supplierOrderPayments.paymentId],
		references: [supplierPayments.id]
	}),
	supplierOrder: one(supplierOrders, {
		fields: [supplierOrderPayments.orderId],
		references: [supplierOrders.id]
	}),
}));

export const supplierPaymentsRelations = relations(supplierPayments, ({one, many}) => ({
	supplierOrderPayments: many(supplierOrderPayments),
	supplier: one(suppliers, {
		fields: [supplierPayments.supplierId],
		references: [suppliers.id]
	}),
	supplierOrder: one(supplierOrders, {
		fields: [supplierPayments.orderId],
		references: [supplierOrders.id]
	}),
}));

export const materialsRelations = relations(materials, ({many}) => ({
	products: many(products),
}));

export const colorsRelations = relations(colors, ({many}) => ({
	products: many(products),
}));

export const brandsRelations = relations(brands, ({many}) => ({
	products: many(products),
}));

export const stockMovementsRelations = relations(stockMovements, ({one}) => ({
	product: one(products, {
		fields: [stockMovements.productId],
		references: [products.id]
	}),
}));

export const devisRelations = relations(devis, ({one}) => ({
	client: one(clients, {
		fields: [devis.clientId],
		references: [clients.id]
	}),
	sale: one(sales, {
		fields: [devis.saleId],
		references: [sales.id]
	}),
}));

export const salesRelations = relations(sales, ({one, many}) => ({
	devis: many(devis),
	client: one(clients, {
		fields: [sales.clientId],
		references: [clients.id]
	}),
	lensOrders: many(lensOrders),
	reservations: many(reservations),
	frameReservations: many(frameReservations),
	saleItems: many(saleItems),
	comptabiliteJournals: many(comptabiliteJournal),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sessions: many(sessions),
	accounts: many(accounts),
}));

export const prescriptionsLegacyRelations = relations(prescriptionsLegacy, ({one, many}) => ({
	client: one(clients, {
		fields: [prescriptionsLegacy.clientId],
		references: [clients.id]
	}),
	lensOrders: many(lensOrders),
}));

export const clientTransactionsRelations = relations(clientTransactions, ({one}) => ({
	client: one(clients, {
		fields: [clientTransactions.clientId],
		references: [clients.id]
	}),
}));

export const lensOrdersRelations = relations(lensOrders, ({one}) => ({
	client: one(clients, {
		fields: [lensOrders.clientId],
		references: [clients.id]
	}),
	prescriptionsLegacy: one(prescriptionsLegacy, {
		fields: [lensOrders.prescriptionId],
		references: [prescriptionsLegacy.id]
	}),
	sale: one(sales, {
		fields: [lensOrders.saleId],
		references: [sales.id]
	}),
	supplier: one(suppliers, {
		fields: [lensOrders.supplierId],
		references: [suppliers.id]
	}),
	supplierOrder: one(supplierOrders, {
		fields: [lensOrders.supplierOrderId],
		references: [supplierOrders.id]
	}),
}));

export const prescriptionsRelations = relations(prescriptions, ({one}) => ({
	client: one(clients, {
		fields: [prescriptions.clientId],
		references: [clients.id]
	}),
}));

export const reservationsRelations = relations(reservations, ({one}) => ({
	client: one(clients, {
		fields: [reservations.clientId],
		references: [clients.id]
	}),
	sale: one(sales, {
		fields: [reservations.saleId],
		references: [sales.id]
	}),
}));

export const clientInteractionsRelations = relations(clientInteractions, ({one}) => ({
	client: one(clients, {
		fields: [clientInteractions.clientId],
		references: [clients.id]
	}),
}));

export const marketCreditMovementsRelations = relations(marketCreditMovements, ({one}) => ({
	marketCreditAccount: one(marketCreditAccounts, {
		fields: [marketCreditMovements.creditAccountId],
		references: [marketCreditAccounts.id]
	}),
}));

export const marketCreditAccountsRelations = relations(marketCreditAccounts, ({many}) => ({
	marketCreditMovements: many(marketCreditMovements),
}));

export const frameReservationsRelations = relations(frameReservations, ({one}) => ({
	client: one(clients, {
		fields: [frameReservations.clientId],
		references: [clients.id]
	}),
	sale: one(sales, {
		fields: [frameReservations.saleId],
		references: [sales.id]
	}),
}));

export const saleItemsRelations = relations(saleItems, ({one, many}) => ({
	sale: one(sales, {
		fields: [saleItems.saleId],
		references: [sales.id]
	}),
	product: one(products, {
		fields: [saleItems.productId],
		references: [products.id]
	}),
	saleContactLensDetails: many(saleContactLensDetails),
	saleLensDetails: many(saleLensDetails),
}));

export const saleContactLensDetailsRelations = relations(saleContactLensDetails, ({one}) => ({
	saleItem: one(saleItems, {
		fields: [saleContactLensDetails.saleItemId],
		references: [saleItems.id]
	}),
}));

export const saleLensDetailsRelations = relations(saleLensDetails, ({one}) => ({
	saleItem: one(saleItems, {
		fields: [saleLensDetails.saleItemId],
		references: [saleItems.id]
	}),
}));

export const cashMovementsRelations = relations(cashMovements, ({one}) => ({
	cashSession: one(cashSessions, {
		fields: [cashMovements.sessionId],
		references: [cashSessions.id]
	}),
}));

export const cashSessionsRelations = relations(cashSessions, ({many}) => ({
	cashMovements: many(cashMovements),
}));

export const comptabiliteJournalRelations = relations(comptabiliteJournal, ({one}) => ({
	sale: one(sales, {
		fields: [comptabiliteJournal.saleId],
		references: [sales.id]
	}),
}));

export const goodsReceiptItemsRelations = relations(goodsReceiptItems, ({one}) => ({
	goodsReceipt: one(goodsReceipts, {
		fields: [goodsReceiptItems.receiptId],
		references: [goodsReceipts.id]
	}),
	supplierOrderItem: one(supplierOrderItems, {
		fields: [goodsReceiptItems.orderItemId],
		references: [supplierOrderItems.id]
	}),
	product: one(products, {
		fields: [goodsReceiptItems.productId],
		references: [products.id]
	}),
}));

export const goodsReceiptsRelations = relations(goodsReceipts, ({one, many}) => ({
	goodsReceiptItems: many(goodsReceiptItems),
	supplier: one(suppliers, {
		fields: [goodsReceipts.supplierId],
		references: [suppliers.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const supplierCreditsRelations = relations(supplierCredits, ({one, many}) => ({
	supplier: one(suppliers, {
		fields: [supplierCredits.supplierId],
		references: [suppliers.id]
	}),
	supplierOrder: one(supplierOrders, {
		fields: [supplierCredits.relatedOrderId],
		references: [supplierOrders.id]
	}),
	supplierCreditAllocations: many(supplierCreditAllocations),
}));

export const supplierCreditAllocationsRelations = relations(supplierCreditAllocations, ({one}) => ({
	supplierCredit: one(supplierCredits, {
		fields: [supplierCreditAllocations.creditId],
		references: [supplierCredits.id]
	}),
	supplierOrder: one(supplierOrders, {
		fields: [supplierCreditAllocations.orderId],
		references: [supplierOrders.id]
	}),
}));

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));