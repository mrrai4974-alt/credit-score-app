import React, { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Badge,
  Button,
  Card,
  Divider,
  KeyValue,
  Row,
  SectionTitle,
} from '../../components/ui';
import { JobStatusPill } from '../../components/JobStatusPill';
import { useApp } from '../../context/AppContext';
import { commonExtraIssues } from '../../data/mockData';
import { JobStatus } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';
import { gstAmount, inr, withGst } from '../../utils/format';

export const JobDetailScreen: React.FC<{
  jobId: string;
  onBack: () => void;
}> = ({ jobId, onBack }) => {
  const {
    jobs,
    advanceStatus,
    toggleChecklistItem,
    addIssue,
    removeIssue,
    requestApproval,
    simulateCustomerDecision,
    setPhoto,
    confirmCompletion,
  } = useApp();

  const job = jobs.find((j) => j.id === jobId);
  const [issueTitle, setIssueTitle] = useState('');
  const [issuePrice, setIssuePrice] = useState('');

  const checklistDone = useMemo(
    () => (job ? job.checklist.filter((c) => c.done).length : 0),
    [job],
  );

  if (!job) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Job not found.</Text>
        <Button title="Back" onPress={onBack} />
      </SafeAreaView>
    );
  }

  const approvedExtras = job.additionalIssues
    .filter((i) => i.approved === 'approved')
    .reduce((s, i) => s + i.price, 0);
  const pendingExtras = job.additionalIssues.filter(
    (i) => i.approved === 'pending',
  );
  const grandTotal = withGst(job.basePrice + approvedExtras);

  const checklistComplete = checklistDone === job.checklist.length;
  const canComplete =
    job.status === 'in_progress' &&
    checklistComplete &&
    job.beforePhotoTaken &&
    job.afterPhotoTaken &&
    pendingExtras.length === 0;

  const openMaps = () => {
    const q = encodeURIComponent(job.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(
      () => Alert.alert('Maps', 'Could not open the maps app.'),
    );
  };

  const nextStatusButton = () => {
    const flow: { from: JobStatus; to: JobStatus; label: string }[] = [
      { from: 'accepted', to: 'en_route', label: 'Start ride to customer' },
      { from: 'en_route', to: 'arrived', label: "I've arrived" },
      { from: 'arrived', to: 'in_progress', label: 'Start service' },
    ];
    const step = flow.find((f) => f.from === job.status);
    if (!step) return null;
    return (
      <Button
        title={step.label}
        onPress={() => advanceStatus(job.id, step.to)}
        full
      />
    );
  };

  const addManualIssue = () => {
    const price = parseInt(issuePrice, 10);
    if (!issueTitle.trim() || isNaN(price) || price <= 0) {
      Alert.alert('Add issue', 'Enter a description and a valid price.');
      return;
    }
    addIssue(job.id, issueTitle.trim(), price);
    setIssueTitle('');
    setIssuePrice('');
  };

  const serviceStarted = ['in_progress', 'awaiting_approval'].includes(
    job.status,
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.backText}>‹ Jobs</Text>
        </TouchableOpacity>
        <Text style={styles.topCode}>#{job.code}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Summary */}
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={styles.service}>{job.serviceName}</Text>
          </Row>
          <Row style={{ marginTop: spacing.sm, gap: spacing.sm }}>
            <Badge label={job.category} tone="brand" />
            <JobStatusPill status={job.status} />
          </Row>
          <Divider />
          <KeyValue label="Customer" value={job.customerName} />
          <KeyValue label="Vehicle" value={job.vehicle} />
          <KeyValue label="Slot" value={job.scheduledSlot} />
          <KeyValue
            label="Inspection"
            value={`${job.inspectionPoints}-point · ${job.estimatedDurationMin} min`}
          />
          <Divider />
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={styles.addr}>📍 {job.address}</Text>
          </Row>
          <Button
            title="Navigate"
            variant="outline"
            onPress={openMaps}
            style={{ marginTop: spacing.md }}
            full
          />
        </Card>

        {/* Status progression */}
        {['accepted', 'en_route', 'arrived'].includes(job.status) && (
          <View style={{ marginTop: spacing.lg }}>{nextStatusButton()}</View>
        )}

        {/* Checklist (FR-20) */}
        {serviceStarted && (
          <Card style={{ marginTop: spacing.lg }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <SectionTitle style={{ marginBottom: 0 }}>
                Service checklist
              </SectionTitle>
              <Text style={styles.progress}>
                {checklistDone}/{job.checklist.length}
              </Text>
            </Row>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(checklistDone / job.checklist.length) * 100}%` },
                ]}
              />
            </View>
            <View style={{ marginTop: spacing.md }}>
              {job.checklist.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.checkRow}
                  onPress={() => toggleChecklistItem(job.id, c.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, c.done && styles.checkboxOn]}>
                    {c.done && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text
                    style={[styles.checkLabel, c.done && styles.checkLabelDone]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Additional issues + approval (FR-21 / FR-09) */}
        {serviceStarted && (
          <Card style={{ marginTop: spacing.lg }}>
            <SectionTitle>Additional issues found</SectionTitle>
            <Text style={styles.help}>
              Log extra repairs. The customer must approve the cost before you
              bill for them.
            </Text>

            {job.additionalIssues.map((i) => (
              <Row key={i.id} style={styles.issueRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.issueTitle}>{i.title}</Text>
                  <Text style={styles.issuePrice}>{inr(i.price)} + GST</Text>
                </View>
                {i.approved === 'pending' && job.status !== 'awaiting_approval' ? (
                  <TouchableOpacity onPress={() => removeIssue(job.id, i.id)}>
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                ) : (
                  <Badge
                    label={i.approved}
                    tone={
                      i.approved === 'approved'
                        ? 'success'
                        : i.approved === 'rejected'
                        ? 'danger'
                        : 'warning'
                    }
                  />
                )}
              </Row>
            ))}

            {job.status !== 'awaiting_approval' && (
              <>
                <View style={styles.suggestWrap}>
                  {commonExtraIssues.map((s) => (
                    <TouchableOpacity
                      key={s.title}
                      style={styles.suggestChip}
                      onPress={() => addIssue(job.id, s.title, s.price)}
                    >
                      <Text style={styles.suggestText}>
                        + {s.title} · {inr(s.price)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Row style={{ gap: spacing.sm, marginTop: spacing.md }}>
                  <TextInput
                    style={[styles.input, { flex: 2 }]}
                    placeholder="Custom issue"
                    placeholderTextColor={colors.textMuted}
                    value={issueTitle}
                    onChangeText={setIssueTitle}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="₹"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    value={issuePrice}
                    onChangeText={setIssuePrice}
                  />
                </Row>
                <Button
                  title="Add issue"
                  variant="ghost"
                  onPress={addManualIssue}
                />
              </>
            )}

            {pendingExtras.length > 0 && job.status !== 'awaiting_approval' && (
              <Button
                title={`Request customer approval · ${inr(
                  pendingExtras.reduce((s, i) => s + i.price, 0),
                )} + GST`}
                variant="secondary"
                onPress={() => requestApproval(job.id)}
                style={{ marginTop: spacing.sm }}
                full
              />
            )}

            {job.status === 'awaiting_approval' && (
              <View style={styles.approvalBox}>
                <Text style={styles.approvalTitle}>
                  ⏳ Waiting for customer approval
                </Text>
                <Text style={styles.help}>
                  A request was sent to the customer's app. (Demo: simulate the
                  response.)
                </Text>
                <Row style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                  <Button
                    title="Customer approves"
                    onPress={() => simulateCustomerDecision(job.id, true)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Rejects"
                    variant="danger"
                    onPress={() => simulateCustomerDecision(job.id, false)}
                    style={{ flex: 1 }}
                  />
                </Row>
              </View>
            )}
          </Card>
        )}

        {/* Photos + completion (FR-22) */}
        {serviceStarted && (
          <Card style={{ marginTop: spacing.lg }}>
            <SectionTitle>Proof of service</SectionTitle>
            <Row style={{ gap: spacing.md }}>
              <PhotoTile
                label="Before"
                done={job.beforePhotoTaken}
                onPress={() => setPhoto(job.id, 'before')}
              />
              <PhotoTile
                label="After"
                done={job.afterPhotoTaken}
                onPress={() => setPhoto(job.id, 'after')}
              />
            </Row>
          </Card>
        )}

        {/* Bill summary */}
        {serviceStarted && (
          <Card style={{ marginTop: spacing.lg }}>
            <SectionTitle>Bill summary</SectionTitle>
            <KeyValue label="Service" value={inr(job.basePrice)} />
            {approvedExtras > 0 && (
              <KeyValue label="Approved extras" value={inr(approvedExtras)} />
            )}
            <KeyValue
              label="GST (18%)"
              value={inr(gstAmount(job.basePrice + approvedExtras))}
            />
            <Divider />
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={styles.totalLabel}>Total payable</Text>
              <Text style={styles.totalValue}>{inr(grandTotal)}</Text>
            </Row>
          </Card>
        )}

        {/* Complete */}
        {serviceStarted && job.status !== 'completed' && (
          <View style={{ marginTop: spacing.lg }}>
            <Button
              title="Complete job & collect confirmation"
              onPress={() =>
                Alert.alert(
                  'Confirm completion',
                  'Ask the customer to confirm via OTP/e-signature to close this job.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Confirm',
                      onPress: () => confirmCompletion(job.id),
                    },
                  ],
                )
              }
              disabled={!canComplete}
              full
            />
            {!canComplete && (
              <Text style={styles.blockedHint}>
                {!checklistComplete
                  ? 'Finish all checklist points, '
                  : ''}
                {!job.beforePhotoTaken || !job.afterPhotoTaken
                  ? 'add before & after photos, '
                  : ''}
                {pendingExtras.length > 0
                  ? 'resolve pending approvals '
                  : ''}
                to complete.
              </Text>
            )}
          </View>
        )}

        {job.status === 'completed' && (
          <Card style={[styles.doneCard, { marginTop: spacing.lg }]}>
            <Text style={styles.doneEmoji}>✅</Text>
            <Text style={styles.doneTitle}>Job completed</Text>
            <Text style={styles.help}>
              Customer confirmed · {inr(grandTotal)} collected · warranty period
              has started.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const PhotoTile: React.FC<{
  label: string;
  done: boolean;
  onPress: () => void;
}> = ({ label, done, onPress }) => (
  <TouchableOpacity
    style={[styles.photoTile, done && styles.photoTileDone]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.photoEmoji}>{done ? '🖼️' : '📷'}</Text>
    <Text style={[styles.photoLabel, done && { color: colors.success }]}>
      {done ? `${label} ✓` : `Add ${label}`}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  missing: { textAlign: 'center', margin: spacing.xl, color: colors.textMuted },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backText: { color: colors.primary, fontSize: font.body, fontWeight: '700', width: 44 },
  topCode: { fontWeight: '800', color: colors.text, fontSize: font.body },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  service: { fontSize: font.h2, fontWeight: '800', color: colors.text, flex: 1 },
  addr: { fontSize: font.body, color: colors.text, flex: 1 },
  progress: { fontWeight: '800', color: colors.primary },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: colors.success, borderRadius: radius.pill },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxOn: { backgroundColor: colors.success, borderColor: colors.success },
  checkMark: { color: '#fff', fontWeight: '900', fontSize: 14 },
  checkLabel: { fontSize: font.body, color: colors.text, flex: 1 },
  checkLabelDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  help: { fontSize: font.small, color: colors.textMuted, marginBottom: spacing.sm, lineHeight: 18 },
  issueRow: {
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  issueTitle: { fontSize: font.body, color: colors.text, fontWeight: '600' },
  issuePrice: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  remove: { color: colors.danger, fontWeight: '700', fontSize: font.small },
  suggestWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  suggestChip: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  suggestText: { color: colors.primaryDark, fontWeight: '600', fontSize: font.tiny },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 46,
    fontSize: font.body,
    color: colors.text,
  },
  approvalBox: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  approvalTitle: { fontWeight: '800', color: colors.warning, marginBottom: 4 },
  totalLabel: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  photoTile: {
    flex: 1,
    height: 96,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  photoTileDone: { borderColor: colors.success, borderStyle: 'solid', backgroundColor: colors.successSoft },
  photoEmoji: { fontSize: 26 },
  photoLabel: { marginTop: 6, fontWeight: '700', color: colors.textMuted, fontSize: font.small },
  blockedHint: {
    fontSize: font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  doneCard: { alignItems: 'center' },
  doneEmoji: { fontSize: 40 },
  doneTitle: { fontSize: font.h2, fontWeight: '800', color: colors.text, marginVertical: 6 },
});
