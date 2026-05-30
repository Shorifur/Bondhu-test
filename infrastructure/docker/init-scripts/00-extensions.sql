-- ================================================================
-- BONDHU DATABASE INITIALIZATION
-- PostGIS + Extensions + Partition Setup
-- ================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create custom unaccent text search configuration for Bangla + English
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'bondhu_search') THEN
    CREATE TEXT SEARCH CONFIGURATION bondhu_search (COPY = english);
  END IF;
END $$;

-- ================================================================
-- PARTITION HELPER FUNCTIONS
-- ================================================================

CREATE OR REPLACE FUNCTION create_monthly_partition(
  p_parent_table text,
  p_partition_date date
) RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  partition_name text;
  start_date date;
  end_date date;
BEGIN
  partition_name := p_parent_table || '_p' || to_char(p_partition_date, 'YYYY_MM');
  start_date := date_trunc('month', p_partition_date);
  end_date := start_date + interval '1 month';

  IF NOT EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE n.nspname = 'public' AND c.relname = partition_name
  ) THEN
    EXECUTE format(
      'CREATE TABLE %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
      partition_name, p_parent_table, start_date, end_date
    );
    EXECUTE format(
      'CREATE INDEX IF NOT EXISTS %I ON %I (created_at)',
      partition_name || '_created_at_idx', partition_name
    );
  END IF;
  RETURN partition_name;
END;
$$;

CREATE OR REPLACE FUNCTION create_district_partition(
  p_parent_table text,
  p_district_id integer
) RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  partition_name text;
BEGIN
  partition_name := p_parent_table || '_d' || p_district_id::text;

  IF NOT EXISTS (
    SELECT 1 FROM pg_class c 
    JOIN pg_namespace n ON n.oid = c.relnamespace 
    WHERE n.nspname = 'public' AND c.relname = partition_name
  ) THEN
    EXECUTE format(
      'CREATE TABLE %I PARTITION OF %I FOR VALUES IN (%s)',
      partition_name, p_parent_table, p_district_id
    );
  END IF;
  RETURN partition_name;
END;
$$;

-- ================================================================
-- AUTO-PARTITION MAINTENANCE (runs via pg_cron in production)
-- ================================================================

CREATE OR REPLACE FUNCTION maintain_monthly_partitions()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  tables text[] := ARRAY['posts', 'direct_messages', 'comments', 'post_interactions', 'story_views'];
  t text;
  i integer;
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    FOR i IN 0..2 LOOP
      PERFORM create_monthly_partition(t, CURRENT_DATE + (i || ' months')::interval);
    END LOOP;
  END LOOP;
END;
$$;
