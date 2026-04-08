import { pgTable, foreignKey, unique, serial, text, integer, json, timestamp, uuid, varchar, numeric, index, jsonb, boolean, uniqueIndex, real, check, primaryKey, pgView } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const contactLensPrescriptions = pgTable("contact_lens_prescriptions", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	prescriptionData: json("prescription_data").notNull(),
	date: timestamp({ mode: 'string' }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "contact_lens_prescriptions_client_id_clients_id_fk"
		}),
	unique("contact_lens_prescriptions_firebase_id_unique").on(table.firebaseId),
]);

export const supplierOrderItems = pgTable("supplier_order_items", {
	id: serial().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	productId: integer("product_id"),
	reference: varchar({ length: 100 }),
	label: varchar({ length: 255 }).notNull(),
	quantity: integer().notNull(),
	unitPrice: numeric("unit_price", { precision: 15, scale:  2 }).notNull(),
	total: numeric({ precision: 15, scale:  2 }).notNull(),
	qtyReceived: integer("qty_received").default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [supplierOrders.id],
			name: "supplier_order_items_order_id_supplier_orders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "supplier_order_items_product_id_products_id_fk"
		}).onDelete("set null"),
]);

export const supplierOrders = pgTable("supplier_orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	supplierId: uuid("supplier_id"),
	firebaseId: text("firebase_id"),
	fournisseur: text(),
	montantTotal: numeric("montant_total", { precision: 15, scale:  2 }),
	statut: text().default('pending'),
	dateCommande: timestamp("date_commande", { mode: 'string' }).defaultNow(),
	dateReception: timestamp("date_reception", { mode: 'string' }),
	notes: text(),
	dueDate: timestamp("due_date", { mode: 'string' }),
	orderReference: text("order_reference"),
	subTotal: numeric("sub_total", { precision: 15, scale:  2 }),
	tva: numeric({ precision: 15, scale:  2 }),
	discount: numeric({ precision: 15, scale:  2 }),
	shippingCost: numeric("shipping_cost", { precision: 15, scale:  2 }),
	deliveryStatus: text("delivery_status"),
	orderNumber: text("order_number"),
	supplierPhone: text("supplier_phone"),
	expectedDelivery: timestamp("expected_delivery", { mode: 'string' }),
	createdBy: text("created_by"),
	templateVersionUsed: integer("template_version_used"),
	templateSnapshot: jsonb("template_snapshot"),
	amountPaid: numeric("amount_paid", { precision: 15, scale:  2 }).default('0').notNull(),
	remainingAmount: numeric("remaining_amount", { precision: 15, scale:  2 }).default('0').notNull(),
	paymentStatus: text("payment_status").default('unpaid').notNull(),
	status: text().default('pending'),
	currency: text().default('MAD'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_orders_supplier_date").using("btree", table.supplierId.asc().nullsLast().op("timestamptz_ops"), table.dateCommande.asc().nullsLast().op("timestamptz_ops"), table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [suppliers.id],
			name: "supplier_orders_supplier_id_suppliers_id_fk"
		}).onDelete("restrict"),
]);

export const supplierOrderPayments = pgTable("supplier_order_payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id"),
	paymentId: uuid("payment_id"),
	orderId: uuid("order_id"),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.paymentId],
			foreignColumns: [supplierPayments.id],
			name: "supplier_order_payments_payment_id_supplier_payments_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [supplierOrders.id],
			name: "supplier_order_payments_order_id_supplier_orders_id_fk"
		}).onDelete("cascade"),
]);

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	reference: text(),
	nom: text().notNull(),
	designation: text(),
	categorie: text(),
	marque: text(),
	fournisseur: text(),
	prixAchat: numeric("prix_achat", { precision: 10, scale:  2 }),
	prixVente: numeric("prix_vente", { precision: 10, scale:  2 }).notNull(),
	prixGros: numeric("prix_gros", { precision: 10, scale:  2 }),
	quantiteStock: integer("quantite_stock").default(0).notNull(),
	seuilAlerte: integer("seuil_alerte").default(5),
	description: text(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	modele: text(),
	couleur: text(),
	details: text(),
	matiereId: integer("matiere_id"),
	couleurId: integer("couleur_id"),
	version: integer().default(0).notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	reservedQuantity: integer("reserved_quantity").default(0).notNull(),
	availableQuantity: integer("available_quantity").default(0).notNull(),
	type: text().default('AUTRE').notNull(),
	hasTva: boolean("has_tva").default(true),
	priceType: text("price_type").default('TTC'),
	salePriceHt: numeric("sale_price_ht", { precision: 10, scale:  2 }),
	salePriceTva: numeric("sale_price_tva", { precision: 10, scale:  2 }),
	salePriceTtc: numeric("sale_price_ttc", { precision: 10, scale:  2 }),
	exemptionNote: text("exemption_note"),
	brand: text(),
	category: text().default('OPTIQUE'),
	productType: text("product_type").default('accessory'),
	tvaRate: numeric("tva_rate", { precision: 5, scale:  2 }).default('20.00'),
	isMedical: boolean("is_medical").default(false),
	isStockManaged: boolean("is_stock_managed").default(true),
	clientId: integer("client_id"),
	imageUrl: text("image_url"),
	fournisseurId: uuid("fournisseur_id"),
	numFacture: text("num_facture"),
	marqueId: integer("marque_id"),
	dateFacture: timestamp("date_facture", { mode: 'string' }),
}, (table) => [
	index("idx_products_brand").using("btree", table.brand.asc().nullsLast().op("text_ops")),
	index("idx_products_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("idx_products_client").using("btree", table.clientId.asc().nullsLast().op("int4_ops")),
	index("idx_products_not_deleted").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_products_type").using("btree", table.productType.asc().nullsLast().op("text_ops")),
	index("idx_products_user_deleted").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.deletedAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_products_user_marque").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.marque.asc().nullsLast().op("text_ops")),
	index("idx_products_user_reference").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.reference.asc().nullsLast().op("text_ops")),
	index("idx_products_user_stock").using("btree", table.userId.asc().nullsLast().op("int4_ops"), table.quantiteStock.asc().nullsLast().op("text_ops")),
	index("products_fournisseur_id_idx").using("btree", table.fournisseurId.asc().nullsLast().op("uuid_ops")),
	index("products_nom_idx").using("btree", table.nom.asc().nullsLast().op("text_ops")),
	index("products_reference_idx").using("btree", table.reference.asc().nullsLast().op("text_ops")),
	index("products_search_idx").using("btree", table.marque.asc().nullsLast().op("text_ops"), table.fournisseur.asc().nullsLast().op("text_ops")),
	index("products_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.matiereId],
			foreignColumns: [materials.id],
			name: "products_matiere_id_materials_id_fk"
		}),
	foreignKey({
			columns: [table.couleurId],
			foreignColumns: [colors.id],
			name: "products_couleur_id_colors_id_fk"
		}),
	foreignKey({
			columns: [table.fournisseurId],
			foreignColumns: [suppliers.id],
			name: "products_fournisseur_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.marqueId],
			foreignColumns: [brands.id],
			name: "products_marque_id_fkey"
		}),
	unique("products_firebase_id_unique").on(table.firebaseId),
]);

