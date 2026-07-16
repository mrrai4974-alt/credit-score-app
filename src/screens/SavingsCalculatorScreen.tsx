import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Card, withAlpha } from '../components/ui';
import { useCredit } from '../context/CreditContext';
import { bandForScore, colors, radius, spacing, typography } from '../theme';
import { formatRupees } from '../utils/format';

/**
 * FR-16: shows how much interest a better score could save on a loan. We map a
 * score to an indicative interest rate (better score -> lower rate) and compute
 * the total interest via the standard EMI formula for both the current and an
 * improved score.
 */

const AMOUNTS = [500000, 1000000, 2500000, 5000000];
const TENURES = [12, 36, 60, 120];

/** Indicative annual interest rate (%) for a given score band. */
function rateForScore(score: number): number {
  if (score >= 800) return 8.4;
  if (score >= 750) return 9.2;
  if (score >= 700) return 10.5;
  if (score >= 650) return 12.5;
  if (score >= 600) return 15;
  return 18;
}

/** Total interest paid over the loan using the reducing-balance EMI formula. */
function totalInterest(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 12 / 100;
  if (r === 0) return 0;
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return emi * months - principal;
}

export function SavingsCalculatorScreen() {
  const { report } = useCredit();
  const currentScore = report?.score.value ?? 700;
  const improvedScore = Math.min(850, currentScore + 60);

  const [amount, setAmount] = useState(AMOUNTS[1]);
  const [tenure, setTenure] = useState(TENURES[2]);

  const result = useMemo(() => {
    const currentRate = rateForScore(currentScore);
    const improvedRate = rateForScore(improvedScore);
    const currentInterest = totalInterest(amount, currentRate, tenure);
    const improvedInterest = totalInterest(amount, improvedRate, tenure);
    return {
      currentRate,
      improvedRate,
      currentInterest,
      improvedInterest,
      savings: Math.max(0, currentInterest - improvedInterest),
    };
  }, [amount, tenure, currentScore, improvedScore]);

  return (
    <Screen topInset={false}>
      <Text style={styles.intro}>
        See how much interest you could save on a loan by improving your score.
      </Text>

      <Text style={styles.label}>Loan amount</Text>
      <Chips
        options={AMOUNTS}
        value={amount}
        onChange={setAmount}
        render={(v) => formatRupees(v)}
      />

      <Text style={styles.label}>Tenure</Text>
      <Chips
        options={TENURES}
        value={tenure}
        onChange={setTenure}
        render={(v) => `${v} mo`}
      />

      {/* Savings highlight */}
      <Card style={styles.savingsCard}>
        <Text style={styles.savingsLabel}>You could save</Text>
        <Text style={styles.savingsValue}>{formatRupees(result.savings)}</Text>
        <Text style={styles.savingsSub}>in interest over the life of this loan</Text>
      </Card>

      {/* Comparison */}
      <View style={styles.compare}>
        <ScoreColumn
          heading="At your score"
          score={currentScore}
          rate={result.currentRate}
          interest={result.currentInterest}
          highlight={false}
        />
        <ScoreColumn
          heading="At a better score"
          score={improvedScore}
          rate={result.improvedRate}
          interest={result.improvedInterest}
          highlight
        />
      </View>

      <Text style={styles.note}>
        Rates shown are indicative and vary by lender. Improving your score can unlock materially
        lower interest — the difference compounds over the full tenure.
      </Text>
    </Screen>
  );
}

function Chips<T extends number>({
  options,
  value,
  onChange,
  render,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  render: (v: T) => string;
}) {
  return (
    <View style={styles.chips}>
      {options.map((o) => {
        const selected = o === value;
        return (
          <Pressable
            key={o}
            style={[styles.chip, selected && styles.chipOn]}
            onPress={() => onChange(o)}
          >
            <Text style={[styles.chipText, selected && styles.chipTextOn]}>{render(o)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ScoreColumn({
  heading,
  score,
  rate,
  interest,
  highlight,
}: {
  heading: string;
  score: number;
  rate: number;
  interest: number;
  highlight: boolean;
}) {
  const band = bandForScore(score);
  return (
    <View style={[styles.column, highlight && styles.columnOn]}>
      <Text style={styles.colHeading}>{heading}</Text>
      <Text style={[styles.colScore, { color: band.color }]}>{score}</Text>
      <Text style={styles.colRate}>{rate}% p.a.</Text>
      <View style={styles.colDivider} />
      <Text style={styles.colInterestLabel}>Total interest</Text>
      <Text style={styles.colInterest}>{formatRupees(interest)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.textSecondary, lineHeight: 21 },
  label: { ...typography.bodyStrong, color: colors.textPrimary, marginTop: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: withAlpha(colors.primary, 0.08) },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextOn: { color: colors.primary, fontWeight: '700' },
  savingsCard: { alignItems: 'center', backgroundColor: colors.primary, marginTop: spacing.sm },
  savingsLabel: { ...typography.caption, color: colors.textInverse, opacity: 0.9 },
  savingsValue: { ...typography.display, fontSize: 34, color: colors.textInverse, marginVertical: 2 },
  savingsSub: { ...typography.caption, color: colors.textInverse, opacity: 0.9 },
  compare: { flexDirection: 'row', gap: spacing.md },
  column: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  columnOn: { borderColor: colors.success },
  colHeading: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  colScore: { ...typography.h1, marginTop: spacing.xs },
  colRate: { ...typography.bodyStrong, color: colors.textPrimary },
  colDivider: { height: 1, backgroundColor: colors.border, alignSelf: 'stretch', marginVertical: spacing.sm },
  colInterestLabel: { ...typography.tiny, color: colors.textMuted },
  colInterest: { ...typography.h3, color: colors.textPrimary, marginTop: 2 },
  note: { ...typography.caption, color: colors.textMuted, lineHeight: 18 },
});
