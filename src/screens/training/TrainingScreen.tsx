import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, Row } from '../../components/ui';
import { trainingModules } from '../../data/mockData';
import { colors, font, radius, spacing } from '../../theme/theme';

/** Training / certification module access and renewal reminders — FR-24. */
export const TrainingScreen: React.FC = () => {
  const certified = trainingModules.filter((m) => m.certified).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training</Text>
        <Text style={styles.headerSub}>
          {certified} of {trainingModules.length} certifications active
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {trainingModules.map((m) => (
          <Card key={m.id} style={styles.card}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={styles.title}>{m.title}</Text>
              {m.certified ? (
                <Badge label="Certified" tone="success" />
              ) : (
                <Badge label={`${m.progress}%`} tone="warning" />
              )}
            </Row>
            <Text style={styles.desc}>{m.description}</Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${m.progress}%`,
                    backgroundColor: m.certified ? colors.success : colors.primary,
                  },
                ]}
              />
            </View>

            <Row style={{ justifyContent: 'space-between', marginTop: spacing.md }}>
              <Text style={styles.meta}>
                ⏱ {m.durationMin} min
                {m.expiresOn ? `  ·  Renew by ${m.expiresOn}` : ''}
              </Text>
            </Row>

            <Button
              title={
                m.certified
                  ? 'Review module'
                  : m.progress > 0
                  ? 'Continue'
                  : 'Start module'
              }
              variant={m.certified ? 'outline' : 'primary'}
              onPress={() => {}}
              style={{ marginTop: spacing.md }}
              full
            />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerTitle: { fontSize: font.h1, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: font.body, color: colors.textMuted, marginTop: 2 },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  card: { marginBottom: spacing.lg },
  title: { fontSize: font.h3, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.sm },
  desc: { fontSize: font.small, color: colors.textMuted, marginTop: 6, lineHeight: 19 },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: radius.pill },
  meta: { fontSize: font.small, color: colors.textMuted },
});