export const clients = pgTable("clients", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	fullName: text("full_name").notNull(),
	phone: text(),
	email: text(),
	address: text(),
	city: text(),
	notes: text(),
	balance: numeric({ precision: 10, scale:  2 }).default('0'),
	totalSpent: numeric("total_spent", { precision: 10, scale:  2 }).default('0'),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	lastVisit: timestamp("last_visit", { mode: 'string' }),
	userId: text("user_id").notNull(),
	prenom: text(),
	nom: text(),
	gender: text(),
	cin: text(),
	dateOfBirth: timestamp("date_of_birth", { mode: 'string' }),
	mutuelle: text(),
	phone2: text("phone_2"),
	creditLimit: numeric("credit_limit", { precision: 10, scale:  2 }).default('5000'),
}, (table) => [
	index("clients_full_name_idx").using("btree", table.fullName.asc().nullsLast().op("text_ops")),
	index("clients_phone_idx").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	index("clients_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	index("idx_clients_fullname_search").using("btree", table.fullName.asc().nullsLast().op("text_ops")),
	unique("clients_firebase_id_unique").on(table.firebaseId),
]);

export const settings = pgTable("settings", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	settingKey: text("setting_key").notNull(),
	value: json().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("settings_firebase_id_unique").on(table.firebaseId),
]);

export const stockMovements = pgTable("stock_movements", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	produitId: text("produit_id"),
	productId: integer("product_id"),
	quantite: integer().notNull(),
	type: text().notNull(),
	ref: text(),
	date: timestamp({ mode: 'string' }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "stock_movements_product_id_products_id_fk"
		}),
	unique("stock_movements_firebase_id_unique").on(table.firebaseId),
]);

export const devis = pgTable("devis", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	clientName: text("client_name").notNull(),
	clientPhone: text("client_phone"),
	items: json().notNull(),
	totalHt: numeric("total_ht", { precision: 10, scale:  2 }).notNull(),
	totalTtc: numeric("total_ttc", { precision: 10, scale:  2 }).notNull(),
	status: text().default('EN_ATTENTE'),
	saleId: integer("sale_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	validUntil: timestamp("valid_until", { mode: 'string' }),
	templateVersionUsed: integer("template_version_used"),
	templateSnapshot: jsonb("template_snapshot"),
	documentSettingsSnapshot: jsonb("document_settings_snapshot"),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "devis_client_id_clients_id_fk"
		}),
	foreignKey({
			columns: [table.saleId],
			foreignColumns: [sales.id],
			name: "devis_sale_id_sales_id_fk"
		}),
	unique("devis_firebase_id_unique").on(table.firebaseId),
]);

export const marketOrderMessages = pgTable("market_order_messages", {
	id: serial().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	senderId: text("sender_id").notNull(),
	senderRole: text("sender_role").notNull(),
	content: text().notNull(),
	attachmentUrl: text("attachment_url"),
	isRead: boolean("is_read").default(false).notNull(),
	readAt: timestamp("read_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("mom_order_id_idx").using("btree", table.orderId.asc().nullsLast().op("uuid_ops")),
	index("mom_sender_id_idx").using("btree", table.senderId.asc().nullsLast().op("text_ops")),
]);

export const sessions = pgTable("sessions", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	fingerprint: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	lastActivityAt: timestamp("last_activity_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_userId_users_id_fk"
		}).onDelete("cascade"),
]);

export const supplierPayments = pgTable("supplier_payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	supplierId: uuid("supplier_id").notNull(),
	orderId: uuid("order_id"),
	firebaseId: text("firebase_id"),
	supplierName: text("supplier_name").notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	method: text().notNull(),
	reference: text(),
	bank: text(),
	dueDate: timestamp("due_date", { withTimezone: true, mode: 'string' }),
	status: text(),
	date: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	notes: text(),
	paymentNumber: text("payment_number"),
	chequeNumber: text("cheque_number"),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_payments_supplier_date").using("btree", table.supplierId.asc().nullsLast().op("timestamptz_ops"), table.date.asc().nullsLast().op("timestamptz_ops"), table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [suppliers.id],
			name: "supplier_payments_supplier_id_suppliers_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [supplierOrders.id],
			name: "supplier_payments_order_id_supplier_orders_id_fk"
		}).onDelete("set null"),
]);

export const treatments = pgTable("treatments", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	category: text(),
	price: numeric({ precision: 10, scale:  2 }).default('0'),
	active: boolean().default(true),
});

export const prescriptionsLegacy = pgTable("prescriptions_legacy", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	prescriptionData: json("prescription_data").notNull(),
	date: timestamp({ mode: 'string' }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "prescriptions_legacy_client_id_clients_id_fk"
		}),
	unique("prescriptions_legacy_firebase_id_unique").on(table.firebaseId),
]);

