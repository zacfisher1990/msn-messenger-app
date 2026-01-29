import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Colors, Spacing, Typography, StatusOptions } from '../constants/theme';
import { useUser } from '../context/UserContext';

// Import buddy icons for each status
const buddyOnline = require('../assets/images/buddy-online.png');
const buddyAway = require('../assets/images/buddy-away.png');
const buddyOffline = require('../assets/images/buddy-offline.png');

// Get buddy icon based on status
function getBuddyIcon(status: string) {
  switch (status) {
    case 'online': return buddyOnline;
    case 'away':
    case 'brb': return buddyAway;
    case 'busy': return buddyOffline;
    case 'offline':
    default: return buddyOffline;
  }
}

// Mock contacts data
const mockContacts = [
  { id: '1', name: 'Ashley 💖', status: 'online', statusMessage: '♪ Listening to My Chemical Romance' },
  { id: '2', name: 'Brandon', status: 'away', statusMessage: 'brb dinner' },
  { id: '3', name: 'Christina ✨', status: 'online', statusMessage: 'New pics uploaded!!' },
  { id: '4', name: 'Derek', status: 'busy', statusMessage: 'studying 4 finals 📚' },
  { id: '5', name: 'Emily', status: 'offline', statusMessage: '' },
  { id: '6', name: 'Frank', status: 'online', statusMessage: 'who wants to play halo??' },
  { id: '7', name: 'Gina', status: 'away', statusMessage: '~*~spring break 06~*~' },
  { id: '8', name: 'Henry', status: 'offline', statusMessage: '' },
];


