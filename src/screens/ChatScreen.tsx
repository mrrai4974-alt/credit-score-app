import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../theme';

interface Message {
  id: string;
  from: 'user' | 'agent';
  text: string;
}

const QUICK_REPLIES = [
  'Why did my score drop?',
  'How do I raise a dispute?',
  'When will my score update?',
];

/** Canned assistant responses — a real app would stream from a support bot/agent. */
function botReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('drop') || q.includes('down') || q.includes('low')) {
    return 'Scores usually dip from high card utilisation, a missed payment, or a new hard enquiry. I can see a recent enquiry on your report — check the Report tab. Want me to walk you through improving it?';
  }
  if (q.includes('dispute') || q.includes('fraud') || q.includes('not mine')) {
    return 'You can raise a dispute from Report → tap “Report an issue” on any account, or from More → My disputes. We file it with the bureau and track it to resolution. Want me to start one?';
  }
  if (q.includes('update') || q.includes('refresh')) {
    return 'Your score refreshes monthly from the bureau. You can also pull to refresh on the Home screen for the latest available pull.';
  }
  if (q.includes('improve') || q.includes('increase') || q.includes('raise')) {
    return 'Great goal! Your top three levers right now: clear the overdue EMI, bring card utilisation under 30%, and remove that unrecognised loan via a dispute. See the full plan under Improve score.';
  }
  return 'Thanks for your message! A credit specialist will pick this up shortly. In the meantime, you can explore your score factors in the Report tab.';
}

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm0', from: 'agent', text: 'Hi! 👋 I’m your GoodCredit assistant. How can I help with your credit today?' },
  ]);

  function send(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: `u${Date.now()}`, from: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setText('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `a${Date.now()}`, from: 'agent', text: botReply(trimmed) }]);
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 600);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[styles.bubble, m.from === 'user' ? styles.userBubble : styles.agentBubble]}
          >
            <Text style={[styles.bubbleText, m.from === 'user' && styles.userText]}>{m.text}</Text>
          </View>
        ))}

        {messages.length <= 1 ? (
          <View style={styles.quickWrap}>
            {QUICK_REPLIES.map((q) => (
              <Pressable key={q} style={styles.quick} onPress={() => send(q)}>
                <Text style={styles.quickText}>{q}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TextInput
          style={styles.input}
          placeholder="Type your message…"
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => send(text)}
          returnKeyType="send"
        />
        <Pressable style={styles.sendBtn} onPress={() => send(text)}>
          <Ionicons name="send" size={18} color={colors.textInverse} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  messages: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.lg },
  bubble: { maxWidth: '82%', borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 10 },
  agentBubble: { backgroundColor: colors.surface, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleText: { ...typography.body, color: colors.textPrimary, lineHeight: 20 },
  userText: { color: colors.textInverse },
  quickWrap: { gap: spacing.sm, marginTop: spacing.sm },
  quick: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  quickText: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...typography.body,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
