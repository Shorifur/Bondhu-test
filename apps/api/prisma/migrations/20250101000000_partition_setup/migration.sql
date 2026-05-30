-- ================================================================
-- BONDHU — MANUAL PARTITION SETUP MIGRATION
-- PostgreSQL RANGE partitioning by month for high-traffic tables
-- ================================================================

-- NOTE: This migration contains destructive operations.
-- In production, use pg_dump + careful migration window.

-- ================================================================
-- 1. POSTS — RANGE PARTITION BY created_at MONTH
-- ================================================================

ALTER TABLE IF EXISTS posts RENAME TO posts_old;

CREATE TABLE posts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content TEXT,
  content_markdown BOOLEAN NOT NULL DEFAULT false,
  location_name VARCHAR(255),
  district_id INTEGER,
  sub_district_id INTEGER,
  geo_location_lat FLOAT,
  geo_location_lng FLOAT,
  visibility visibilityscope NOT NULL DEFAULT 'PUBLIC',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  edited_at TIMESTAMPTZ,
  edit_deadline TIMESTAMPTZ,
  comment_count INTEGER NOT NULL DEFAULT 0,
  reaction_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  bookmark_count INTEGER NOT NULL DEFAULT 0,
  score DECIMAL(12,6) NOT NULL DEFAULT 0,
  language_script languagescript,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

SELECT create_monthly_partition('posts', CURRENT_DATE);
SELECT create_monthly_partition('posts', CURRENT_DATE + INTERVAL '1 month');
SELECT create_monthly_partition('posts', CURRENT_DATE + INTERVAL '2 months');

CREATE INDEX idx_posts_user_created ON posts (user_id, created_at);
CREATE INDEX idx_posts_district_created ON posts (district_id, created_at);
CREATE INDEX idx_posts_subdistrict_created ON posts (sub_district_id, created_at);
CREATE INDEX idx_posts_score ON posts (score DESC);

CREATE INDEX idx_posts_visibility ON posts (visibility, is_archived, created_at DESC);

INSERT INTO posts (
  id, user_id, content, content_markdown, location_name, district_id,
  sub_district_id, visibility, is_pinned, is_archived,
  is_edited, edited_at, edit_deadline, comment_count, reaction_count,
  share_count, bookmark_count, score, language_script, created_at, updated_at
)
SELECT
  id, user_id, content, content_markdown, location_name, district_id,
  sub_district_id, visibility, is_pinned, is_archived,
  is_edited, edited_at, edit_deadline, comment_count, reaction_count,
  share_count, bookmark_count, score, language_script, created_at, updated_at
FROM posts_old
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS posts_old;

-- ================================================================
-- 2. COMMENTS — RANGE PARTITION BY created_at MONTH
-- ================================================================

ALTER TABLE IF EXISTS comments RENAME TO comments_old;

CREATE TABLE comments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  parent_id UUID,
  content TEXT NOT NULL,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  edited_at TIMESTAMPTZ,
  reaction_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  depth INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

SELECT create_monthly_partition('comments', CURRENT_DATE);
SELECT create_monthly_partition('comments', CURRENT_DATE + INTERVAL '1 month');
SELECT create_monthly_partition('comments', CURRENT_DATE + INTERVAL '2 months');

CREATE INDEX idx_comments_post_created ON comments (post_id, created_at);
CREATE INDEX idx_comments_parent ON comments (parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_comments_user ON comments (user_id);
CREATE INDEX idx_comments_depth ON comments (depth);

INSERT INTO comments (
  id, post_id, user_id, parent_id, content, is_edited, edited_at,
  reaction_count, reply_count, depth, created_at, updated_at
)
SELECT 
  id, post_id, user_id, parent_id, content, is_edited, edited_at,
  reaction_count, reply_count, depth, created_at, updated_at
FROM comments_old
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS comments_old;

-- ================================================================
-- 3. DIRECT_MESSAGES — RANGE PARTITION BY created_at MONTH
-- ================================================================

ALTER TABLE IF EXISTS direct_messages RENAME TO direct_messages_old;

CREATE TABLE direct_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  receiver_id UUID,
  type messagetype NOT NULL DEFAULT 'TEXT',
  content TEXT,
  media_url VARCHAR(500),
  media_key VARCHAR(500),
  voice_duration INTEGER,
  voice_playback_speed DECIMAL(3,1) DEFAULT 1.0,
  reply_to_id UUID,
  forwarded_from_id UUID,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

SELECT create_monthly_partition('direct_messages', CURRENT_DATE);
SELECT create_monthly_partition('direct_messages', CURRENT_DATE + INTERVAL '1 month');
SELECT create_monthly_partition('direct_messages', CURRENT_DATE + INTERVAL '2 months');

CREATE INDEX idx_dm_conversation_created ON direct_messages (conversation_id, created_at);
CREATE INDEX idx_dm_sender ON direct_messages (sender_id);
CREATE INDEX idx_dm_receiver ON direct_messages (receiver_id);

INSERT INTO direct_messages (
  id, conversation_id, sender_id, receiver_id, type, content,
  media_url, media_key, voice_duration, voice_playback_speed,
  reply_to_id, forwarded_from_id, is_deleted, deleted_at,
  is_read, read_at, created_at, updated_at
)
SELECT 
  id, conversation_id, sender_id, receiver_id, type, content,
  media_url, media_key, voice_duration, voice_playback_speed,
  reply_to_id, forwarded_from_id, is_deleted, deleted_at,
  is_read, read_at, created_at, updated_at
FROM direct_messages_old
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS direct_messages_old;

-- ================================================================
-- 4. POST_INTERACTIONS — RANGE PARTITION BY created_at MONTH
-- ================================================================

ALTER TABLE IF EXISTS post_interactions RENAME TO post_interactions_old;

CREATE TABLE post_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  type reactiontype NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

SELECT create_monthly_partition('post_interactions', CURRENT_DATE);
SELECT create_monthly_partition('post_interactions', CURRENT_DATE + INTERVAL '1 month');
SELECT create_monthly_partition('post_interactions', CURRENT_DATE + INTERVAL '2 months');

CREATE UNIQUE INDEX idx_interactions_unique ON post_interactions (post_id, user_id, type);
CREATE INDEX idx_interactions_post_type ON post_interactions (post_id, type);
CREATE INDEX idx_interactions_user ON post_interactions (user_id);

INSERT INTO post_interactions (id, post_id, user_id, type, created_at)
SELECT id, post_id, user_id, type, created_at
FROM post_interactions_old
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS post_interactions_old;

-- ================================================================
-- 5. STORY_VIEWS — RANGE PARTITION BY created_at MONTH
-- ================================================================

ALTER TABLE IF EXISTS story_views RENAME TO story_views_old;

CREATE TABLE story_views (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL,
  viewer_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

SELECT create_monthly_partition('story_views', CURRENT_DATE);
SELECT create_monthly_partition('story_views', CURRENT_DATE + INTERVAL '1 month');

CREATE UNIQUE INDEX idx_storyviews_unique ON story_views (story_id, viewer_id);
CREATE INDEX idx_storyviews_story ON story_views (story_id);
CREATE INDEX idx_storyviews_viewer ON story_views (viewer_id);

INSERT INTO story_views (id, story_id, viewer_id, created_at)
SELECT id, story_id, viewer_id, created_at
FROM story_views_old
ON CONFLICT DO NOTHING;

DROP TABLE IF EXISTS story_views_old;
