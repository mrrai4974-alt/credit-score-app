import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Badge, Button, Card, IconChip } from '../components/ui';
import { useDisputes } from '../context/DisputeContext';
import type { DisputeStatus } from '../services/bureau/types';
import type { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';
import { formatDate } from '../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_STEPS: DisputeStatus[] = ['Submitted', 'Under Review', 'Resolved'];

const STATUS_COLOR: Record<DisputeStatus, string> = {
  Submitted: colors.primary,
  'Under Review': colors.warning,
  Resolved: colors.success,
  Rejected: colors.danger,
};

export function DisputesScreen() {
  const navigation = useNavigation<Nav>();
  const { disputes } = useDisputes();

  return (
    <Screen topInset={false}>
      <Button
        label="File a new dispute"
        icon="add"
        onPress={() => navigation.navigate('FileDispute')}
      />

      {disputes.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="shield-checkmark-outline" size={40} color={colors.textMuted} />
          <Text style={styles.empty}>No disputes filed. Your report looks clean.</Text>
        </View>
      ) : (
        disputes.map((d) => (
          <Card key={d.id}>
            <View style={styles.head}>
              <IconChip name="document-text" color={STATUS_COLOR[d.status]} />
              <View style={styles.flex}>
                <Text style={styles.title}>{d.subjectLabel}</Text>
                <Text style={styles.sub}>Filed {formatDate(d.filedOn)}</Text>
              </View>
              <Badge label={d.status} color={STATUS_COLOR[d.status]} />
            </View>
            <Text style={styles.reason}>{d.reason}</Text>

            {d.status !== 'Rejected' ? (
              <View style={styles.tracker}>
                {STATUS_STEPS.map((step, i) => {
                  const currentIdx = STATUS_STEPS.indexOf(d.status);
                  const reached = i <= currentIdx;
                  return (
                    <React.Fragment key={step}>
                      <View style={styles.stepCol}>
                        <View style={[styles.stepDot, reached && styles.stepDotOn]}>
                          {reached ? (
                            <Ionicons name="checkmark" size={12} color={colors.textInverse} />
                          ) : null}
                        </View>
                        <Text style={[styles.stepLabel, reached && styles.stepLabelOn]}>{step}</Text>
                      </View>
                      {i < STATUS_STEPS.length - 1 ? (
                        <View style={[styles.stepLine, i < currentIdx && styles.stepLineOn]} />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </View>
            ) : null}
          </Card>
        ))
      )}

      <Text style={styles.note}>
        Bureaus are required to investigate disputes within ~30 days. We’ll notify you at each step.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  emptyBox: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  empty: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { ...typography.bodyStrong, color: colors.textPrimary },
  sub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  reason: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },
  tracker: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  stepCol: { alignItems: 'center', width: 72 },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotOn: { backgroundColor: colors.success, borderColor: colors.success },
  stepLabel: { ...typography.tiny, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
  stepLabelOn: { color: colors.textPrimary, fontWeight: '600' },
  stepLine: { flex: 1, height: 2, backgroundColor: colors.border, marginTop: 10 },
  stepLineOn: { backgroundColor: colors.success },
  note: { ...typography.caption, color: colors.textMuted, textAlign: 'center', lineHeight: 18, marginTop: spacing.sm },
});
