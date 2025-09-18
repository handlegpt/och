import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface UsageLimit {
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
  canGenerate: boolean;
}

interface SubscriptionPlan {
  name: string;
  price_monthly: number;
  price_yearly: number;
  daily_limit: number;
  features: string[];
}

export const useUsageLimit = () => {
  const { user, loading: authLoading } = useAuth();
  const [usageLimit, setUsageLimit] = useState<UsageLimit>({
    dailyLimit: 0,
    usedToday: 0,
    remainingToday: 0,
    canGenerate: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      if (authLoading) return;
      setLoading(true);

      if (!user) {
        // 未登录用户使用默认限制
        setUsageLimit({
          dailyLimit: 10, // 免费用户每日限制
          usedToday: 0,
          remainingToday: 10,
          canGenerate: true,
        });
        setLoading(false);
        return;
      }

      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // 调用数据库函数检查使用限制
        const { data, error } = await supabase.rpc('check_user_usage_limit', {
          user_uuid: user.id
        });

        if (error) {
          console.error('Error checking usage limit:', error);
          // 使用默认限制
          setUsageLimit({
            dailyLimit: 10,
            usedToday: 0,
            remainingToday: 10,
            canGenerate: true,
          });
        } else {
          setUsageLimit({
            dailyLimit: data.daily_limit,
            usedToday: data.used_today,
            remainingToday: data.remaining,
            canGenerate: data.can_generate,
          });
        }
      } catch (error) {
        console.error('Error fetching usage limit:', error);
        setUsageLimit({
          dailyLimit: 10,
          usedToday: 0,
          remainingToday: 10,
          canGenerate: true,
        });
      }

      setLoading(false);
    };

    fetchUsage();
  }, [user, authLoading]);

  const recordUsage = async (actionType: 'image_generation' | 'video_generation', tokensUsed: number = 1, cost: number = 0) => {
    if (!user || !supabase) return;

    try {
      // 插入生成记录
      const { error: generationError } = await supabase
        .from('ai_generations')
        .insert({
          user_id: user.id,
          transformation_type: actionType,
          tokens_used: tokensUsed,
        });

      if (generationError) {
        console.error('Error recording generation:', generationError);
      }

      // 更新今日使用统计
      const { error: statsError } = await supabase
        .from('usage_stats')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          generations_count: 1,
          tokens_used: tokensUsed,
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });

      if (statsError) {
        console.error('Error updating usage stats:', statsError);
      }

      // 更新本地状态
      setUsageLimit(prev => ({
        ...prev,
        usedToday: prev.usedToday + 1,
        remainingToday: Math.max(0, prev.remainingToday - 1),
        canGenerate: prev.remainingToday > 1,
      }));

    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  const getCurrentPlan = (): SubscriptionPlan => {
    // 这里可以根据用户的实际订阅状态返回计划信息
    // 暂时返回免费计划
    return {
      name: 'free',
      price_monthly: 0,
      price_yearly: 0,
      daily_limit: 10,
      features: ['基础 AI 生成', '标准质量', '社区支持']
    };
  };

  return { usageLimit, loading, recordUsage, getCurrentPlan };
};