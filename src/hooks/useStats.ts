import { useMemo } from 'react';
import { CoffeeEntry } from '../types';

export const useStats = (entries: CoffeeEntry[]) => {
  const stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        weeklyCount: 0,
        favoriteBean: '未記録',
        averageRating: 0,
        recentTrend: 'まだデータがありません',
      };
    }

    // 今週の記録数
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEntries = entries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );

    // お気に入り豆ランキング
    const beanCount = entries.reduce((acc, entry) => {
      acc[entry.beanType] = (acc[entry.beanType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteBean = Object.entries(beanCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '未記録';

    // 平均評価（酸味、甘み、苦味の平均）
    const averageRating = entries.length > 0 
      ? entries.reduce((sum, entry) => {
          return sum + (entry.taste.acidity + entry.taste.sweetness + entry.taste.bitterness) / 3;
        }, 0) / entries.length
      : 0;

    // 最近の傾向
    const recentEntries = entries.slice(0, 3);
    const recentTrend = recentEntries.length > 0
      ? `最近は${recentEntries[0].beanType}がお気に入り`
      : 'まだデータがありません';

    return {
      totalEntries: entries.length,
      weeklyCount: weeklyEntries.length,
      favoriteBean,
      averageRating: Math.round(averageRating * 10) / 10,
      recentTrend,
    };
  }, [entries]);

  return stats;
};