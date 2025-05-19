import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx},${cy}`,
    `L ${start.x},${start.y}`,
    `A ${r},${r} 0 ${largeArcFlag} 0 ${end.x},${end.y}`,
    "Z",
  ].join(" ");
}

interface Props {
  date: string;
  state: "disabled" | "today" | "selected" | "";
  percent?: number;
  isSelected?: boolean;
  onPress?: (date: string) => void;
}

const PercentDay = ({ date, state, percent, isSelected, onPress }: Props) => {
  const day = parseInt(date.split("-")[2], 10);
  const displayPercent = typeof percent === "number";

  return (
    <Pressable
      onPress={() => onPress?.(date)}
      style={[styles.container, state === "disabled" && styles.disabled]}
    >
      <View style={styles.circleWrapper}>
        <Svg width={40} height={40} viewBox="0 0 40 40">
          {isSelected && !displayPercent && (
            <Circle cx="20" cy="20" r="18" fill="#E6E6E6" />
          )}
          <Circle
            cx="20"
            cy="20"
            r="18"
            stroke="#E6E6E6"
            strokeWidth="4"
            fill="none"
          />
          {displayPercent && (
            <Circle
              cx="20"
              cy="20"
              r="18"
              stroke="#71C95D"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(percent! / 100) * 113} 113`}
              strokeDashoffset="0"
              strokeLinecap="butt"
              transform="rotate(-90 20 20)"
            />
          )}
          {isSelected &&
            displayPercent &&
            (percent === 100 ? (
              <Circle cx="20" cy="20" r="18" fill="#71C95D" />
            ) : (
              <Path
                d={describeArc(20, 20, 18, 0, (percent! / 100) * 360)}
                fill="#71C95D"
              />
            ))}
        </Svg>
        <View style={styles.textWrapper}>
          <Text
            style={[
              styles.text,
              !displayPercent && isSelected && styles.grayText,
            ]}
          >
            {day}
          </Text>
        </View>
      </View>
      <View style={styles.percentWrapper}>
        {displayPercent && <Text style={styles.percentText}>{percent}%</Text>}
      </View>
    </Pressable>
  );
};

export default PercentDay;

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  circleWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // 절대값 안 씀!
  },
  textWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 2,
  },
  grayText: {
    color: "#333",
  },
  percentWrapper: {
    height: 14,
    top: 3,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  percentText: {
    fontSize: 10,
    color: "#71C95D",
    lineHeight: 12,
  },
  disabled: {
    opacity: 0.4,
  },
});
