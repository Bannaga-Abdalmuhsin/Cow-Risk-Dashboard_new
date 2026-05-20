import {
  pgTable, text, serial, real, integer, boolean, timestamp,
} from "drizzle-orm/pg-core";

export const teamUsersTable = pgTable("team_users", {
  id:           serial("id").primaryKey(),
  name:         text("name").notNull(),
  role:         text("role").notNull(),
  pin:          text("pin").notNull(),
  token:        text("token"),
  defaultArea:  text("default_area"),
  mcName:       text("mc_name"),
  mobileNumber: text("mobile_number"),
  pushToken:    text("push_token"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

export const techLocationsTable = pgTable("tech_locations", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").notNull().unique().references(() => teamUsersTable.id),
  lat:       real("lat").notNull(),
  lng:       real("lng").notNull(),
  area:      text("area"),
  isOnDuty:  boolean("is_on_duty").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assignmentsTable = pgTable("assignments", {
  id:          serial("id").primaryKey(),
  techId:      integer("tech_id").notNull().references(() => teamUsersTable.id),
  managerId:   integer("manager_id").notNull().references(() => teamUsersTable.id),
  message:     text("message").notNull(),
  sentAt:      timestamp("sent_at").defaultNow().notNull(),
  readAt:      timestamp("read_at"),
  reply:       text("reply"),
  repliedAt:   timestamp("replied_at"),
});

export const faultsTable = pgTable("faults", {
  id:              serial("id").primaryKey(),
  ttId:            text("tt_id").notNull(),
  cowId:           text("cow_id").notNull(),
  alarmName:       text("alarm_name").notNull(),
  severity:        text("severity").notNull(),
  powerSource:     text("power_source"),
  backupTime:      text("backup_time"),
  siteLat:         real("site_lat").notNull(),
  siteLng:         real("site_lng").notNull(),
  location:        text("location"),
  assignedTechId:  integer("assigned_tech_id").references(() => teamUsersTable.id),
  dispatchStatus:  text("dispatch_status").notNull().default("new"),
  eta:             integer("eta"),
  receivedAt:      timestamp("received_at").defaultNow().notNull(),
  dispatchedAt:    timestamp("dispatched_at"),
  resolvedAt:      timestamp("resolved_at"),
  apiKey:          text("api_key"),
});

export type TeamUser     = typeof teamUsersTable.$inferSelect;
export type TechLocation = typeof techLocationsTable.$inferSelect;
export type Assignment   = typeof assignmentsTable.$inferSelect;
export type Fault        = typeof faultsTable.$inferSelect;
