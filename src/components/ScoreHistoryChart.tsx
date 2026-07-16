import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import type { ScorePoint } from '../services/bureau/types';
import { colors, typography } from '../theme';
import { withAlpha } from './ui';

/**
 * A compact line chart of the score history (FR-2). Draws a smooth-ish
 * polyline with a soft gradient fill beneath it and labels the min/max on the
 * y-axis and the first/last month on the x-axis.
 */
export function ScoreHistoryChart({
  data,
  width,
  height = 180,
}: {
  data: ScorePoint[];
  width: number;
  height?: number;
}) {
  const padX = 8;
  const padTop = 16;
  const padBottom = 24;

  if (data.length < 2) {
    return (
      <View style={{ height }}>
        <Text style={styles.empty}>Not enough history yet.</Text>
      </View>
    );
  }

  const values = data.map((d) => d.score);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  // Pad the domain so the line never hugs the top/bottom edges.
  const min = Math.max(300, rawMin - 15);
  const max = Math.min(900, rawMax + 15);
  const span = Math.max(1, max - min);

  const chartW = width - padX * 2;
  const chartH = height - padTop - padBottom;

  const xFor = (i: number) => padX + (chartW * i) / (data.length - 1);
  const yFor = (v: number) => padTop + chartH * (1 - (v - min) / span);

  const points = data.map((d, i) => ({ x: xFor(i), y: yFor(d.score) }));
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area =
    `M ${points[0].x} ${padTop + chartH} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(' ') +
    ` L ${points[points.length - 1].x} ${padTop + chartH} Z`;

  const last = points[points.length - 1];

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={withAlpha(colors.primary, 0.28)} />
          <Stop offset="1" stopColor={withAlpha(colors.primary, 0)} />
        </LinearGradient>
      </Defs>

      <Path d={area} fill="url(#areaGrad)" />
      <Path d={line} stroke={colors.primary} strokeWidth={3} fill="none" strokeLinejoin="round" />

      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={2.5} fill={colors.primary} />
      ))}
      <Circle cx={last.x} cy={last.y} r={5} fill={colors.primary} />
      <Circle cx={last.x} cy={last.y} r={9} fill={withAlpha(colors.primary, 0.2)} />

      <SvgText x={padX} y={12} fontSize={10} fill={colors.textMuted}>
        {max}
      </SvgText>
      <SvgText x={padX} y={height - 10} fontSize={10} fill={colors.textMuted}>
        {min}
      </SvgText>
      <SvgText x={padX} y={height - 2} fontSize={10} fill={colors.textMuted}>
        {monthLabel(data[0].date)}
      </SvgText>
      <SvgText
        x={width - padX}
        y={height - 2}
        fontSize={10}
        fill={colors.textMuted}
        textAnchor="end"
      >
        {monthLabel(data[data.length - 1].date)}
      </SvgText>
    </Svg>
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function monthLabel(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
}

const styles = StyleSheet.create({
  empty: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: 24 },
});
