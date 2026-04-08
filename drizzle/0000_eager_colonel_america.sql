-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "contact_lens_prescriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"client_id" integer,
	"prescription_data" json NOT NULL,
	"date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "contact_lens_prescriptions_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "supplier_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" integer,
	"reference" varchar(100),
	"label" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(15, 2) NOT NULL,
	"total" numeric(15, 2) NOT NULL,
	"qty_received" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"supplier_id" uuid,
	"firebase_id" text,
	"fournisseur" text,
	"montant_total" numeric(15, 2),
	"statut" text DEFAULT 'pending',
	"date_commande" timestamp DEFAULT now(),
	"date_reception" timestamp,
	"notes" text,
	"due_date" timestamp,
	"order_reference" text,
	"sub_total" numeric(15, 2),
	"tva" numeric(15, 2),
	"discount" numeric(15, 2),
	"shipping_cost" numeric(15, 2),
	"delivery_status" text,
	"order_number" text,
	"supplier_phone" text,
	"expected_delivery" timestamp,
	"created_by" text,
	"template_version_used" integer,
	"template_snapshot" jsonb,
	"amount_paid" numeric(15, 2) DEFAULT '0' NOT NULL,
	"remaining_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"status" text DEFAULT 'pending',
	"currency" text DEFAULT 'MAD',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "supplier_order_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"payment_id" uuid,
	"order_id" uuid,
	"amount" numeric(15, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"reference" text,
	"nom" text NOT NULL,
	"designation" text,
	"categorie" text,
	"marque" text,
	"fournisseur" text,
	"prix_achat" numeric(10, 2),
	"prix_vente" numeric(10, 2) NOT NULL,
	"prix_gros" numeric(10, 2),
	"quantite_stock" integer DEFAULT 0 NOT NULL,
	"seuil_alerte" integer DEFAULT 5,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"modele" text,
	"couleur" text,
	"details" text,
	"matiere_id" integer,
	"couleur_id" integer,
	"version" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"available_quantity" integer DEFAULT 0 NOT NULL,
	"type" text DEFAULT 'AUTRE' NOT NULL,
	"has_tva" boolean DEFAULT true,
	"price_type" text DEFAULT 'TTC',
	"sale_price_ht" numeric(10, 2),
	"sale_price_tva" numeric(10, 2),
	"sale_price_ttc" numeric(10, 2),
	"exemption_note" text,
	"brand" text,
	"category" text DEFAULT 'OPTIQUE',
	"product_type" text DEFAULT 'accessory',
	"tva_rate" numeric(5, 2) DEFAULT '20.00',
	"is_medical" boolean DEFAULT false,
	"is_stock_managed" boolean DEFAULT true,
	"client_id" integer,
	"image_url" text,
	"fournisseur_id" uuid,
	"num_facture" text,
	"marque_id" integer,
	"date_facture" timestamp,
	CONSTRAINT "products_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"full_name" text NOT NULL,
	"phone" text,
	"email" text,
	"address" text,
	"city" text,
	"notes" text,
	"balance" numeric(10, 2) DEFAULT '0',
	"total_spent" numeric(10, 2) DEFAULT '0',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_visit" timestamp,
	"user_id" text NOT NULL,
	"prenom" text,
	"nom" text,
	"gender" text,
	"cin" text,
	"date_of_birth" timestamp,
	"mutuelle" text,
	"phone_2" text,
	"credit_limit" numeric(10, 2) DEFAULT '5000',
	CONSTRAINT "clients_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"setting_key" text NOT NULL,
	"value" json NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "settings_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"produit_id" text,
	"product_id" integer,
	"quantite" integer NOT NULL,
	"type" text NOT NULL,
	"ref" text,
	"date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "stock_movements_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "devis" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"client_id" integer,
	"client_name" text NOT NULL,
	"client_phone" text,
	"items" json NOT NULL,
	"total_ht" numeric(10, 2) NOT NULL,
	"total_ttc" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'EN_ATTENTE',
	"sale_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"valid_until" timestamp,
	"template_version_used" integer,
	"template_snapshot" jsonb,
	"document_settings_snapshot" jsonb,
	CONSTRAINT "devis_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "market_order_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"sender_id" text NOT NULL,
	"sender_role" text NOT NULL,
	"content" text NOT NULL,
	"attachment_url" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"fingerprint" text,
	"created_at" timestamp DEFAULT now(),
	"last_activity_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supplier_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"supplier_id" uuid NOT NULL,
	"order_id" uuid,
	"firebase_id" text,
	"supplier_name" text NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"method" text NOT NULL,
	"reference" text,
	"bank" text,
	"due_date" timestamp with time zone,
	"status" text,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	"payment_number" text,
	"cheque_number" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "treatments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"category" text,
	"price" numeric(10, 2) DEFAULT '0',
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "prescriptions_legacy" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"client_id" integer,
	"prescription_data" json NOT NULL,
	"date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "prescriptions_legacy_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "market_credit_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" uuid NOT NULL,
	"optician_id" text NOT NULL,
	"credit_limit" numeric(10, 2) DEFAULT '0' NOT NULL,
	"current_balance" numeric(10, 2) DEFAULT '0' NOT NULL,
	"payment_terms" text,
	"is_blocked" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"client_id" integer,
	"client_name" text,
	"client_phone" text,
	"client_mutuelle" text,
	"client_address" text,
	"total_ht" numeric(10, 2),
	"total_tva" numeric(10, 2),
	"total_ttc" numeric(10, 2) NOT NULL,
	"total_net" numeric(10, 2),
	"total_paye" numeric(10, 2) DEFAULT '0',
	"reste_a_payer" numeric(10, 2),
	"status" text DEFAULT 'impaye',
	"payment_method" text,
	"type" text DEFAULT 'VENTE',
	"items" json NOT NULL,
	"payment_history" json,
	"prescription_snapshot" json,
	"notes" text,
	"date" timestamp,
	"last_payment_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"sale_number" text,
	"transaction_number" text,
	"is_declared" boolean DEFAULT false,
	"template_version_used" integer,
	"template_snapshot" jsonb,
	"document_settings_snapshot" jsonb,
	"delivery_status" text DEFAULT 'en_attente',
	"is_official_invoice" boolean DEFAULT true NOT NULL,
	"comptabilite_status" text DEFAULT 'PENDING' NOT NULL,
	CONSTRAINT "sales_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "shop_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shop_name" text NOT NULL,
	"address" text,
	"phone" text,
	"ice" text,
	"rib" text,
	"logo_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"rc" text,
	"if" text,
	"patente" text,
	"tva_rate" text,
	"payment_terms" text,
	"payment_methods" text,
	"is_active" boolean DEFAULT true,
	"tp" text,
	"inpe" text,
	"document_settings" jsonb DEFAULT '{"showICE":true,"showRIB":false,"fontSize":"medium","showLogo":true,"showEmail":true,"showPhone":true,"showStamp":false,"footerText":"","templateId":"classic","showAddress":true,"headerLayout":"logo-left","primaryColor":"#1e293b","secondaryColor":"#64748b","showSignatureBox":true}'::jsonb NOT NULL,
	"document_settings_version" integer DEFAULT 1 NOT NULL,
	"document_settings_updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"address" text,
	"city" text,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"ice" text,
	"if" text,
	"rc" text,
	"tax_id" text,
	"payment_terms" text,
	"payment_method" text,
	"bank" text,
	"rib" text,
	"notes" text,
	"status" text,
	"contact_person" text,
	"credit_limit" numeric(15, 2),
	"rating" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"default_tax_mode" text,
	"contact_name" varchar(255),
	"contact_phone" varchar(50),
	"contact_email" varchar(255),
	"current_balance" numeric(15, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "banks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"rib" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "colors" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"code" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"category" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "insurances" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"email" text,
	"phone" text,
	"address" text,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"resource" text,
	"success" boolean NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"fingerprint" text,
	"severity" text DEFAULT 'INFO',
	"metadata" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"supplier_id" uuid,
	"supplier_name" text NOT NULL,
	"type" text NOT NULL,
	"reference" text,
	"total_amount" numeric(10, 2) NOT NULL,
	"amount_paid" numeric(10, 2) DEFAULT '0',
	"status" text DEFAULT 'UNPAID' NOT NULL,
	"date" timestamp,
	"due_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "client_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" integer,
	"type" text NOT NULL,
	"reference_id" text,
	"amount" numeric(10, 2) NOT NULL,
	"previous_balance" numeric(10, 2) NOT NULL,
	"new_balance" numeric(10, 2) NOT NULL,
	"date" timestamp DEFAULT now(),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lens_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"firebase_id" text,
	"user_id" text NOT NULL,
	"client_id" integer,
	"prescription_id" integer,
	"sale_id" integer,
	"order_type" text NOT NULL,
	"lens_type" text NOT NULL,
	"supplier_id" uuid,
	"supplier_order_id" uuid,
	"treatment" text,
	"supplier_name" text NOT NULL,
	"sphere_r" text,
	"cylindre_r" text,
	"axe_r" text,
	"addition_r" text,
	"hauteur_r" text,
	"sphere_l" text,
	"cylindre_l" text,
	"axe_l" text,
	"addition_l" text,
	"hauteur_l" text,
	"ecart_pupillaire_r" text,
	"ecart_pupillaire_l" text,
	"diameter_r" text,
	"diameter_l" text,
	"right_eye" json,
	"left_eye" json,
	"matiere" text,
	"indice" text,
	"selling_price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"estimated_buying_price" numeric(10, 2),
	"final_buying_price" numeric(10, 2),
	"supplier_invoice_ref" text,
	"delivery_note_ref" text,
	"estimated_margin" numeric(10, 2),
	"final_margin" numeric(10, 2),
	"unit_price" numeric(10, 2) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"order_date" timestamp DEFAULT now(),
	"received_date" timestamp,
	"delivered_date" timestamp,
	"notes" text,
	"amount_paid" numeric(10, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"pont" text,
	"branches" text,
	CONSTRAINT "lens_orders_firebase_id_unique" UNIQUE("firebase_id")
);
--> statement-breakpoint
CREATE TABLE "mounting_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"title" text NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"due_date" timestamp,
	"related_id" varchar(36),
	"related_type" text,
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"is_active" boolean DEFAULT true,
	"failed_login_attempts" integer DEFAULT 0,
	"lockout_until" timestamp,
	"last_login_at" timestamp,
	"max_products" integer,
	"max_clients" integer,
	"max_suppliers" integer,
	"last_payment_date" timestamp,
	"next_payment_date" timestamp,
	"subscription_expiry" timestamp,
	"payment_mode" text,
	"billing_cycle" text,
	"agreed_price" numeric(10, 2),
	"amount_paid" numeric(10, 2),
	"installments_count" integer,
	"next_installment_date" timestamp,
	"training_price" numeric(10, 2),
	"setup_price" numeric(10, 2),
	"plan_id" text,
	"acquisition_cost" numeric(10, 2),
	"acquisition_cost_currency" text,
	"sale_price" numeric(10, 2),
	"sale_price_currency" text,
	"custom_subscription_price" numeric(10, 2),
	"custom_subscription_currency" text,
	"financial_notes" text,
	"sold_at" timestamp,
	"payment_method" text,
	"deployment_type" text,
	"pricing_model" text,
	"subscription_year" integer,
	"is_perpetual_license" boolean,
	"perpetual_license_date" timestamp,
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"subscription_status" text,
	"auto_renew" boolean DEFAULT false,
	"suspended_at" timestamp,
	"suspension_reason" text,
	"last_reminder_sent_at" timestamp,
	"reminders_sent_count" integer,
	"market_supplier_profile_id" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"old_value" json,
	"new_value" json,
	"metadata" json,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses_v2" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"amount" real NOT NULL,
	"currency" text DEFAULT 'MAD' NOT NULL,
	"due_date" timestamp,
	"payment_date" timestamp,
	"period" text,
	"status" text NOT NULL,
	"provider" text,
	"invoice_number" text,
	"attachments" text[],
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_imports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"supplier_id" text,
	"invoice_number" text NOT NULL,
	"invoice_date" timestamp,
	"status" text DEFAULT 'completed',
	"total_items" integer,
	"reverted_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "prescriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"client_id" integer,
	"prescription_date" timestamp,
	"doctor_name" text,
	"image_url" text,
	"od_sph" real,
	"od_cyl" real,
	"od_axis" integer,
	"od_add" real,
	"os_sph" real,
	"os_cyl" real,
	"os_axis" integer,
	"os_add" real,
	"pd" real,
	"notes" text,
	"status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"od_pd" real,
	"od_height" real,
	"os_pd" real,
	"os_height" real
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" integer,
	"client_name" text NOT NULL,
	"items" json NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"deposit_amount" numeric(10, 2) DEFAULT '0',
	"remaining_amount" numeric(10, 2),
	"status" text DEFAULT 'PENDING',
	"notes" text,
	"sale_id" integer,
	"expiry_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "client_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"client_id" integer,
	"type" text DEFAULT 'note' NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_credit_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"credit_account_id" integer NOT NULL,
	"type" text NOT NULL,
	"montant" numeric(10, 2) NOT NULL,
	"motif" text NOT NULL,
	"reference_type" text,
	"reference_id" integer,
	"note" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "market_credit_movements_type_check" CHECK (type = ANY (ARRAY['DEBIT'::text, 'CREDIT'::text])),
	CONSTRAINT "market_credit_movements_motif_check" CHECK (motif = ANY (ARRAY['COMMANDE'::text, 'PAIEMENT'::text, 'AVOIR'::text, 'REMISE'::text, 'CORRECTION'::text]))
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"priority" text DEFAULT 'MEDIUM' NOT NULL,
	"related_entity_type" text,
	"related_entity_id" integer,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "frame_reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"client_id" integer NOT NULL,
	"client_name" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"items" json NOT NULL,
	"reservation_date" timestamp DEFAULT now() NOT NULL,
	"expiry_date" timestamp NOT NULL,
	"completed_at" timestamp,
	"sale_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"total_amount" numeric(10, 2) DEFAULT '0',
	"deposit_amount" numeric(10, 2) DEFAULT '0',
	"remaining_amount" numeric(10, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "market_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"category_id" integer,
	"name" text NOT NULL,
	"description" text,
	"reference" text,
	"brand" text,
	"type" text DEFAULT 'AUTRE' NOT NULL,
	"material" text,
	"color" text,
	"unit_price_ht" numeric(10, 2) NOT NULL,
	"tva_rate" numeric(5, 2) DEFAULT '20',
	"unit_price_ttc" numeric(10, 2),
	"stock_quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"min_order_qty" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"tags" text[],
	"specs" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"rejection_reason" text
);
--> statement-breakpoint
CREATE TABLE "sale_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"sale_id" integer NOT NULL,
	"product_id" integer,
	"category" text,
	"product_type" text,
	"label" text NOT NULL,
	"qty" integer DEFAULT 1 NOT NULL,
	"unit_price_ht" numeric(10, 2) DEFAULT '0' NOT NULL,
	"unit_price_tva" numeric(10, 2) DEFAULT '0' NOT NULL,
	"unit_price_ttc" numeric(10, 2) DEFAULT '0' NOT NULL,
	"tva_rate" numeric(5, 2) DEFAULT '20' NOT NULL,
	"line_total_ht" numeric(10, 2) DEFAULT '0' NOT NULL,
	"line_total_tva" numeric(10, 2) DEFAULT '0' NOT NULL,
	"line_total_ttc" numeric(10, 2) DEFAULT '0' NOT NULL,
	"is_discount_line" boolean DEFAULT false,
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"brand" text,
	"unit_purchase_price" numeric(10, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sale_contact_lens_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"sale_item_id" integer NOT NULL,
	"eye" text NOT NULL,
	"power" text,
	"base_curve" text,
	"diameter" text,
	"duration" text,
	"cylinder" text,
	"axis" text,
	"addition" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sale_lens_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"sale_item_id" integer NOT NULL,
	"eye" text NOT NULL,
	"sphere" text,
	"cylinder" text,
	"axis" text,
	"addition" text,
	"index" text,
	"diameter" text,
	"material" text,
	"treatment" text,
	"lens_type" text,
	"base_curve" text,
	"prism" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cash_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"opened_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp,
	"opening_balance" numeric(10, 2) DEFAULT '0' NOT NULL,
	"closing_balance" numeric(10, 2),
	"expected_balance" numeric(10, 2),
	"difference" numeric(10, 2),
	"status" text DEFAULT 'open' NOT NULL,
	"notes" text,
	"closed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cash_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reason" text NOT NULL,
	"reference_id" text,
	"reference_type" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comptabilite_journal" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"sale_id" integer,
	"montant_ht" numeric(10, 2) NOT NULL,
	"tva" numeric(10, 2) NOT NULL,
	"montant_ttc" numeric(10, 2) NOT NULL,
	"statut" text DEFAULT 'BROUILLON',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "goods_receipt_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"receipt_id" uuid NOT NULL,
	"order_item_id" integer,
	"product_id" integer,
	"qty_ordered" integer DEFAULT 0,
	"qty_received" integer DEFAULT 0 NOT NULL,
	"qty_rejected" integer DEFAULT 0,
	"unit_price" numeric(15, 2)
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"fingerprint" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_activity_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supplier_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"supplier_id" uuid NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"remaining_amount" numeric(15, 2) NOT NULL,
	"status" text DEFAULT 'open',
	"source_type" text,
	"reference" text,
	"notes" text,
	"related_receipt_id" uuid,
	"related_order_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" text DEFAULT 'USER' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"failed_login_attempts" integer DEFAULT 0 NOT NULL,
	"lockout_until" timestamp,
	"max_products" integer DEFAULT 500 NOT NULL,
	"max_clients" integer DEFAULT 200 NOT NULL,
	"max_suppliers" integer DEFAULT 100 NOT NULL,
	"last_payment_date" timestamp,
	"next_payment_date" timestamp,
	"subscription_expiry" timestamp,
	"payment_mode" text DEFAULT 'subscription',
	"billing_cycle" text DEFAULT 'monthly',
	"agreed_price" numeric(10, 2),
	"training_price" numeric(10, 2) DEFAULT '0',
	"setup_price" numeric(10, 2) DEFAULT '0',
	"amount_paid" numeric(10, 2) DEFAULT '0',
	"installments_count" integer DEFAULT 1,
	"next_installment_date" timestamp,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"supplier_id" uuid NOT NULL,
	"delivery_note_ref" text,
	"status" text DEFAULT 'draft',
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"validated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "supplier_credit_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"credit_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_ar" text,
	"slug" text NOT NULL,
	"icon" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "market_categories_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "market_supplier_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"company_name" text NOT NULL,
	"logo_url" text,
	"description" text,
	"phone" text,
	"email" text,
	"address" text,
	"city" text,
	"ice" text,
	"rc" text,
	"rib" text,
	"payment_terms" text DEFAULT '30',
	"min_order_amount" numeric(10, 2) DEFAULT '0',
	"shipping_info" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"verified_at" timestamp,
	"verified_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"supplier_id" uuid,
	"onboarding_step" integer DEFAULT 0,
	"onboarding_completed" boolean DEFAULT false,
	CONSTRAINT "market_supplier_profiles_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "market_product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"sort_order" integer DEFAULT 0,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"position" integer DEFAULT 0,
	"file_size_kb" integer
);
--> statement-breakpoint
CREATE TABLE "market_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"optician_id" text NOT NULL,
	"supplier_id" uuid NOT NULL,
	"erp_order_id" integer,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"sub_total_ht" numeric(10, 2) NOT NULL,
	"tva_amount" numeric(10, 2) DEFAULT '0',
	"shipping_cost" numeric(10, 2) DEFAULT '0',
	"total_ttc" numeric(10, 2) NOT NULL,
	"payment_method" text DEFAULT 'CREDIT',
	"payment_status" text DEFAULT 'UNPAID' NOT NULL,
	"amount_paid" numeric(10, 2) DEFAULT '0',
	"shipping_address" text,
	"expected_delivery" timestamp,
	"notes" text,
	"confirmed_at" timestamp,
	"shipped_at" timestamp,
	"delivered_at" timestamp,
	"cancelled_at" timestamp,
	"cancellation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "market_orders_order_number_key" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "market_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"product_snapshot" json NOT NULL,
	"quantity" integer NOT NULL,
	"received_quantity" integer DEFAULT 0 NOT NULL,
	"unit_price_ht" numeric(10, 2) NOT NULL,
	"total_price_ht" numeric(10, 2) NOT NULL,
	"erp_product_id" integer,
	"stock_synced" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
ALTER TABLE "contact_lens_prescriptions" ADD CONSTRAINT "contact_lens_prescriptions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_order_items" ADD CONSTRAINT "supplier_order_items_order_id_supplier_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."supplier_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_order_items" ADD CONSTRAINT "supplier_order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_orders" ADD CONSTRAINT "supplier_orders_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_order_payments" ADD CONSTRAINT "supplier_order_payments_payment_id_supplier_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."supplier_payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_order_payments" ADD CONSTRAINT "supplier_order_payments_order_id_supplier_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."supplier_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_matiere_id_materials_id_fk" FOREIGN KEY ("matiere_id") REFERENCES "public"."materials"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_couleur_id_colors_id_fk" FOREIGN KEY ("couleur_id") REFERENCES "public"."colors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_fournisseur_id_fkey" FOREIGN KEY ("fournisseur_id") REFERENCES "public"."suppliers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_marque_id_fkey" FOREIGN KEY ("marque_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devis" ADD CONSTRAINT "devis_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "devis" ADD CONSTRAINT "devis_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_payments" ADD CONSTRAINT "supplier_payments_order_id_supplier_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."supplier_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions_legacy" ADD CONSTRAINT "prescriptions_legacy_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_transactions" ADD CONSTRAINT "client_transactions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lens_orders" ADD CONSTRAINT "lens_orders_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lens_orders" ADD CONSTRAINT "lens_orders_prescription_id_prescriptions_legacy_id_fk" FOREIGN KEY ("prescription_id") REFERENCES "public"."prescriptions_legacy"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lens_orders" ADD CONSTRAINT "lens_orders_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lens_orders" ADD CONSTRAINT "lens_orders_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lens_orders" ADD CONSTRAINT "lens_orders_supplier_order_id_supplier_orders_id_fk" FOREIGN KEY ("supplier_order_id") REFERENCES "public"."supplier_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_interactions" ADD CONSTRAINT "client_interactions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_credit_movements" ADD CONSTRAINT "market_credit_movements_credit_account_id_fkey" FOREIGN KEY ("credit_account_id") REFERENCES "public"."market_credit_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frame_reservations" ADD CONSTRAINT "frame_reservations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frame_reservations" ADD CONSTRAINT "frame_reservations_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_items" ADD CONSTRAINT "sale_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_contact_lens_details" ADD CONSTRAINT "sale_contact_lens_details_sale_item_id_sale_items_id_fk" FOREIGN KEY ("sale_item_id") REFERENCES "public"."sale_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale_lens_details" ADD CONSTRAINT "sale_lens_details_sale_item_id_sale_items_id_fk" FOREIGN KEY ("sale_item_id") REFERENCES "public"."sale_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_movements" ADD CONSTRAINT "cash_movements_session_id_cash_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."cash_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comptabilite_journal" ADD CONSTRAINT "comptabilite_journal_sale_id_sales_id_fk" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_order_item_id_supplier_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."supplier_order_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_credits" ADD CONSTRAINT "supplier_credits_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_credits" ADD CONSTRAINT "supplier_credits_related_order_id_supplier_orders_id_fk" FOREIGN KEY ("related_order_id") REFERENCES "public"."supplier_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_credit_allocations" ADD CONSTRAINT "supplier_credit_allocations_credit_id_supplier_credits_id_fk" FOREIGN KEY ("credit_id") REFERENCES "public"."supplier_credits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_credit_allocations" ADD CONSTRAINT "supplier_credit_allocations_order_id_supplier_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."supplier_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_orders_supplier_date" ON "supplier_orders" USING btree ("supplier_id" timestamptz_ops,"date_commande" timestamptz_ops,"deleted_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_products_brand" ON "products" USING btree ("brand" text_ops);--> statement-breakpoint
CREATE INDEX "idx_products_category" ON "products" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "idx_products_client" ON "products" USING btree ("client_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_products_not_deleted" ON "products" USING btree ("user_id" text_ops,"deleted_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_products_type" ON "products" USING btree ("product_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_products_user_deleted" ON "products" USING btree ("user_id" text_ops,"deleted_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_products_user_marque" ON "products" USING btree ("user_id" text_ops,"marque" text_ops);--> statement-breakpoint
CREATE INDEX "idx_products_user_reference" ON "products" USING btree ("user_id" text_ops,"reference" text_ops);--> statement-breakpoint
CREATE INDEX "idx_products_user_stock" ON "products" USING btree ("user_id" int4_ops,"quantite_stock" text_ops);--> statement-breakpoint
CREATE INDEX "products_fournisseur_id_idx" ON "products" USING btree ("fournisseur_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "products_nom_idx" ON "products" USING btree ("nom" text_ops);--> statement-breakpoint
CREATE INDEX "products_reference_idx" ON "products" USING btree ("reference" text_ops);--> statement-breakpoint
CREATE INDEX "products_search_idx" ON "products" USING btree ("marque" text_ops,"fournisseur" text_ops);--> statement-breakpoint
CREATE INDEX "products_user_id_idx" ON "products" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "clients_full_name_idx" ON "clients" USING btree ("full_name" text_ops);--> statement-breakpoint
CREATE INDEX "clients_phone_idx" ON "clients" USING btree ("phone" text_ops);--> statement-breakpoint
CREATE INDEX "clients_user_id_idx" ON "clients" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_clients_fullname_search" ON "clients" USING btree ("full_name" text_ops);--> statement-breakpoint
CREATE INDEX "mom_order_id_idx" ON "market_order_messages" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "mom_sender_id_idx" ON "market_order_messages" USING btree ("sender_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_payments_supplier_date" ON "supplier_payments" USING btree ("supplier_id" timestamptz_ops,"date" timestamptz_ops,"deleted_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "mca_optician_id_idx" ON "market_credit_accounts" USING btree ("optician_id" text_ops);--> statement-breakpoint
CREATE INDEX "mca_supplier_id_idx" ON "market_credit_accounts" USING btree ("supplier_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "mca_supplier_optician_idx" ON "market_credit_accounts" USING btree ("supplier_id" uuid_ops,"optician_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_sales_unique_number" ON "sales" USING btree ("user_id" text_ops,"sale_number" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_sales_unique_transaction" ON "sales" USING btree ("user_id" text_ops,"transaction_number" text_ops);--> statement-breakpoint
CREATE INDEX "idx_sales_user_date" ON "sales" USING btree ("user_id" timestamp_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "sales_client_id_idx" ON "sales" USING btree ("client_id" int4_ops);--> statement-breakpoint
CREATE INDEX "sales_sale_number_idx" ON "sales" USING btree ("sale_number" text_ops);--> statement-breakpoint
CREATE INDEX "sales_transaction_number_idx" ON "sales" USING btree ("transaction_number" text_ops);--> statement-breakpoint
CREATE INDEX "sales_user_id_idx" ON "sales" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_suppliers_active" ON "suppliers" USING btree ("is_active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_suppliers_name" ON "suppliers" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_lens_orders_pending" ON "lens_orders" USING btree ("user_id" text_ops,"created_at" timestamp_ops) WHERE (status = 'pending'::text);--> statement-breakpoint
CREATE INDEX "idx_lens_orders_ready_for_delivery" ON "lens_orders" USING btree ("user_id" timestamp_ops,"updated_at" timestamp_ops) WHERE ((status = 'received'::text) AND (sale_id IS NULL));--> statement-breakpoint
CREATE INDEX "lens_orders_client_id_idx" ON "lens_orders" USING btree ("client_id" int4_ops);--> statement-breakpoint
CREATE INDEX "lens_orders_sale_id_idx" ON "lens_orders" USING btree ("sale_id" int4_ops);--> statement-breakpoint
CREATE INDEX "lens_orders_sphere_l_idx" ON "lens_orders" USING btree ("sphere_l" text_ops);--> statement-breakpoint
CREATE INDEX "lens_orders_sphere_r_idx" ON "lens_orders" USING btree ("sphere_r" text_ops);--> statement-breakpoint
CREATE INDEX "lens_orders_supplier_id_idx" ON "lens_orders" USING btree ("supplier_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lens_orders_user_id_idx" ON "lens_orders" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_reminders_dashboard" ON "reminders" USING btree ("user_id" timestamp_ops,"status" text_ops,"due_date" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_reminders_related" ON "reminders" USING btree ("related_type" text_ops,"related_id" text_ops);--> statement-breakpoint
CREATE INDEX "expenses_v2_status_idx" ON "expenses_v2" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "expenses_v2_store_id_idx" ON "expenses_v2" USING btree ("store_id" text_ops);--> statement-breakpoint
CREATE INDEX "expenses_v2_type_idx" ON "expenses_v2" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX "expenses_v2_user_id_idx" ON "expenses_v2" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_unique_import" ON "invoice_imports" USING btree ("user_id" text_ops,"supplier_id" text_ops,"invoice_number" timestamp_ops,"invoice_date" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_user_invoice" ON "invoice_imports" USING btree ("user_id" text_ops,"invoice_number" text_ops);--> statement-breakpoint
CREATE INDEX "reservations_client_id_idx" ON "reservations" USING btree ("client_id" int4_ops);--> statement-breakpoint
CREATE INDEX "reservations_status_idx" ON "reservations" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "reservations_user_id_idx" ON "reservations" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "interactions_client_id_idx" ON "client_interactions" USING btree ("client_id" int4_ops);--> statement-breakpoint
CREATE INDEX "interactions_user_id_idx" ON "client_interactions" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "mcm_credit_account_idx" ON "market_credit_movements" USING btree ("credit_account_id" int4_ops);--> statement-breakpoint
CREATE INDEX "mcm_type_idx" ON "market_credit_movements" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX "mp_brand_idx" ON "market_products" USING btree ("brand" text_ops);--> statement-breakpoint
CREATE INDEX "mp_category_id_idx" ON "market_products" USING btree ("category_id" int4_ops);--> statement-breakpoint
CREATE INDEX "mp_status_idx" ON "market_products" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "mp_supplier_id_idx" ON "market_products" USING btree ("supplier_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "mp_type_idx" ON "market_products" USING btree ("type" text_ops);--> statement-breakpoint
CREATE INDEX "sale_items_product_id_idx" ON "sale_items" USING btree ("product_id" int4_ops);--> statement-breakpoint
CREATE INDEX "sale_items_sale_id_idx" ON "sale_items" USING btree ("sale_id" int4_ops);--> statement-breakpoint
CREATE INDEX "sale_contact_lens_details_item_id_idx" ON "sale_contact_lens_details" USING btree ("sale_item_id" int4_ops);--> statement-breakpoint
CREATE INDEX "sale_lens_details_item_id_idx" ON "sale_lens_details" USING btree ("sale_item_id" int4_ops);--> statement-breakpoint
CREATE INDEX "cash_sessions_opened_at_idx" ON "cash_sessions" USING btree ("opened_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "cash_sessions_status_idx" ON "cash_sessions" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "cash_sessions_user_id_idx" ON "cash_sessions" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "cash_movements_created_at_idx" ON "cash_movements" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "cash_movements_session_id_idx" ON "cash_movements" USING btree ("session_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "cash_movements_user_id_idx" ON "cash_movements" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "journal_sale_id_idx" ON "comptabilite_journal" USING btree ("sale_id" int4_ops);--> statement-breakpoint
CREATE INDEX "journal_user_id_idx" ON "comptabilite_journal" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_supplier_credits_status" ON "supplier_credits" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_supplier_credits_supplier" ON "supplier_credits" USING btree ("supplier_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "msp_status_idx" ON "market_supplier_profiles" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "msp_user_id_idx" ON "market_supplier_profiles" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "mpi_product_id_idx" ON "market_product_images" USING btree ("product_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "mpi_unique_primary_idx" ON "market_product_images" USING btree ("product_id" uuid_ops) WHERE (is_primary = true);--> statement-breakpoint
CREATE INDEX "mo_optician_id_idx" ON "market_orders" USING btree ("optician_id" text_ops);--> statement-breakpoint
CREATE INDEX "mo_status_idx" ON "market_orders" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "mo_supplier_id_idx" ON "market_orders" USING btree ("supplier_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "moi_order_id_idx" ON "market_order_items" USING btree ("order_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "moi_product_id_idx" ON "market_order_items" USING btree ("product_id" uuid_ops);--> statement-breakpoint
CREATE VIEW "public"."supplier_balance_view" AS (SELECT s.id AS supplier_id, s.user_id, COALESCE(sum(so.montant_total), 0::numeric) AS total_achats, COALESCE(sum(sp.amount), 0::numeric) AS total_paiements, COALESCE(sum(so.montant_total), 0::numeric) - COALESCE(sum(sp.amount), 0::numeric) AS solde_reel FROM suppliers s LEFT JOIN supplier_orders so ON so.supplier_id = s.id AND so.deleted_at IS NULL LEFT JOIN supplier_payments sp ON sp.supplier_id = s.id AND sp.deleted_at IS NULL GROUP BY s.id, s.user_id);
*/