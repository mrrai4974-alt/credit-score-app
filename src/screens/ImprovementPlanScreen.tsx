import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Badge, Card, ProgressBar, withAlpha } from '../components/ui';
import { useCredit } from '../context/CreditContext';
import { colors, spacing, typography } from '../theme';

const EFFORT_COLOR: Record<string, string> = {
  'Quick win': colors.success,
  'This month': colors.warning,
  'Long term': colors.primary,
};

export function ImprovementPlanScreen() {
  const { report } = useCredit();
  const plan = report?.improvementPlan ?? [];

  // Track completion locally so the user can tick steps off.
  const [done, setDone] = useState<Record<string, boolean>>({});

  const { potentialGain, capturedGain } = useMemo(() => {
    let potential = 0;
    let captured = 0;
    for (const step of plan) {
      potential += step.estimatedGain;
      if (done[step.id]) captured += step.estimatedGain;
    }
    return { potentialGain: potential, capturedGain: captured };
  }, [plan, done]);

  const currentScore = report?.score.value ?? 0;
  const projected = Math.min(900, currentScore + (potentialGain - capturedGain));
  const completedCount = plan.filter((s) => done[s.id]).length;

  return (
    <Screen topInset={false}>
      {/* Projection summary */}
      <Card style={styles.summary}>
        <View style={styles.projRow}>
          <View style={styles.projItem}>
            <Text style={styles.projValue}>{currentScore}</Text>
            <Text style={styles.projLabel}>Now</Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color={colors.textMuted} />
          <View style={styles.projItem}>
            <Text style={[styles.projValue, { color: colors.success }]}>{projected}</Text>
            <Text style={styles.projLabel}>Potential</Text>
          </View>
          <View style={styles.projItem}>
            <Text style={[styles.projValue, { color: colors.primary }]}>+{potentialGain}</Text>
            <Text style={styles.projLabel}>Points to gain</Text>
          </View>
        </View>
        <View style={styles.progressWrap}>
          <ProgressBar value={plan.length ? (completedCount / plan.length) * 100 : 0} color={colors.success} />
          <Text style={styles.progressText}>
            {completedCount} of {plan.length} steps done
          </Text>
        </View>
      </Card>

      <Text style={styles.intro}>
        Complete these steps to improve your score. They’re ordered by impact — start at the top.
      </Text>

      {plan.map((step, i) => {
        const isDone = !!done[step.id];
        return (
          <Pressable key={step.id} onPress={() => setDone((p) => ({ ...p, [step.id]: !p[step.id] }))}>
            <Card style={isDone ? styles.doneCard : undefined}>
              <View style={styles.stepHead}>
                <View style={[styles.check, isDone && styles.checkOn]}>
                  {isDone ? (
                    <Ionicons name="checkmark" size={16} color={colors.textInverse} />
                  ) : (
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  )}
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.stepTitle, isDone && styles.struck]}>{step.title}</Text>
                  <View style={styles.metaRow}>
                    <Badge label={step.effort} color={EFFORT_COLOR[step.effort] ?? colors.primary} />
                    <Text style={styles.gain}>+{step.estimatedGain} pts</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.stepDetail}>{step.detail}</Text>
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  summary: { gap: spacing.md },
  projRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  projItem: { alignItems: 'center' },
  projValue: { ...typography.h1, color: colors.textPrimary },
  projLabel: { ...typography.tiny, color: colors.textMuted, marginTop: 2 },
  progressWrap: { gap: spacing.xs },
  progressText: { ...typography.caption, color: colors.textSecondary },
  intro: { ...typography.body, color: colors.textSecondary, lineHeight: 21 },
  doneCard: { opacity: 0.7 },
  stepHead: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.success, borderColor: colors.success },
  stepNum: { ...typography.bodyStrong, color: colors.textSecondary },
  stepTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  struck: { textDecorationLine: 'line-through', color: colors.textMuted },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  gain: { ...typography.caption, color: colors.success, fontWeight: '700' },
  stepDetail: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },
});
