-- Och AI 社交功能数据库扩展
-- 在 Supabase Dashboard 的 SQL Editor 中运行此脚本

-- 1. 作品展示表 (public_gallery)
CREATE TABLE IF NOT EXISTS public_gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_id UUID REFERENCES generation_history(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  transformation_type VARCHAR(50) NOT NULL,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 点赞表 (gallery_likes)
CREATE TABLE IF NOT EXISTS gallery_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES public_gallery(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, gallery_id)
);

-- 3. 评论表 (gallery_comments)
CREATE TABLE IF NOT EXISTS gallery_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES public_gallery(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES gallery_comments(id) ON DELETE CASCADE, -- 支持回复
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 分享记录表 (gallery_shares)
CREATE TABLE IF NOT EXISTS gallery_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES public_gallery(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'twitter', 'facebook', 'instagram', 'copy_link'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 用户关注表 (user_follows)
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 6. 作品集表 (user_collections)
CREATE TABLE IF NOT EXISTS user_collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  cover_image_url TEXT,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 作品集内容表 (collection_items)
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  collection_id UUID REFERENCES user_collections(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES public_gallery(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, gallery_id)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_public_gallery_user_id ON public_gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_public_gallery_created_at ON public_gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_gallery_like_count ON public_gallery(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_likes_user_id ON gallery_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_gallery_likes_gallery_id ON gallery_likes(gallery_id);
CREATE INDEX IF NOT EXISTS idx_gallery_comments_gallery_id ON gallery_comments(gallery_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id ON user_follows(following_id);

-- 创建 RLS 策略
ALTER TABLE public_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- 公开作品展示策略
CREATE POLICY "Anyone can view public gallery" ON public_gallery
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own gallery" ON public_gallery
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gallery" ON public_gallery
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gallery" ON public_gallery
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gallery" ON public_gallery
  FOR DELETE USING (auth.uid() = user_id);

-- 点赞策略
CREATE POLICY "Anyone can view likes" ON gallery_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON gallery_likes
  FOR ALL USING (auth.uid() = user_id);

-- 评论策略
CREATE POLICY "Anyone can view comments" ON gallery_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON gallery_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON gallery_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON gallery_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 关注策略
CREATE POLICY "Anyone can view follows" ON user_follows
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON user_follows
  FOR ALL USING (auth.uid() = follower_id);

-- 作品集策略
CREATE POLICY "Anyone can view public collections" ON user_collections
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own collections" ON user_collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own collections" ON user_collections
  FOR ALL USING (auth.uid() = user_id);

-- 作品集内容策略
CREATE POLICY "Anyone can view collection items" ON collection_items
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own collection items" ON collection_items
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM user_collections WHERE id = collection_id)
  );

-- 创建触发器：自动更新统计
CREATE OR REPLACE FUNCTION update_gallery_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- 更新点赞数
    IF TG_TABLE_NAME = 'gallery_likes' THEN
      UPDATE public_gallery 
      SET like_count = like_count + 1 
      WHERE id = NEW.gallery_id;
    END IF;
    
    -- 更新评论数
    IF TG_TABLE_NAME = 'gallery_comments' THEN
      UPDATE public_gallery 
      SET comment_count = comment_count + 1 
      WHERE id = NEW.gallery_id;
    END IF;
    
    -- 更新分享数
    IF TG_TABLE_NAME = 'gallery_shares' THEN
      UPDATE public_gallery 
      SET share_count = share_count + 1 
      WHERE id = NEW.gallery_id;
    END IF;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- 更新点赞数
    IF TG_TABLE_NAME = 'gallery_likes' THEN
      UPDATE public_gallery 
      SET like_count = GREATEST(0, like_count - 1) 
      WHERE id = OLD.gallery_id;
    END IF;
    
    -- 更新评论数
    IF TG_TABLE_NAME = 'gallery_comments' THEN
      UPDATE public_gallery 
      SET comment_count = GREATEST(0, comment_count - 1) 
      WHERE id = OLD.gallery_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_gallery_stats_likes ON gallery_likes;
CREATE TRIGGER trigger_update_gallery_stats_likes
  AFTER INSERT OR DELETE ON gallery_likes
  FOR EACH ROW EXECUTE FUNCTION update_gallery_stats();

DROP TRIGGER IF EXISTS trigger_update_gallery_stats_comments ON gallery_comments;
CREATE TRIGGER trigger_update_gallery_stats_comments
  AFTER INSERT OR DELETE ON gallery_comments
  FOR EACH ROW EXECUTE FUNCTION update_gallery_stats();

DROP TRIGGER IF EXISTS trigger_update_gallery_stats_shares ON gallery_shares;
CREATE TRIGGER trigger_update_gallery_stats_shares
  AFTER INSERT ON gallery_shares
  FOR EACH ROW EXECUTE FUNCTION update_gallery_stats();

-- 创建函数：获取用户作品
CREATE OR REPLACE FUNCTION get_user_gallery(
  target_user_id UUID,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  title VARCHAR(255),
  description TEXT,
  image_url TEXT,
  transformation_type VARCHAR(50),
  view_count INTEGER,
  like_count INTEGER,
  comment_count INTEGER,
  share_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  user_liked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pg.id,
    pg.title,
    pg.description,
    pg.image_url,
    pg.transformation_type,
    pg.view_count,
    pg.like_count,
    pg.comment_count,
    pg.share_count,
    pg.created_at,
    CASE 
      WHEN auth.uid() IS NOT NULL THEN 
        EXISTS(SELECT 1 FROM gallery_likes gl WHERE gl.gallery_id = pg.id AND gl.user_id = auth.uid())
      ELSE false
    END as user_liked
  FROM public_gallery pg
  WHERE pg.user_id = target_user_id 
    AND pg.is_public = true
  ORDER BY pg.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数：获取热门作品
CREATE OR REPLACE FUNCTION get_trending_gallery(
  limit_count INTEGER DEFAULT 20,
  days_back INTEGER DEFAULT 7
)
RETURNS TABLE(
  id UUID,
  title VARCHAR(255),
  description TEXT,
  image_url TEXT,
  transformation_type VARCHAR(50),
  view_count INTEGER,
  like_count INTEGER,
  comment_count INTEGER,
  share_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  user_liked BOOLEAN,
  user_info JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pg.id,
    pg.title,
    pg.description,
    pg.image_url,
    pg.transformation_type,
    pg.view_count,
    pg.like_count,
    pg.comment_count,
    pg.share_count,
    pg.created_at,
    CASE 
      WHEN auth.uid() IS NOT NULL THEN 
        EXISTS(SELECT 1 FROM gallery_likes gl WHERE gl.gallery_id = pg.id AND gl.user_id = auth.uid())
      ELSE false
    END as user_liked,
    jsonb_build_object(
      'id', up.id,
      'username', up.username,
      'display_name', up.display_name,
      'avatar_url', up.avatar_url
    ) as user_info
  FROM public_gallery pg
  JOIN user_profiles up ON pg.user_id = up.id
  WHERE pg.is_public = true 
    AND pg.created_at >= NOW() - INTERVAL '1 day' * days_back
  ORDER BY (pg.like_count + pg.comment_count + pg.share_count) DESC, pg.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