export const marketCreditAccounts = pgTable("market_credit_accounts", {
	id: serial().primaryKey().notNull(),
	supplierId: uuid("supplier_id").notNull(),
	opticianId: text("optician_id").notNull(),
	creditLimit: numeric("credit_limit", { precision: 10, scale:  2 }).default('0').notNull(),
	currentBalance: numeric("current_balance", { precision: 10, scale:  2 }).default('0').notNull(),
	paymentTerms: text("payment_terms"),
	isBlocked: boolean("is_blocked").default(false).notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("mca_optician_id_idx").using("btree", table.opticianId.asc().nullsLast().op("text_ops")),
	index("mca_supplier_id_idx").using("btree", table.supplierId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("mca_supplier_optician_idx").using("btree", table.supplierId.asc().nullsLast().op("uuid_ops"), table.opticianId.asc().nullsLast().op("text_ops")),
]);

export const sales = pgTable("sales", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	clientName: text("client_name"),
	clientPhone: text("client_phone"),
	clientMutuelle: text("client_mutuelle"),
	clientAddress: text("client_address"),
	totalHt: numeric("total_ht", { precision: 10, scale:  2 }),
	totalTva: numeric("total_tva", { precision: 10, scale:  2 }),
	totalTtc: numeric("total_ttc", { precision: 10, scale:  2 }).notNull(),
	totalNet: numeric("total_net", { precision: 10, scale:  2 }),
	totalPaye: numeric("total_paye", { precision: 10, scale:  2 }).default('0'),
	resteAPayer: numeric("reste_a_payer", { precision: 10, scale:  2 }),
	status: text().default('impaye'),
	paymentMethod: text("payment_method"),
	type: text().default('VENTE'),
	items: json().notNull(),
	paymentHistory: json("payment_history"),
	prescriptionSnapshot: json("prescription_snapshot"),
	notes: text(),
	date: timestamp({ mode: 'string' }),
	lastPaymentDate: timestamp("last_payment_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	saleNumber: text("sale_number"),
	transactionNumber: text("transaction_number"),
	isDeclared: boolean("is_declared").default(false),
	templateVersionUsed: integer("template_version_used"),
	templateSnapshot: jsonb("template_snapshot"),
	documentSettingsSnapshot: jsonb("document_settings_snapshot"),
	deliveryStatus: text("delivery_status").default('en_attente'),
	isOfficialInvoice: boolean("is_official_invoice").default(true).notNull(),
	comptabiliteStatus: text("comptabilite_status").default('PENDING').notNull(),
}, (table) => [
	uniqueIndex("idx_sales_unique_number").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.saleNumber.asc().nullsLast().op("text_ops")),
	uniqueIndex("idx_sales_unique_transaction").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.transactionNumber.asc().nullsLast().op("text_ops")),
	index("idx_sales_user_date").using("btree", table.userId.asc().nullsLast().op("timestamp_ops"), table.createdAt.asc().nullsLast().op("text_ops")),
	index("sales_client_id_idx").using("btree", table.clientId.asc().nullsLast().op("int4_ops")),
	index("sales_sale_number_idx").using("btree", table.saleNumber.asc().nullsLast().op("text_ops")),
	index("sales_transaction_number_idx").using("btree", table.transactionNumber.asc().nullsLast().op("text_ops")),
	index("sales_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "sales_client_id_clients_id_fk"
		}),
	unique("sales_firebase_id_unique").on(table.firebaseId),
]);

export const shopProfiles = pgTable("shop_profiles", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	shopName: text("shop_name").notNull(),
	address: text(),
	phone: text(),
	ice: text(),
	rib: text(),
	logoUrl: text("logo_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	rc: text(),
	if: text(),
	patente: text(),
	tvaRate: text("tva_rate"),
	paymentTerms: text("payment_terms"),
	paymentMethods: text("payment_methods"),
	isActive: boolean("is_active").default(true),
	tp: text(),
	inpe: text(),
	documentSettings: jsonb("document_settings").default({"showICE":true,"showRIB":false,"fontSize":"medium","showLogo":true,"showEmail":true,"showPhone":true,"showStamp":false,"footerText":"","templateId":"classic","showAddress":true,"headerLayout":"logo-left","primaryColor":"#1e293b","secondaryColor":"#64748b","showSignatureBox":true}).notNull(),
	documentSettingsVersion: integer("document_settings_version").default(1).notNull(),
	documentSettingsUpdatedAt: timestamp("document_settings_updated_at", { withTimezone: true, mode: 'string' }),
});

export const suppliers = pgTable("suppliers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	email: text(),
	phone: text(),
	address: text(),
	city: text(),
	category: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	ice: text(),
	if: text(),
	rc: text(),
	taxId: text("tax_id"),
	paymentTerms: text("payment_terms"),
	paymentMethod: text("payment_method"),
	bank: text(),
	rib: text(),
	notes: text(),
	status: text(),
	contactPerson: text("contact_person"),
	creditLimit: numeric("credit_limit", { precision: 15, scale:  2 }),
	rating: text(),
	isActive: boolean("is_active").default(true).notNull(),
	defaultTaxMode: text("default_tax_mode"),
	contactName: varchar("contact_name", { length: 255 }),
	contactPhone: varchar("contact_phone", { length: 50 }),
	contactEmail: varchar("contact_email", { length: 255 }),
	currentBalance: numeric("current_balance", { precision: 15, scale:  2 }).default('0').notNull(),
}, (table) => [
	index("idx_suppliers_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_suppliers_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const banks = pgTable("banks", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	rib: text(),
	active: boolean().default(true),
});

export const colors = pgTable("colors", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	code: text(),
	active: boolean().default(true),
});

export const brands = pgTable("brands", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	category: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	active: boolean().default(true),
});

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	active: boolean().default(true),
});

export const materials = pgTable("materials", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	category: text(),
	active: boolean().default(true),
});

export const insurances = pgTable("insurances", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	email: text(),
	phone: text(),
	address: text(),
	active: boolean().default(true),
});

