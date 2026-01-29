import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, StatusOptions } from '../constants/theme';
import { useUser } from '../context/UserContext';
import StatusIndicator from '../components/StatusIndicator';

export default function StatusScreen() {
  const router = useRouter();
  const { user, status, setStatus, setStatusMessage } = useUser();

  const handleStatusSelect = (statusId: string) => {
    setStatus(statusId);
  };

  return (
    <View style={styles.container}>
      {/* Personal Message */}
      <View style={styles.section}>
        <Text style={styles.label}>Personal Message:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={user.statusMessage}
            onChangeText={setStatusMessage}
            placeholder="<Type a personal message>"
            placeholderTextColor={Colors.textDisabled}
            maxLength={150}
          />
        </View>
        <Text style={styles.hint}>This message will be shown to your contacts</Text>
      </View>

      {/* Status Options */}
      <View style={styles.section}>
        <Text style={styles.label}>My Status:</Text>
        <View style={styles.statusList}>
          {StatusOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.statusOption}
              onPress={() => handleStatusSelect(option.id)}
            >
              <View style={[
                styles.radioOuter,
                status === option.id && styles.radioOuterSelected
              ]}>
                {status === option.id && <View style={styles.radioInner} />}
              </View>
              <StatusIndicator status={option.id} size={10} />
              <Text style={styles.statusLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.windowBackground,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderTopColor: Colors.borderDarker,
    borderLeftColor: Colors.borderDarker,
    borderBottomColor: Colors.borderLight,
    borderRightColor: Colors.borderLight,
  },
  input: {
    padding: Spacing.md,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  hint: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statusList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderTopColor: Colors.borderDarker,
    borderLeftColor: Colors.borderDarker,
    borderBottomColor: Colors.borderLight,
    borderRightColor: Colors.borderLight,
    padding: Spacing.sm,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  radioOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  statusLabel: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.buttonFace,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
});
