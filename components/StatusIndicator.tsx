import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface StatusIndicatorProps {
  status: string;
  size?: number;
}

const statusColors: Record<string, string> = {
  online: Colors.online,
  away: Colors.away,
  brb: Colors.away,
  lunch: Colors.away,
  phone: Colors.busy,
  busy: Colors.busy,
  offline: Colors.offline,
};

export default function StatusIndicator({ status, size = 10 }: StatusIndicatorProps) {
  const color = statusColors[status] || Colors.offline;
  
  return (
    <View 
      style={[
        styles.indicator, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: color,
        }
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  indicator: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});