export const auditLog = pgTable("audit_log", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id"),
	action: text().notNull(),
	resource: text(),
	success: boolean().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	fingerprint: text(),
	severity: text().default('INFO'),
	metadata: text(),
	timestamp: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const purchases = pgTable("purchases", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	supplierId: uuid("supplier_id"),
	supplierName: text("supplier_name").notNull(),
	type: text().notNull(),
	reference: text(),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	amountPaid: numeric("amount_paid", { precision: 10, scale:  2 }).default('0'),
	status: text().default('UNPAID').notNull(),
	date: timestamp({ mode: 'string' }),
	dueDate: timestamp("due_date", { mode: 'string' }),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const clientTransactions = pgTable("client_transactions", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	type: text().notNull(),
	referenceId: text("reference_id"),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	previousBalance: numeric("previous_balance", { precision: 10, scale:  2 }).notNull(),
	newBalance: numeric("new_balance", { precision: 10, scale:  2 }).notNull(),
	date: timestamp({ mode: 'string' }).defaultNow(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "client_transactions_client_id_clients_id_fk"
		}).onDelete("cascade"),
]);

export const lensOrders = pgTable("lens_orders", {
	id: serial().primaryKey().notNull(),
	firebaseId: text("firebase_id"),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	prescriptionId: integer("prescription_id"),
	saleId: integer("sale_id"),
	orderType: text("order_type").notNull(),
	lensType: text("lens_type").notNull(),
	supplierId: uuid("supplier_id"),
	supplierOrderId: uuid("supplier_order_id"),
	treatment: text(),
	supplierName: text("supplier_name").notNull(),
	sphereR: text("sphere_r"),
	cylindreR: text("cylindre_r"),
	axeR: text("axe_r"),
	additionR: text("addition_r"),
	hauteurR: text("hauteur_r"),
	sphereL: text("sphere_l"),
	cylindreL: text("cylindre_l"),
	axeL: text("axe_l"),
	additionL: text("addition_l"),
	hauteurL: text("hauteur_l"),
	ecartPupillaireR: text("ecart_pupillaire_r"),
	ecartPupillaireL: text("ecart_pupillaire_l"),
	diameterR: text("diameter_r"),
	diameterL: text("diameter_l"),
	rightEye: json("right_eye"),
	leftEye: json("left_eye"),
	matiere: text(),
	indice: text(),
	sellingPrice: numeric("selling_price", { precision: 10, scale:  2 }).default('0').notNull(),
	estimatedBuyingPrice: numeric("estimated_buying_price", { precision: 10, scale:  2 }),
	finalBuyingPrice: numeric("final_buying_price", { precision: 10, scale:  2 }),
	supplierInvoiceRef: text("supplier_invoice_ref"),
	deliveryNoteRef: text("delivery_note_ref"),
	estimatedMargin: numeric("estimated_margin", { precision: 10, scale:  2 }),
	finalMargin: numeric("final_margin", { precision: 10, scale:  2 }),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	quantity: integer().default(1).notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }).notNull(),
	status: text().default('pending').notNull(),
	orderDate: timestamp("order_date", { mode: 'string' }).defaultNow(),
	receivedDate: timestamp("received_date", { mode: 'string' }),
	deliveredDate: timestamp("delivered_date", { mode: 'string' }),
	notes: text(),
	amountPaid: numeric("amount_paid", { precision: 10, scale:  2 }).default('0').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	pont: text(),
	branches: text(),
}, (table) => [
	index("idx_lens_orders_pending").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.createdAt.asc().nullsLast().op("timestamp_ops")).where(sql`(status = 'pending'::text)`),
	index("idx_lens_orders_ready_for_delivery").using("btree", table.userId.asc().nullsLast().op("timestamp_ops"), table.updatedAt.asc().nullsLast().op("timestamp_ops")).where(sql`((status = 'received'::text) AND (sale_id IS NULL))`),
	index("lens_orders_client_id_idx").using("btree", table.clientId.asc().nullsLast().op("int4_ops")),
	index("lens_orders_sale_id_idx").using("btree", table.saleId.asc().nullsLast().op("int4_ops")),
	index("lens_orders_sphere_l_idx").using("btree", table.sphereL.asc().nullsLast().op("text_ops")),
	index("lens_orders_sphere_r_idx").using("btree", table.sphereR.asc().nullsLast().op("text_ops")),
	index("lens_orders_supplier_id_idx").using("btree", table.supplierId.asc().nullsLast().op("uuid_ops")),
	index("lens_orders_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "lens_orders_client_id_clients_id_fk"
		}),
	foreignKey({
			columns: [table.prescriptionId],
			foreignColumns: [prescriptionsLegacy.id],
			name: "lens_orders_prescription_id_prescriptions_legacy_id_fk"
		}),
	foreignKey({
			columns: [table.saleId],
			foreignColumns: [sales.id],
			name: "lens_orders_sale_id_sales_id_fk"
		}),
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [suppliers.id],
			name: "lens_orders_supplier_id_suppliers_id_fk"
		}),
	foreignKey({
			columns: [table.supplierOrderId],
			foreignColumns: [supplierOrders.id],
			name: "lens_orders_supplier_order_id_supplier_orders_id_fk"
		}),
	unique("lens_orders_firebase_id_unique").on(table.firebaseId),
]);

export const mountingTypes = pgTable("mounting_types", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	active: boolean().default(true),
});

