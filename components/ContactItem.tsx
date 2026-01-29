import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import StatusIndicator from './StatusIndicator';

interface Contact {
  id: string;
  name: string;
  status: string;
  statusMessage: string;
  avatar: string | null;
}

interface ContactItemProps {
  contact: Contact;
  onPress: () => void;
}

export default function ContactItem({ contact, onPress }: ContactItemProps) {
  const isOnline = contact.status !== 'offline';
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Avatar */}
      <View style={[styles.avatar, !isOnline && styles.avatarOffline]}>
        <Text style={styles.avatarText}>
          {contact.name.charAt(0).toUpperCase()}
        </Text>
        <View style={styles.statusBadge}>
          <StatusIndicator status={contact.status} size={12} />
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.info}>
        <Text 
          style={[styles.name, !isOnline && styles.nameOffline]} 
          numberOfLines={1}
        >
          {contact.name}
        </Text>
        {contact.statusMessage ? (
          <Text 
            style={[styles.statusMessage, !isOnline && styles.statusMessageOffline]} 
            numberOfLines={1}
          >
            {contact.statusMessage}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarOffline: {
    backgroundColor: Colors.border,
  },
  avatarText: {
    color: Colors.textLight,
    fontSize: Typography.fontSizes.lg,
    fontWeight: '600',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 2,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontSize: Typography.fontSizes.md,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  nameOffline: {
    color: Colors.textSecondary,
  },
  statusMessage: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusMessageOffline: {
    color: Colors.border,
  },
});
