import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { bandForScore, colors, SCORE_MAX, SCORE_MIN, typography } from '../theme';

/**
 * A 270° semicircular gauge showing the credit score, GoodScore-style. The
 * coloured arc sweeps proportionally to where the score sits in the 300–900
 * range; the tip dot marks the exact position and the band colour tints it.
 */
export function ScoreGauge({ score, size = 240 }: { score: number; size?: number }) {
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Sweep from 135° to 405° (i.e. a 270° arc opening at the bottom).
  const startAngle = 135;
  const totalSweep = 270;
  const clamped = Math.max(SCORE_MIN, Math.min(SCORE_MAX, score));
  const progress = (clamped - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  const endAngle = startAngle + totalSweep * progress;

  const band = bandForScore(score);
  const trackPath = describeArc(cx, cy, radius, startAngle, startAngle + totalSweep);
  const valuePath = describeArc(cx, cy, radius, startAngle, endAngle);
  const tip = pointOnCircle(cx, cy, radius, endAngle);

  return (
    <View style={{ width: size, height: size * 0.82 }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.primaryLight} />
            <Stop offset="1" stopColor={band.color} />
          </LinearGradient>
        </Defs>
        <Path
          d={trackPath}
          stroke={colors.surfaceAlt}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={valuePath}
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={tip.x} cy={tip.y} r={strokeWidth / 2 + 3} fill={colors.surface} />
        <Circle cx={tip.x} cy={tip.y} r={strokeWidth / 2 - 2} fill={band.color} />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.score}>{Math.round(clamped)}</Text>
        <Text style={[styles.band, { color: band.color }]}>{band.label}</Text>
        <Text style={styles.range}>
          {SCORE_MIN}–{SCORE_MAX}
        </Text>
      </View>
    </View>
  );
}

function pointOnCircle(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Build an SVG arc path between two angles (degrees, clockwise). */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = pointOnCircle(cx, cy, r, startAngle);
  const end = pointOnCircle(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  score: { ...typography.display, fontSize: 52, color: colors.textPrimary },
  band: { ...typography.h3, marginTop: 2 },
  range: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
});