export const reminders = pgTable("reminders", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	type: text().notNull(),
	priority: text().default('normal').notNull(),
	title: text().notNull(),
	message: text(),
	status: text().default('pending').notNull(),
	dueDate: timestamp("due_date", { mode: 'string' }),
	relatedId: varchar("related_id", { length: 36 }),
	relatedType: text("related_type"),
	metadata: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_reminders_dashboard").using("btree", table.userId.asc().nullsLast().op("timestamp_ops"), table.status.asc().nullsLast().op("text_ops"), table.dueDate.asc().nullsLast().op("timestamp_ops")),
	index("idx_reminders_related").using("btree", table.relatedType.asc().nullsLast().op("text_ops"), table.relatedId.asc().nullsLast().op("text_ops")),
]);

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	password: text(),
	role: text().default('user'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	isActive: boolean("is_active").default(true),
	failedLoginAttempts: integer("failed_login_attempts").default(0),
	lockoutUntil: timestamp("lockout_until", { mode: 'string' }),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	maxProducts: integer("max_products"),
	maxClients: integer("max_clients"),
	maxSuppliers: integer("max_suppliers"),
	lastPaymentDate: timestamp("last_payment_date", { mode: 'string' }),
	nextPaymentDate: timestamp("next_payment_date", { mode: 'string' }),
	subscriptionExpiry: timestamp("subscription_expiry", { mode: 'string' }),
	paymentMode: text("payment_mode"),
	billingCycle: text("billing_cycle"),
	agreedPrice: numeric("agreed_price", { precision: 10, scale:  2 }),
	amountPaid: numeric("amount_paid", { precision: 10, scale:  2 }),
	installmentsCount: integer("installments_count"),
	nextInstallmentDate: timestamp("next_installment_date", { mode: 'string' }),
	trainingPrice: numeric("training_price", { precision: 10, scale:  2 }),
	setupPrice: numeric("setup_price", { precision: 10, scale:  2 }),
	planId: text("plan_id"),
	acquisitionCost: numeric("acquisition_cost", { precision: 10, scale:  2 }),
	acquisitionCostCurrency: text("acquisition_cost_currency"),
	salePrice: numeric("sale_price", { precision: 10, scale:  2 }),
	salePriceCurrency: text("sale_price_currency"),
	customSubscriptionPrice: numeric("custom_subscription_price", { precision: 10, scale:  2 }),
	customSubscriptionCurrency: text("custom_subscription_currency"),
	financialNotes: text("financial_notes"),
	soldAt: timestamp("sold_at", { mode: 'string' }),
	paymentMethod: text("payment_method"),
	deploymentType: text("deployment_type"),
	pricingModel: text("pricing_model"),
	subscriptionYear: integer("subscription_year"),
	isPerpetualLicense: boolean("is_perpetual_license"),
	perpetualLicenseDate: timestamp("perpetual_license_date", { mode: 'string' }),
	subscriptionStartDate: timestamp("subscription_start_date", { mode: 'string' }),
	subscriptionEndDate: timestamp("subscription_end_date", { mode: 'string' }),
	subscriptionStatus: text("subscription_status"),
	autoRenew: boolean("auto_renew").default(false),
	suspendedAt: timestamp("suspended_at", { mode: 'string' }),
	suspensionReason: text("suspension_reason"),
	lastReminderSentAt: timestamp("last_reminder_sent_at", { mode: 'string' }),
	remindersSentCount: integer("reminders_sent_count"),
	marketSupplierProfileId: uuid("market_supplier_profile_id"),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const auditLogs = pgTable("audit_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	entityType: text("entity_type").notNull(),
	entityId: text("entity_id").notNull(),
	action: text().notNull(),
	oldValue: json("old_value"),
	newValue: json("new_value"),
	metadata: json(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const expensesV2 = pgTable("expenses_v2", {
	id: serial().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	userId: text("user_id").notNull(),
	title: text().notNull(),
	type: text().notNull(),
	category: text().notNull(),
	amount: real().notNull(),
	currency: text().default('MAD').notNull(),
	dueDate: timestamp("due_date", { mode: 'string' }),
	paymentDate: timestamp("payment_date", { mode: 'string' }),
	period: text(),
	status: text().notNull(),
	provider: text(),
	invoiceNumber: text("invoice_number"),
	attachments: text().array(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("expenses_v2_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("expenses_v2_store_id_idx").using("btree", table.storeId.asc().nullsLast().op("text_ops")),
	index("expenses_v2_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	index("expenses_v2_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const invoiceImports = pgTable("invoice_imports", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	supplierId: text("supplier_id"),
	invoiceNumber: text("invoice_number").notNull(),
	invoiceDate: timestamp("invoice_date", { mode: 'string' }),
	status: text().default('completed'),
	totalItems: integer("total_items"),
	revertedAt: timestamp("reverted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	uniqueIndex("idx_unique_import").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.supplierId.asc().nullsLast().op("text_ops"), table.invoiceNumber.asc().nullsLast().op("timestamp_ops"), table.invoiceDate.asc().nullsLast().op("timestamp_ops")),
	index("idx_user_invoice").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.invoiceNumber.asc().nullsLast().op("text_ops")),
]);

export const prescriptions = pgTable("prescriptions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	prescriptionDate: timestamp("prescription_date", { mode: 'string' }),
	doctorName: text("doctor_name"),
	imageUrl: text("image_url"),
	odSph: real("od_sph"),
	odCyl: real("od_cyl"),
	odAxis: integer("od_axis"),
	odAdd: real("od_add"),
	osSph: real("os_sph"),
	osCyl: real("os_cyl"),
	osAxis: integer("os_axis"),
	osAdd: real("os_add"),
	pd: real(),
	notes: text(),
	status: text().default('pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	odPd: real("od_pd"),
	odHeight: real("od_height"),
	osPd: real("os_pd"),
	osHeight: real("os_height"),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "prescriptions_client_id_clients_id_fk"
		}).onDelete("cascade"),
]);

export const reservations = pgTable("reservations", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	clientName: text("client_name").notNull(),
	items: json().notNull(),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	depositAmount: numeric("deposit_amount", { precision: 10, scale:  2 }).default('0'),
	remainingAmount: numeric("remaining_amount", { precision: 10, scale:  2 }),
	status: text().default('PENDING'),
	notes: text(),
	saleId: integer("sale_id"),
	expiryDate: timestamp("expiry_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index("reservations_client_id_idx").using("btree", table.clientId.asc().nullsLast().op("int4_ops")),
	index("reservations_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("reservations_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "reservations_client_id_clients_id_fk"
		}),
	foreignKey({
			columns: [table.saleId],
			foreignColumns: [sales.id],
			name: "reservations_sale_id_sales_id_fk"
		}),
]);

export const clientInteractions = pgTable("client_interactions", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	clientId: integer("client_id"),
	type: text().default('note').notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("interactions_client_id_idx").using("btree", table.clientId.asc().nullsLast().op("int4_ops")),
	index("interactions_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "client_interactions_client_id_clients_id_fk"
		}).onDelete("cascade"),
]);

export const marketCreditMovements = pgTable("market_credit_movements", {
	id: serial().primaryKey().notNull(),
	creditAccountId: integer("credit_account_id").notNull(),
	type: text().notNull(),
	montant: numeric({ precision: 10, scale:  2 }).notNull(),
	motif: text().notNull(),
	referenceType: text("reference_type"),
	referenceId: integer("reference_id"),
	note: text(),
	createdBy: text("created_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("mcm_credit_account_idx").using("btree", table.creditAccountId.asc().nullsLast().op("int4_ops")),
	index("mcm_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.creditAccountId],
			foreignColumns: [marketCreditAccounts.id],
			name: "market_credit_movements_credit_account_id_fkey"
		}),
	check("market_credit_movements_type_check", sql`type = ANY (ARRAY['DEBIT'::text, 'CREDIT'::text])`),
	check("market_credit_movements_motif_check", sql`motif = ANY (ARRAY['COMMANDE'::text, 'PAIEMENT'::text, 'AVOIR'::text, 'REMISE'::text, 'CORRECTION'::text])`),
]);

export const notifications = pgTable("notifications", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id"),
	type: text().notNull(),
	title: text().notNull(),
	message: text().notNull(),
	priority: text().default('MEDIUM').notNull(),
	relatedEntityType: text("related_entity_type"),
	relatedEntityId: integer("related_entity_id"),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	readAt: timestamp("read_at", { mode: 'string' }),
});

export const frameReservations = pgTable("frame_reservations", {
	id: serial().primaryKey().notNull(),
	storeId: text("store_id").notNull(),
	clientId: integer("client_id").notNull(),
	clientName: text("client_name").notNull(),
	status: text().default('PENDING').notNull(),
	items: json().notNull(),
	reservationDate: timestamp("reservation_date", { mode: 'string' }).defaultNow().notNull(),
	expiryDate: timestamp("expiry_date", { mode: 'string' }).notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	saleId: integer("sale_id"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).default('0'),
	depositAmount: numeric("deposit_amount", { precision: 10, scale:  2 }).default('0'),
	remainingAmount: numeric("remaining_amount", { precision: 10, scale:  2 }).default('0'),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "frame_reservations_client_id_clients_id_fk"
		}),
	foreignKey({
			columns: [table.saleId],
			foreignColumns: [sales.id],
			name: "frame_reservations_sale_id_sales_id_fk"
		}),
]);

