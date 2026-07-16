import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

/**
 * Standard scrollable screen container: applies the safe-area top inset,
 * the app background, consistent horizontal padding and optional
 * pull-to-refresh. Every tab screen renders inside one of these.
 */
export function Screen({
  children,
  refreshing,
  onRefresh,
  contentStyle,
  scroll = true,
  topInset = true,
}: {
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
  /** Set false when a navigation header already handles the top inset. */
  topInset?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const padding = { paddingTop: (topInset ? insets.top : 0) + spacing.md };

  if (!scroll) {
    return <View style={[styles.container, padding]}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[padding, styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
});