// Tree view group
function ContactGroup({ 
  title, 
  contacts, 
  onContactPress 
}: { 
  title: string; 
  contacts: typeof mockContacts;
  onContactPress: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <View style={styles.group}>
      <Pressable 
        style={styles.groupHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
        <Text style={styles.groupTitle}>{title} ({contacts.length})</Text>
      </Pressable>
      
      {expanded && contacts.map((contact) => (
        <Pressable
          key={contact.id}
          style={({ pressed }) => [
            styles.contactRow,
            pressed && styles.contactRowPressed
          ]}
          onPress={() => onContactPress(contact.id)}
        >
          {/* Buddy icon based on status */}
          <View style={styles.buddyIcon}>
            <Image 
              source={getBuddyIcon(contact.status)} 
              style={styles.buddyIconImage} 
              resizeMode="contain" 
            />
          </View>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactNameRow}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactStatus}>
                ({contact.status === 'online' ? 'Online' : 
                  contact.status === 'away' ? 'Away' : 
                  contact.status === 'busy' ? 'Busy' : 'Offline'})
              </Text>
            </View>
            {contact.statusMessage ? (
              <Text style={styles.contactMessage} numberOfLines={1}>
                {contact.statusMessage}
              </Text>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export default function ContactsScreen() {
  const router = useRouter();
  const { user, status } = useUser();
  
  const onlineContacts = mockContacts.filter(c => c.status === 'online');
  const awayContacts = mockContacts.filter(c => ['away', 'brb', 'lunch', 'phone'].includes(c.status));
  const busyContacts = mockContacts.filter(c => c.status === 'busy');
  const offlineContacts = mockContacts.filter(c => c.status === 'offline');

  const handleContactPress = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <View style={styles.container}>
      
      {/* MSN Header with gradient */}
      <LinearGradient
        colors={[Colors.msnHeaderStart, Colors.msnHeaderMid, Colors.msnHeaderEnd]}
        style={styles.msnHeader}
      >
        <View style={styles.headerContent}>
          {/* MSN Logo area */}
          <View style={styles.logoArea}>
            <Text style={styles.msnLogo}>msn</Text>
            <Text style={styles.messengerText}>Messenger</Text>
          </View>
          
          {/* User profile section */}
          <Pressable 
            style={styles.userSection}
            onPress={() => router.push('/status')}
          >
            <View style={styles.displayPicture}>
              <Image 
                source={buddyOnline} 
                style={styles.dpImage} 
                resizeMode="contain" 
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.displayName}</Text>
              <View style={styles.statusRow}>
                <Text style={styles.userStatus}>
                  ({StatusOptions.find(s => s.id === status)?.label || 'Online'})
                </Text>
              </View>
              <Text style={styles.personalMessage} numberOfLines={1}>
                {user.statusMessage || '<Type a personal message>'}
              </Text>
            </View>
          </Pressable>
          
          {/* Quick links */}
          <View style={styles.quickLinks}>
            <Text style={styles.quickLink}>(0)</Text>
            <Text style={styles.quickLink}>📧 My Space</Text>
            <Text style={styles.quickLink}>🌐 MSN Today</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Contact List */}
      <View style={styles.contactListContainer}>
        <ScrollView style={styles.contactList}>
          {[...mockContacts].sort((a, b) => {
            const order = { online: 0, away: 1, busy: 2, offline: 3 };
            return (order[a.status as keyof typeof order] ?? 3) - (order[b.status as keyof typeof order] ?? 3);
          }).map((contact) => (
            <Pressable
              key={contact.id}
              style={({ pressed }) => [
                styles.contactRow,
                pressed && styles.contactRowPressed
              ]}
              onPress={() => handleContactPress(contact.id)}
            >
              <View style={styles.buddyIcon}>
                <Image 
                  source={getBuddyIcon(contact.status)} 
                  style={styles.buddyIconImage} 
                  resizeMode="contain" 
                />
              </View>
              <View style={styles.contactInfo}>
                <View style={styles.contactNameRow}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactStatus}>
                    ({contact.status === 'online' ? 'Online' : 
                      contact.status === 'away' ? 'Away' : 
                      contact.status === 'busy' ? 'Busy' : 'Offline'})
                  </Text>
                </View>
                {contact.statusMessage ? (
                  <Text style={styles.contactMessage} numberOfLines={1}>
                    {contact.statusMessage}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.addContact}>
          <Text style={styles.addContactIcon}>➕</Text>
          <Text style={styles.addContactText}>Add a Contact</Text>
        </TouchableOpacity>
        
        {/* Search bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchInput}>
            <Text style={styles.searchPlaceholder}>Search the web...</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.windowBackground,
  },
  
  // Menu bar
  menuBar: {
    flexDirection: 'row',
    backgroundColor: Colors.panelBackground,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  menuItem: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  // MSN Header
  msnHeader: {
    paddingBottom: 8,
  },
  headerContent: {
    padding: 8,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  msnLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FF6600',
    marginRight: 4,
  },
  messengerText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  
  // User section
  userSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  displayPicture: {
    width: 64,
    height: 64,
    backgroundColor: Colors.white,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
  },
  dpImage: {
    width: 56,
    height: 56,
  },
  userInfo: {
    flex: 1,
    marginLeft: 8,
  },
  userName: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userStatus: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
  },
  personalMessage: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  
  // Quick links
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  quickLink: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textLink,
  },
  
  // Contact list
  contactListContainer: {
    flex: 1,
    backgroundColor: Colors.listBackground,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  contactList: {
    flex: 1,
  },
  
  // Group styles
  group: {
    marginBottom: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.panelBackground,
  },
  expandIcon: {
    fontSize: 8,
    color: Colors.textSecondary,
    marginRight: 6,
    width: 12,
  },
  groupTitle: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  
  // Contact row
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    paddingLeft: 24,
  },
  contactRowPressed: {
    backgroundColor: Colors.selectionBg,
  },
  buddyIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  buddyIconImage: {
    width: 28,
    height: 28,
  },
  contactInfo: {
    flex: 1,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  contactStatus: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  contactMessage: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  
  // Bottom section
  bottomSection: {
    backgroundColor: Colors.panelBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    padding: 8,
  },
  addContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addContactIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  addContactText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textLink,
    textDecorationLine: 'underline',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  searchPlaceholder: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textDisabled,
  },
  searchButton: {
    backgroundColor: Colors.buttonFace,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
  },
  searchButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
});