export const marketProducts = pgTable("market_products", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	supplierId: uuid("supplier_id").notNull(),
	categoryId: integer("category_id"),
	name: text().notNull(),
	description: text(),
	reference: text(),
	brand: text(),
	type: text().default('AUTRE').notNull(),
	material: text(),
	color: text(),
	unitPriceHt: numeric("unit_price_ht", { precision: 10, scale:  2 }).notNull(),
	tvaRate: numeric("tva_rate", { precision: 5, scale:  2 }).default('20'),
	unitPriceTtc: numeric("unit_price_ttc", { precision: 10, scale:  2 }),
	stockQuantity: integer("stock_quantity").default(0).notNull(),
	reservedQuantity: integer("reserved_quantity").default(0).notNull(),
	minOrderQty: integer("min_order_qty").default(1).notNull(),
	isActive: boolean("is_active").default(false).notNull(),
	isFeatured: boolean("is_featured").default(false).notNull(),
	status: text().default('DRAFT').notNull(),
	tags: text().array(),
	specs: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	reviewedBy: text("reviewed_by"),
	reviewedAt: timestamp("reviewed_at", { mode: 'string' }),
	rejectionReason: text("rejection_reason"),
}, (table) => [
	index("mp_brand_idx").using("btree", table.brand.asc().nullsLast().op("text_ops")),
	index("mp_category_id_idx").using("btree", table.categoryId.asc().nullsLast().op("int4_ops")),
	index("mp_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("mp_supplier_id_idx").using("btree", table.supplierId.asc().nullsLast().op("uuid_ops")),
	index("mp_type_idx").using("btree", table.type.asc().nullsLast().op("text_ops")),
]);

export const saleItems = pgTable("sale_items", {
	id: serial().primaryKey().notNull(),
	saleId: integer("sale_id").notNull(),
	productId: integer("product_id"),
	category: text(),
	productType: text("product_type"),
	label: text().notNull(),
	qty: integer().default(1).notNull(),
	unitPriceHt: numeric("unit_price_ht", { precision: 10, scale:  2 }).default('0').notNull(),
	unitPriceTva: numeric("unit_price_tva", { precision: 10, scale:  2 }).default('0').notNull(),
	unitPriceTtc: numeric("unit_price_ttc", { precision: 10, scale:  2 }).default('0').notNull(),
	tvaRate: numeric("tva_rate", { precision: 5, scale:  2 }).default('20').notNull(),
	lineTotalHt: numeric("line_total_ht", { precision: 10, scale:  2 }).default('0').notNull(),
	lineTotalTva: numeric("line_total_tva", { precision: 10, scale:  2 }).default('0').notNull(),
	lineTotalTtc: numeric("line_total_ttc", { precision: 10, scale:  2 }).default('0').notNull(),
	isDiscountLine: boolean("is_discount_line").default(false),
	metadata: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	brand: text(),
	unitPurchasePrice: numeric("unit_purchase_price", { precision: 10, scale:  2 }).default('0').notNull(),
}, (table) => [
	index("sale_items_product_id_idx").using("btree", table.productId.asc().nullsLast().op("int4_ops")),
	index("sale_items_sale_id_idx").using("btree", table.saleId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.saleId],
			foreignColumns: [sales.id],
			name: "sale_items_sale_id_sales_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "sale_items_product_id_products_id_fk"
		}),
]);

export const saleContactLensDetails = pgTable("sale_contact_lens_details", {
	id: serial().primaryKey().notNull(),
	saleItemId: integer("sale_item_id").notNull(),
	eye: text().notNull(),
	power: text(),
	baseCurve: text("base_curve"),
	diameter: text(),
	duration: text(),
	cylinder: text(),
	axis: text(),
	addition: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("sale_contact_lens_details_item_id_idx").using("btree", table.saleItemId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.saleItemId],
			foreignColumns: [saleItems.id],
			name: "sale_contact_lens_details_sale_item_id_sale_items_id_fk"
		}).onDelete("cascade"),
]);

