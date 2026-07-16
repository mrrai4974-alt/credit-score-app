import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Card, IconChip, withAlpha } from '../components/ui';
import { NOTIFICATIONS } from '../services/appData';
import type { AppNotification, NotificationKind } from '../services/bureau/types';
import { colors, spacing, typography } from '../theme';
import { timeAgo } from '../utils/format';

const KIND_META: Record<
  NotificationKind,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  score: { icon: 'trending-up', color: colors.success },
  payment: { icon: 'cash', color: colors.danger },
  offer: { icon: 'pricetag', color: colors.primary },
  enquiry: { icon: 'search', color: colors.warning },
  dispute: { icon: 'shield-checkmark', color: '#8B5CF6' },
};

export function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>(NOTIFICATIONS);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <Screen topInset={false}>
      {items.some((n) => !n.read) ? (
        <Text style={styles.markAll} onPress={markAllRead}>
          Mark all as read
        </Text>
      ) : null}
      {items.map((n) => {
        const meta = KIND_META[n.kind];
        return (
          <Card key={n.id} style={!n.read ? styles.unread : undefined}>
            <View style={styles.row}>
              <IconChip name={meta.icon} color={meta.color} />
              <View style={styles.flex}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{n.title}</Text>
                  {!n.read ? <View style={styles.dot} /> : null}
                </View>
                <Text style={styles.body}>{n.body}</Text>
                <Text style={styles.time}>{timeAgo(n.date)}</Text>
              </View>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  markAll: { ...typography.bodyStrong, color: colors.primary, alignSelf: 'flex-end' },
  unread: { borderWidth: 1, borderColor: withAlpha(colors.primary, 0.25) },
  row: { flexDirection: 'row', gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  body: { ...typography.caption, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  time: { ...typography.tiny, color: colors.textMuted, marginTop: spacing.xs },
});
