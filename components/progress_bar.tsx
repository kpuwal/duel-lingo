import { Animated, StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  progressAnim: Animated.Value;
  matchedCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progressAnim, matchedCount }) => {
  return (
    <View style={styles.progressWrapper}>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <View style={styles.scaleRow}>
        {[0, 5, 10, 15, 20].map((val, i) => (
          <Text key={i} style={styles.scaleText}>
            {val}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    progressWrapper: { width: '90%', marginBottom: 20 },
    progressBarBackground: {
        width: '100%',
        height: 14,
        backgroundColor: '#E0E0E0',
        borderRadius: 7,
        overflow: 'hidden',
    },
    progressBarFill: { height: '100%', backgroundColor: '#4CAF50' },
    scaleRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    scaleText: { fontSize: 12, color: '#000' },
})