export const saleLensDetails = pgTable("sale_lens_details", {
	id: serial().primaryKey().notNull(),
	saleItemId: integer("sale_item_id").notNull(),
	eye: text().notNull(),
	sphere: text(),
	cylinder: text(),
	axis: text(),
	addition: text(),
	index: text(),
	diameter: text(),
	material: text(),
	treatment: text(),
	lensType: text("lens_type"),
	baseCurve: text("base_curve"),
	prism: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("sale_lens_details_item_id_idx").using("btree", table.saleItemId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.saleItemId],
			foreignColumns: [saleItems.id],
			name: "sale_lens_details_sale_item_id_sale_items_id_fk"
		}).onDelete("cascade"),
]);

export const cashSessions = pgTable("cash_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	openedAt: timestamp("opened_at", { mode: 'string' }).defaultNow().notNull(),
	closedAt: timestamp("closed_at", { mode: 'string' }),
	openingBalance: numeric("opening_balance", { precision: 10, scale:  2 }).default('0').notNull(),
	closingBalance: numeric("closing_balance", { precision: 10, scale:  2 }),
	expectedBalance: numeric("expected_balance", { precision: 10, scale:  2 }),
	difference: numeric({ precision: 10, scale:  2 }),
	status: text().default('open').notNull(),
	notes: text(),
	closedBy: text("closed_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("cash_sessions_opened_at_idx").using("btree", table.openedAt.asc().nullsLast().op("timestamp_ops")),
	index("cash_sessions_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("cash_sessions_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const cashMovements = pgTable("cash_movements", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	sessionId: uuid("session_id"),
	userId: text("user_id").notNull(),
	type: text().notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	reason: text().notNull(),
	referenceId: text("reference_id"),
	referenceType: text("reference_type"),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("cash_movements_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("cash_movements_session_id_idx").using("btree", table.sessionId.asc().nullsLast().op("uuid_ops")),
	index("cash_movements_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [cashSessions.id],
			name: "cash_movements_session_id_cash_sessions_id_fk"
		}),
]);

export const comptabiliteJournal = pgTable("comptabilite_journal", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id"),
	saleId: integer("sale_id"),
	montantHt: numeric("montant_ht", { precision: 10, scale:  2 }).notNull(),
	tva: numeric({ precision: 10, scale:  2 }).notNull(),
	montantTtc: numeric("montant_ttc", { precision: 10, scale:  2 }).notNull(),
	statut: text().default('BROUILLON'),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index("journal_sale_id_idx").using("btree", table.saleId.asc().nullsLast().op("int4_ops")),
	index("journal_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.saleId],
			foreignColumns: [sales.id],
			name: "comptabilite_journal_sale_id_sales_id_fk"
		}).onDelete("cascade"),
]);

export const goodsReceiptItems = pgTable("goods_receipt_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	receiptId: uuid("receipt_id").notNull(),
	orderItemId: integer("order_item_id"),
	productId: integer("product_id"),
	qtyOrdered: integer("qty_ordered").default(0),
	qtyReceived: integer("qty_received").default(0).notNull(),
	qtyRejected: integer("qty_rejected").default(0),
	unitPrice: numeric("unit_price", { precision: 15, scale:  2 }),
}, (table) => [
	foreignKey({
			columns: [table.receiptId],
			foreignColumns: [goodsReceipts.id],
			name: "goods_receipt_items_receipt_id_goods_receipts_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.orderItemId],
			foreignColumns: [supplierOrderItems.id],
			name: "goods_receipt_items_order_item_id_supplier_order_items_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "goods_receipt_items_product_id_products_id_fk"
		}).onDelete("set null"),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	fingerprint: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastActivityAt: timestamp("last_activity_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const supplierCredits = pgTable("supplier_credits", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	supplierId: uuid("supplier_id").notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	remainingAmount: numeric("remaining_amount", { precision: 15, scale:  2 }).notNull(),
	status: text().default('open'),
	sourceType: text("source_type"),
	reference: text(),
	notes: text(),
	relatedReceiptId: uuid("related_receipt_id"),
	relatedOrderId: uuid("related_order_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index("idx_supplier_credits_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("idx_supplier_credits_supplier").using("btree", table.supplierId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [suppliers.id],
			name: "supplier_credits_supplier_id_suppliers_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.relatedOrderId],
			foreignColumns: [supplierOrders.id],
			name: "supplier_credits_related_order_id_supplier_orders_id_fk"
		}).onDelete("set null"),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	password: text(),
	role: text().default('USER').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
	lockoutUntil: timestamp("lockout_until", { mode: 'string' }),
	maxProducts: integer("max_products").default(500).notNull(),
	maxClients: integer("max_clients").default(200).notNull(),
	maxSuppliers: integer("max_suppliers").default(100).notNull(),
	lastPaymentDate: timestamp("last_payment_date", { mode: 'string' }),
	nextPaymentDate: timestamp("next_payment_date", { mode: 'string' }),
	subscriptionExpiry: timestamp("subscription_expiry", { mode: 'string' }),
	paymentMode: text("payment_mode").default('subscription'),
	billingCycle: text("billing_cycle").default('monthly'),
	agreedPrice: numeric("agreed_price", { precision: 10, scale:  2 }),
	trainingPrice: numeric("training_price", { precision: 10, scale:  2 }).default('0'),
	setupPrice: numeric("setup_price", { precision: 10, scale:  2 }).default('0'),
	amountPaid: numeric("amount_paid", { precision: 10, scale:  2 }).default('0'),
	installmentsCount: integer("installments_count").default(1),
	nextInstallmentDate: timestamp("next_installment_date", { mode: 'string' }),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const goodsReceipts = pgTable("goods_receipts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	supplierId: uuid("supplier_id").notNull(),
	deliveryNoteRef: text("delivery_note_ref"),
	status: text().default('draft'),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	validatedAt: timestamp("validated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.supplierId],
			foreignColumns: [suppliers.id],
			name: "goods_receipts_supplier_id_suppliers_id_fk"
		}),
]);

