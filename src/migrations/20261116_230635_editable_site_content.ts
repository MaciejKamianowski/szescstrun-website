import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_about_buttons_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_site_settings_navigation_link_type" AS ENUM('internal', 'external');
  CREATE TYPE "public"."enum_site_settings_recordings_empty_behavior" AS ENUM('message', 'hide');
  CREATE TYPE "public"."enum_site_settings_nav_cta_link_type" AS ENUM('internal', 'external');
  CREATE TABLE "downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"active" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0,
  	"prefix" varchar DEFAULT 'downloads',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  CREATE TABLE "site_settings_why_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "site_settings_about_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "site_settings_about_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" jsonb,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "site_settings_about_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_site_settings_about_buttons_link_type" DEFAULT 'internal' NOT NULL,
  	"internal_path" varchar,
  	"external_url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_site_settings_navigation_link_type" DEFAULT 'internal' NOT NULL,
  	"internal_path" varchar,
  	"external_url" varchar,
  	"open_in_new_tab" boolean DEFAULT false,
  	"active" boolean DEFAULT true
  );
  
  ALTER TABLE "site_settings" ALTER COLUMN "seo_default_title" SET DEFAULT 'Sześć Strun – Lekcje gitary akustycznej | Jacek Krakowski';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_default_description" SET DEFAULT 'Sześć Strun to indywidualne lekcje gitary akustycznej prowadzone przez Jacka Krakowskiego. Poznaj ofertę, rozwijaj umiejętności i umów lekcję.';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "downloads_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "show_about_preview" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "about_preview_eyebrow" varchar DEFAULT 'O nauczycielu';
  ALTER TABLE "site_settings" ADD COLUMN "about_preview_title" varchar DEFAULT 'Jacek Krakowski';
  ALTER TABLE "site_settings" ADD COLUMN "about_preview_lead" varchar DEFAULT 'Indywidualne podejście, spokojna praca nad brzmieniem i techniką oraz nauka dopasowana do Twojego tempa.';
  ALTER TABLE "site_settings" ADD COLUMN "about_preview_text" varchar DEFAULT 'Sześć Strun to przestrzeń do nauki gry na gitarze akustycznej — od pierwszych akordów po bardziej świadomą pracę nad stylem i repertuarem. Szczegółowe informacje o doświadczeniu i metodzie nauczania znajdziesz na stronie nauczyciela.';
  ALTER TABLE "site_settings" ADD COLUMN "about_preview_button_label" varchar DEFAULT 'Poznaj Jacka';
  ALTER TABLE "site_settings" ADD COLUMN "about_preview_button_href" varchar DEFAULT '/o-mnie';
  ALTER TABLE "site_settings" ADD COLUMN "about_preview_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "show_why_section" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "why_eyebrow" varchar DEFAULT 'Metoda';
  ALTER TABLE "site_settings" ADD COLUMN "why_title" varchar DEFAULT 'Dlaczego warto';
  ALTER TABLE "site_settings" ADD COLUMN "why_description" varchar DEFAULT 'Spokojna, konkretna nauka bez niezweryfikowanych obietnic — z naciskiem na regularność i zrozumienie instrumentu.';
  ALTER TABLE "site_settings" ADD COLUMN "show_recordings_section" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "recordings_eyebrow" varchar DEFAULT 'Nagrania';
  ALTER TABLE "site_settings" ADD COLUMN "recordings_title" varchar DEFAULT 'Posłuchaj i zobacz';
  ALTER TABLE "site_settings" ADD COLUMN "recordings_description" varchar DEFAULT 'Filmy z oficjalnego kanału YouTube.';
  ALTER TABLE "site_settings" ADD COLUMN "recordings_button_label" varchar DEFAULT 'Wszystkie nagrania';
  ALTER TABLE "site_settings" ADD COLUMN "recordings_button_href" varchar DEFAULT '/nagrania';
  ALTER TABLE "site_settings" ADD COLUMN "recordings_empty_behavior" "enum_site_settings_recordings_empty_behavior" DEFAULT 'message';
  ALTER TABLE "site_settings" ADD COLUMN "recordings_empty_message" varchar DEFAULT 'Pierwsze nagrania już wkrótce.';
  ALTER TABLE "site_settings" ADD COLUMN "recordings_page_title" varchar DEFAULT 'Galeria filmów';
  ALTER TABLE "site_settings" ADD COLUMN "recordings_page_intro" varchar DEFAULT 'Wybrane materiały wideo.';
  ALTER TABLE "site_settings" ADD COLUMN "about_eyebrow" varchar DEFAULT 'O mnie';
  ALTER TABLE "site_settings" ADD COLUMN "about_heading" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "about_intro" varchar DEFAULT 'Nauczyciel gry na gitarze akustycznej.';
  ALTER TABLE "site_settings" ADD COLUMN "teacher_experience_heading" varchar DEFAULT 'Doświadczenie';
  ALTER TABLE "site_settings" ADD COLUMN "teacher_experience" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "teacher_method_heading" varchar DEFAULT 'Metoda nauczania';
  ALTER TABLE "site_settings" ADD COLUMN "teacher_method" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "about_photo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "about_seo_title" varchar DEFAULT 'Jacek Krakowski – Nauczyciel gry na gitarze | Sześć Strun';
  ALTER TABLE "site_settings" ADD COLUMN "about_seo_description" varchar DEFAULT 'Poznaj Jacka Krakowskiego, nauczyciela gry na gitarze akustycznej i twórcę Sześciu Strun. Dowiedz się więcej o jego podejściu do nauczania.';
  ALTER TABLE "site_settings" ADD COLUMN "nav_cta_label" varchar DEFAULT 'Umów lekcję';
  ALTER TABLE "site_settings" ADD COLUMN "nav_cta_active" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "nav_cta_link_type" "enum_site_settings_nav_cta_link_type" DEFAULT 'internal' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "nav_cta_internal_path" varchar DEFAULT '/kontakt';
  ALTER TABLE "site_settings" ADD COLUMN "nav_cta_external_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "nav_cta_open_in_new_tab" boolean DEFAULT false;
  ALTER TABLE "site_settings" ADD COLUMN "footer_note" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "downloads_eyebrow" varchar DEFAULT 'Materiały';
  ALTER TABLE "site_settings" ADD COLUMN "downloads_title" varchar DEFAULT 'Do pobrania';
  ALTER TABLE "site_settings" ADD COLUMN "downloads_description" varchar DEFAULT 'Pliki, które możesz pobrać i zachować.';
  ALTER TABLE "site_settings" ADD COLUMN "downloads_empty_message" varchar DEFAULT 'Materiały pojawią się tutaj wkrótce.';
  ALTER TABLE "site_settings" ADD COLUMN "downloads_seo_title" varchar DEFAULT 'Materiały do pobrania | Sześć Strun';
  ALTER TABLE "site_settings" ADD COLUMN "downloads_seo_description" varchar DEFAULT 'Materiały do pobrania przygotowane przez Sześć Strun — lekcje gitary akustycznej Jacka Krakowskiego.';
  ALTER TABLE "site_settings_why_points" ADD CONSTRAINT "site_settings_why_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_gallery" ADD CONSTRAINT "site_settings_about_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_about_gallery" ADD CONSTRAINT "site_settings_about_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_sections" ADD CONSTRAINT "site_settings_about_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_about_buttons" ADD CONSTRAINT "site_settings_about_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "downloads_updated_at_idx" ON "downloads" USING btree ("updated_at");
  CREATE INDEX "downloads_created_at_idx" ON "downloads" USING btree ("created_at");
  CREATE UNIQUE INDEX "downloads_filename_idx" ON "downloads" USING btree ("filename");
  CREATE INDEX "site_settings_why_points_order_idx" ON "site_settings_why_points" USING btree ("_order");
  CREATE INDEX "site_settings_why_points_parent_id_idx" ON "site_settings_why_points" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_gallery_order_idx" ON "site_settings_about_gallery" USING btree ("_order");
  CREATE INDEX "site_settings_about_gallery_parent_id_idx" ON "site_settings_about_gallery" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_gallery_image_idx" ON "site_settings_about_gallery" USING btree ("image_id");
  CREATE INDEX "site_settings_about_sections_order_idx" ON "site_settings_about_sections" USING btree ("_order");
  CREATE INDEX "site_settings_about_sections_parent_id_idx" ON "site_settings_about_sections" USING btree ("_parent_id");
  CREATE INDEX "site_settings_about_buttons_order_idx" ON "site_settings_about_buttons" USING btree ("_order");
  CREATE INDEX "site_settings_about_buttons_parent_id_idx" ON "site_settings_about_buttons" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_order_idx" ON "site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "site_settings_navigation" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_downloads_fk" FOREIGN KEY ("downloads_id") REFERENCES "public"."downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_about_preview_image_id_media_id_fk" FOREIGN KEY ("about_preview_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_about_photo_id_media_id_fk" FOREIGN KEY ("about_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("downloads_id");
  CREATE INDEX "site_settings_about_preview_image_idx" ON "site_settings" USING btree ("about_preview_image_id");
  CREATE INDEX "site_settings_about_photo_idx" ON "site_settings" USING btree ("about_photo_id");`)

  // Fill new lists once. Existing rows, biography and hero copy are not updated.
  // A later save by the owner is never overwritten because this runs only with the migration.
  await db.execute(sql`
   INSERT INTO "site_settings_navigation" ("id", "_order", "_parent_id", "label", "link_type", "internal_path", "external_url", "open_in_new_tab", "active")
   SELECT v.id || '-' || s.id::text,
          v.ord,
          s.id,
          v.label,
          v.link_type::"enum_site_settings_navigation_link_type",
          v.internal_path,
          v.external_url,
          v.open_in_new_tab,
          v.active
   FROM "site_settings" s
   CROSS JOIN (
     VALUES
       ('nav-home', 1, 'Strona główna', 'internal', '/', NULL::varchar, false, true),
       ('nav-about', 2, 'O mnie', 'internal', '/o-mnie', NULL::varchar, false, true),
       ('nav-offer', 3, 'Oferta', 'internal', '/oferta', NULL::varchar, false, true),
       ('nav-pricing', 4, 'Cennik', 'internal', '/cennik', NULL::varchar, false, false),
       ('nav-downloads', 5, 'Do pobrania', 'internal', '/do-pobrania', NULL::varchar, false, true),
       ('nav-courses', 6, 'Kursy', 'external', NULL::varchar, NULL::varchar, true, false),
       ('nav-news', 7, 'Aktualności', 'internal', '/aktualnosci', NULL::varchar, false, true),
       ('nav-videos', 8, 'Nagrania', 'internal', '/nagrania', NULL::varchar, false, true),
       ('nav-contact', 9, 'Kontakt', 'internal', '/kontakt', NULL::varchar, false, true)
   ) AS v(id, ord, label, link_type, internal_path, external_url, open_in_new_tab, active)
   WHERE NOT EXISTS (
     SELECT 1 FROM "site_settings_navigation" n WHERE n."_parent_id" = s.id
   );

   INSERT INTO "site_settings_why_points" ("id", "_order", "_parent_id", "title", "text", "active")
   SELECT v.id || '-' || s.id::text, v.ord, s.id, v.title, v.text, true
   FROM "site_settings" s
   CROSS JOIN (
     VALUES
       ('why-1', 1, 'Indywidualne tempo', 'Program zajęć dopasowujemy do Twojego poziomu, celów i dostępnego czasu na ćwiczenia.'),
       ('why-2', 2, 'Praca nad brzmieniem', 'Uczymy się nie tylko chwytów, ale także słuchania, rytmu i świadomego prowadzenia dźwięku.'),
       ('why-3', 3, 'Repertuar z sensem', 'Ćwiczenia łączymy z utworami, które naprawdę chcesz grać — od podstaw po bardziej złożone aranżacje.')
   ) AS v(id, ord, title, text)
   WHERE NOT EXISTS (
     SELECT 1 FROM "site_settings_why_points" p WHERE p."_parent_id" = s.id
   );`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_why_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_about_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_about_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_about_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_navigation" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "downloads" CASCADE;
  DROP TABLE "site_settings_why_points" CASCADE;
  DROP TABLE "site_settings_about_gallery" CASCADE;
  DROP TABLE "site_settings_about_sections" CASCADE;
  DROP TABLE "site_settings_about_buttons" CASCADE;
  DROP TABLE "site_settings_navigation" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_downloads_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_about_preview_image_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_about_photo_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_downloads_id_idx";
  DROP INDEX "site_settings_about_preview_image_idx";
  DROP INDEX "site_settings_about_photo_idx";
  ALTER TABLE "site_settings" ALTER COLUMN "seo_default_title" SET DEFAULT 'Sześć Strun — lekcje gitary akustycznej';
  ALTER TABLE "site_settings" ALTER COLUMN "seo_default_description" SET DEFAULT 'Indywidualne lekcje gry na gitarze akustycznej z Jackiem Krakowskim. Sprawdź ofertę i umów lekcję.';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "downloads_id";
  ALTER TABLE "site_settings" DROP COLUMN "show_about_preview";
  ALTER TABLE "site_settings" DROP COLUMN "about_preview_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "about_preview_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_preview_lead";
  ALTER TABLE "site_settings" DROP COLUMN "about_preview_text";
  ALTER TABLE "site_settings" DROP COLUMN "about_preview_button_label";
  ALTER TABLE "site_settings" DROP COLUMN "about_preview_button_href";
  ALTER TABLE "site_settings" DROP COLUMN "about_preview_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "show_why_section";
  ALTER TABLE "site_settings" DROP COLUMN "why_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "why_title";
  ALTER TABLE "site_settings" DROP COLUMN "why_description";
  ALTER TABLE "site_settings" DROP COLUMN "show_recordings_section";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_title";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_description";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_button_label";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_button_href";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_empty_behavior";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_empty_message";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_page_title";
  ALTER TABLE "site_settings" DROP COLUMN "recordings_page_intro";
  ALTER TABLE "site_settings" DROP COLUMN "about_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "about_heading";
  ALTER TABLE "site_settings" DROP COLUMN "about_intro";
  ALTER TABLE "site_settings" DROP COLUMN "teacher_experience_heading";
  ALTER TABLE "site_settings" DROP COLUMN "teacher_experience";
  ALTER TABLE "site_settings" DROP COLUMN "teacher_method_heading";
  ALTER TABLE "site_settings" DROP COLUMN "teacher_method";
  ALTER TABLE "site_settings" DROP COLUMN "about_photo_id";
  ALTER TABLE "site_settings" DROP COLUMN "about_seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_seo_description";
  ALTER TABLE "site_settings" DROP COLUMN "nav_cta_label";
  ALTER TABLE "site_settings" DROP COLUMN "nav_cta_active";
  ALTER TABLE "site_settings" DROP COLUMN "nav_cta_link_type";
  ALTER TABLE "site_settings" DROP COLUMN "nav_cta_internal_path";
  ALTER TABLE "site_settings" DROP COLUMN "nav_cta_external_url";
  ALTER TABLE "site_settings" DROP COLUMN "nav_cta_open_in_new_tab";
  ALTER TABLE "site_settings" DROP COLUMN "footer_note";
  ALTER TABLE "site_settings" DROP COLUMN "downloads_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "downloads_title";
  ALTER TABLE "site_settings" DROP COLUMN "downloads_description";
  ALTER TABLE "site_settings" DROP COLUMN "downloads_empty_message";
  ALTER TABLE "site_settings" DROP COLUMN "downloads_seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "downloads_seo_description";
  DROP TYPE "public"."enum_site_settings_about_buttons_link_type";
  DROP TYPE "public"."enum_site_settings_navigation_link_type";
  DROP TYPE "public"."enum_site_settings_recordings_empty_behavior";
  DROP TYPE "public"."enum_site_settings_nav_cta_link_type";`)
}
