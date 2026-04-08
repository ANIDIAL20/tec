import { 
  pgTable, uuid, text, 
  timestamp, pgEnum, integer 
} from 'drizzle-orm/pg-core';

export const statutEnum = pgEnum('statut', [
  'nouveau',
  'contacté', 
  'entretien',
  'accepté',
  'refusé'
]);

export const candidatures = pgTable('candidatures', {
  id:          uuid('id').defaultRandom().primaryKey(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  nomComplet:  text('nom_complet').notNull(),
  age:         text('age'),
  telephone:   text('telephone').notNull(),
  email:       text('email'),
  region:      text('region').notNull(),
  ville:       text('ville').notNull(),
  niveau:      text('niveau').notNull(),
  motivations: text('motivations'), // Stocké en string "option1, option2..."
  groupe:      text('groupe').default('G06').notNull(),
  statut:      statutEnum('statut').default('nouveau').notNull(),
  notes:       text('notes'),
});

export type Candidature = typeof candidatures.$inferSelect;
export type NewCandidature = typeof candidatures.$inferInsert;