export const supplierCreditAllocations = pgTable("supplier_credit_allocations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	creditId: uuid("credit_id").notNull(),
	orderId: uuid("order_id").notNull(),
	amount: numeric({ precision: 15, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.creditId],
			foreignColumns: [supplierCredits.id],
			name: "supplier_credit_allocations_credit_id_supplier_credits_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [supplierOrders.id],
			name: "supplier_credit_allocations_order_id_supplier_orders_id_fk"
		}).onDelete("cascade"),
]);

export const marketCategories = pgTable("market_categories", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	nameAr: text("name_ar"),
	slug: text().notNull(),
	icon: text(),
	isActive: boolean("is_active").default(true).notNull(),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("market_categories_slug_key").on(table.slug),
]);

export const marketSupplierProfiles = pgTable("market_supplier_profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	companyName: text("company_name").notNull(),
	logoUrl: text("logo_url"),
	description: text(),
	phone: text(),
	email: text(),
	address: text(),
	city: text(),
	ice: text(),
	rc: text(),
	rib: text(),
	paymentTerms: text("payment_terms").default('30'),
	minOrderAmount: numeric("min_order_amount", { precision: 10, scale:  2 }).default('0'),
	shippingInfo: text("shipping_info"),
	status: text().default('PENDING').notNull(),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	verifiedBy: text("verified_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	supplierId: uuid("supplier_id"),
	onboardingStep: integer("onboarding_step").default(0),
	onboardingCompleted: boolean("onboarding_completed").default(false),
}, (table) => [
	index("msp_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("msp_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	unique("market_supplier_profiles_user_id_key").on(table.userId),
]);

export const marketProductImages = pgTable("market_product_images", {
	id: serial().primaryKey().notNull(),
	productId: uuid("product_id").notNull(),
	url: text().notNull(),
	altText: text("alt_text"),
	sortOrder: integer("sort_order").default(0),
	isPrimary: boolean("is_primary").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	position: integer().default(0),
	fileSizeKb: integer("file_size_kb"),
}, (table) => [
	index("mpi_product_id_idx").using("btree", table.productId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("mpi_unique_primary_idx").using("btree", table.productId.asc().nullsLast().op("uuid_ops")).where(sql`(is_primary = true)`),
]);

export const marketOrders = pgTable("market_orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	orderNumber: text("order_number").notNull(),
	opticianId: text("optician_id").notNull(),
	supplierId: uuid("supplier_id").notNull(),
	erpOrderId: integer("erp_order_id"),
	status: text().default('PENDING').notNull(),
	subTotalHt: numeric("sub_total_ht", { precision: 10, scale:  2 }).notNull(),
	tvaAmount: numeric("tva_amount", { precision: 10, scale:  2 }).default('0'),
	shippingCost: numeric("shipping_cost", { precision: 10, scale:  2 }).default('0'),
	totalTtc: numeric("total_ttc", { precision: 10, scale:  2 }).notNull(),
	paymentMethod: text("payment_method").default('CREDIT'),
	paymentStatus: text("payment_status").default('UNPAID').notNull(),
	amountPaid: numeric("amount_paid", { precision: 10, scale:  2 }).default('0'),
	shippingAddress: text("shipping_address"),
	expectedDelivery: timestamp("expected_delivery", { mode: 'string' }),
	notes: text(),
	confirmedAt: timestamp("confirmed_at", { mode: 'string' }),
	shippedAt: timestamp("shipped_at", { mode: 'string' }),
	deliveredAt: timestamp("delivered_at", { mode: 'string' }),
	cancelledAt: timestamp("cancelled_at", { mode: 'string' }),
	cancellationReason: text("cancellation_reason"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("mo_optician_id_idx").using("btree", table.opticianId.asc().nullsLast().op("text_ops")),
	index("mo_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("mo_supplier_id_idx").using("btree", table.supplierId.asc().nullsLast().op("uuid_ops")),
	unique("market_orders_order_number_key").on(table.orderNumber),
]);

export const marketOrderItems = pgTable("market_order_items", {
	id: serial().primaryKey().notNull(),
	orderId: uuid("order_id").notNull(),
	productId: uuid("product_id").notNull(),
	productSnapshot: json("product_snapshot").notNull(),
	quantity: integer().notNull(),
	receivedQuantity: integer("received_quantity").default(0).notNull(),
	unitPriceHt: numeric("unit_price_ht", { precision: 10, scale:  2 }).notNull(),
	totalPriceHt: numeric("total_price_ht", { precision: 10, scale:  2 }).notNull(),
	erpProductId: integer("erp_product_id"),
	stockSynced: boolean("stock_synced").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("moi_order_id_idx").using("btree", table.orderId.asc().nullsLast().op("uuid_ops")),
	index("moi_product_id_idx").using("btree", table.productId.asc().nullsLast().op("uuid_ops")),
]);

export const verificationTokens = pgTable("verification_tokens", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verification_tokens_identifier_token_pk"}),
]);

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
]);

export const accounts = pgTable("accounts", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_userId_users_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "accounts_provider_providerAccountId_pk"}),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
]);
export const supplierBalanceView = pgView("supplier_balance_view", {	supplierId: uuid("supplier_id"),
	userId: text("user_id"),
	totalAchats: numeric("total_achats"),
	totalPaiements: numeric("total_paiements"),
	soldeReel: numeric("solde_reel"),
}).as(sql`SELECT s.id AS supplier_id, s.user_id, COALESCE(sum(so.montant_total), 0::numeric) AS total_achats, COALESCE(sum(sp.amount), 0::numeric) AS total_paiements, COALESCE(sum(so.montant_total), 0::numeric) - COALESCE(sum(sp.amount), 0::numeric) AS solde_reel FROM suppliers s LEFT JOIN supplier_orders so ON so.supplier_id = s.id AND so.deleted_at IS NULL LEFT JOIN supplier_payments sp ON sp.supplier_id = s.id AND sp.deleted_at IS NULL GROUP BY s.id, s.user_id`);