import { supabase } from '../lib/supabase';
import type { GeneratedContent } from '../types';

export interface GenerationRecord {
  id?: string;
  user_id: string;
  transformation_type: string;
  input_image_url: string | null;
  output_image_url: string | null;
  prompt: string | null;
  custom_prompt: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tokens_used: number;
  processing_time_ms: number | null;
  created_at?: string;
}

export interface UserSettings {
  display_name?: string;
  username?: string;
  avatar_url?: string;
  language?: string;
  theme?: string;
  notifications?: boolean;
}

export class DataPersistenceService {
  /**
   * 保存 AI 生成记录到数据库
   */
  static async saveGenerationRecord(
    userId: string,
    transformationType: string,
    inputImageUrl: string | null,
    outputImageUrl: string | null,
    prompt: string | null,
    customPrompt: string | null,
    tokensUsed: number = 1,
    processingTimeMs: number | null = null,
    status: 'pending' | 'processing' | 'completed' | 'failed' = 'completed'
  ): Promise<GenerationRecord | null> {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }

    try {
      const record: Omit<GenerationRecord, 'id' | 'created_at'> = {
        user_id: userId,
        transformation_type: transformationType,
        input_image_url: inputImageUrl,
        output_image_url: outputImageUrl,
        prompt: prompt,
        custom_prompt: customPrompt,
        status: status,
        tokens_used: tokensUsed,
        processing_time_ms: processingTimeMs,
      };

      const { data, error } = await supabase
        .from('ai_generations')
        .insert(record)
        .select()
        .single();

      if (error) {
        console.error('Error saving generation record:', error);
        return null;
      }

      // 更新使用统计
      await this.updateUsageStats(userId, tokensUsed);

      return data;
    } catch (error) {
      console.error('Error in saveGenerationRecord:', error);
      return null;
    }
  }

  /**
   * 更新用户使用统计
   */
  static async updateUsageStats(userId: string, tokensUsed: number = 1): Promise<void> {
    if (!supabase) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      // 首先尝试获取现有记录
      const { data: existingStats } = await supabase
        .from('usage_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (existingStats) {
        // 更新现有记录
        const { error } = await supabase
          .from('usage_stats')
          .update({
            generations_count: existingStats.generations_count + 1,
            tokens_used: existingStats.tokens_used + tokensUsed,
          })
          .eq('user_id', userId)
          .eq('date', today);
        
        if (error) {
          console.error('Error updating usage stats:', error);
        }
      } else {
        // 插入新记录
        const { error } = await supabase
          .from('usage_stats')
          .insert({
            user_id: userId,
            date: today,
            generations_count: 1,
            tokens_used: tokensUsed,
          });
        
        if (error) {
          console.error('Error inserting usage stats:', error);
        }
      }
    } catch (error) {
      console.error('Error in updateUsageStats:', error);
    }
  }

  /**
   * 获取用户的生成历史记录
   */
  static async getUserGenerationHistory(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<GenerationRecord[]> {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('ai_generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching generation history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserGenerationHistory:', error);
      return [];
    }
  }

  /**
   * 保存用户设置
   */
  static async saveUserSettings(userId: string, settings: UserSettings): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    try {
      // 更新用户配置表
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          display_name: settings.display_name,
          username: settings.username,
          avatar_url: settings.avatar_url,
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Error saving user profile:', profileError);
        return false;
      }

      // 保存本地设置到 localStorage
      if (settings.language) {
        localStorage.setItem('language', settings.language);
      }
      if (settings.theme) {
        localStorage.setItem('theme', settings.theme);
      }
      if (settings.notifications !== undefined) {
        localStorage.setItem('notifications', settings.notifications.toString());
      }

      return true;
    } catch (error) {
      console.error('Error in saveUserSettings:', error);
      return false;
    }
  }

  /**
   * 获取用户设置
   */
  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user settings:', error);
        return null;
      }

      // 合并数据库设置和本地设置
      const settings: UserSettings = {
        display_name: data.display_name,
        username: data.username,
        avatar_url: data.avatar_url,
        language: localStorage.getItem('language') || 'zh',
        theme: localStorage.getItem('theme') || 'dark',
        notifications: localStorage.getItem('notifications') !== 'false',
      };

      return settings;
    } catch (error) {
      console.error('Error in getUserSettings:', error);
      return null;
    }
  }

  /**
   * 获取用户使用统计
   */
  static async getUserUsageStats(userId: string): Promise<{
    totalGenerations: number;
    thisMonthGenerations: number;
    thisWeekGenerations: number;
    todayGenerations: number;
  }> {
    if (!supabase) {
      return {
        totalGenerations: 0,
        thisMonthGenerations: 0,
        thisWeekGenerations: 0,
        todayGenerations: 0,
      };
    }

    try {
      // 获取总生成次数
      const { count: totalGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // 获取本月生成次数
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);
      
      const { count: thisMonthGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', thisMonth.toISOString());

      // 获取本周生成次数
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
      thisWeek.setHours(0, 0, 0, 0);
      
      const { count: thisWeekGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', thisWeek.toISOString());

      // 获取今日生成次数
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: todayGenerations } = await supabase
        .from('ai_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', today.toISOString());

      return {
        totalGenerations: totalGenerations || 0,
        thisMonthGenerations: thisMonthGenerations || 0,
        thisWeekGenerations: thisWeekGenerations || 0,
        todayGenerations: todayGenerations || 0,
      };
    } catch (error) {
      console.error('Error in getUserUsageStats:', error);
      return {
        totalGenerations: 0,
        thisMonthGenerations: 0,
        thisWeekGenerations: 0,
        todayGenerations: 0,
      };
    }
  }

  /**
   * 删除生成记录
   */
  static async deleteGenerationRecord(recordId: string, userId: string): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    try {
      const { error } = await supabase
        .from('ai_generations')
        .delete()
        .eq('id', recordId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting generation record:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteGenerationRecord:', error);
      return false;
    }
  }
}
