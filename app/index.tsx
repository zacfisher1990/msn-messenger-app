import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable, Image, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Colors, Spacing, Typography, StatusOptions } from '../constants/theme';
import { useUser } from '../context/UserContext';

// Status colors for the indicator dots
const statusColors: Record<string, string> = {
  online: '#4CAF50',
  busy: '#f44336',
  brb: '#FF9800',
  away: '#FF9800',
  phone: '#f44336',
  lunch: '#FF9800',
  offline: '#9E9E9E',
};

// Import buddy icons for each status
const buddyOnline = require('../assets/images/buddy-online.png');
const buddyAway = require('../assets/images/buddy-away.png');
const buddyOffline = require('../assets/images/buddy-offline.png');
const buddyAdd = require('../assets/images/buddy-add.png');

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
  const { user, status, setStatus, setStatusMessage } = useUser();
  
  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [tempMessage, setTempMessage] = useState(user.statusMessage);
  
  const onlineContacts = mockContacts.filter(c => c.status === 'online');
  const awayContacts = mockContacts.filter(c => ['away', 'brb', 'lunch', 'phone'].includes(c.status));
  const busyContacts = mockContacts.filter(c => c.status === 'busy');
  const offlineContacts = mockContacts.filter(c => c.status === 'offline');

  const handleContactPress = (id: string) => {
    router.push(`/chat/${id}`);
  };
  
  const handleStatusSelect = (newStatus: string) => {
    setStatus(newStatus);
    setShowStatusModal(false);
  };
  
  const handleMessageSave = () => {
    setStatusMessage(tempMessage);
    setShowMessageModal(false);
  };

  return (
    <View style={styles.container}>
      
      {/* MSN Header with gradient - classic blue style */}
      <LinearGradient
        colors={['#C5E4F7', '#8AC9F0', '#5EB3E8']}
        style={styles.msnHeader}
      >
        <View style={styles.headerContent}>
          {/* MSN Logo area */}
          <View style={styles.logoArea}>
            <Text style={styles.msnLogo}>msn</Text>
            <Text style={styles.messengerText}>Messenger</Text>
          </View>
          
          {/* User profile section */}
          <View style={styles.userSection}>
            <View style={styles.displayPicture}>
              <Image 
                source={getBuddyIcon(status)} 
                style={styles.dpImage} 
                resizeMode="contain" 
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.displayName}</Text>
              
              {/* Clickable status with chevron */}
              <Pressable 
                style={styles.statusDropdown}
                onPress={() => setShowStatusModal(true)}
              >
                <View style={[styles.statusDot, { backgroundColor: statusColors[status] || statusColors.online }]} />
                <Text style={styles.userStatus}>
                  ({StatusOptions.find(s => s.id === status)?.label || 'Online'})
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </Pressable>
              
              {/* Clickable personal message with chevron */}
              <Pressable 
                style={styles.messageDropdown}
                onPress={() => {
                  setTempMessage(user.statusMessage);
                  setShowMessageModal(true);
                }}
              >
                <Text style={styles.personalMessage} numberOfLines={1}>
                  {user.statusMessage || '<Type a personal message>'}
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </Pressable>
            </View>
          </View>
          

        </View>
      </LinearGradient>

      {/* Contact List with Tab Strip */}
      <View style={styles.contactListContainer}>
        {/* Left tab strip like original MSN */}
        <View style={styles.tabStrip}>
          <View style={[styles.tab, styles.tabActive]}>
            <Image source={buddyOnline} style={styles.tabIconImage} resizeMode="contain" />
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabIconText}>🌐</Text>
          </View>
        </View>
        
        {/* Contact list area */}
        <View style={styles.contactListInner}>
          <ScrollView style={styles.contactList}>
            {/* Add a Contact - at top like original MSN */}
            <Pressable style={styles.addContactRow}>
              <Image 
                source={buddyAdd} 
                style={{ width: 24, height: 24 }} 
                resizeMode="contain" 
              />
              <Text style={styles.addContactTopText}>Add a Contact</Text>
            </Pressable>
            
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
                <Image 
                  source={getBuddyIcon(contact.status)} 
                  style={styles.contactBuddyIcon} 
                  resizeMode="contain" 
                />
                <Text style={styles.contactText} numberOfLines={1}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactStatus}>
                    {' '}({contact.status === 'online' ? 'Online' : 
                      contact.status === 'away' ? 'Away' : 
                      contact.status === 'busy' ? 'Busy' : 'Offline'})
                  </Text>
                  {contact.statusMessage ? (
                    <Text style={styles.contactMessage}> - {contact.statusMessage}</Text>
                  ) : null}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Bottom section - classic MSN blue footer */}
      <LinearGradient
        colors={['#8AC9F0', '#5EB3E8', '#3BA3E0']}
        style={styles.bottomSection}
      >
        <View style={styles.msnFooter}>
          <Text style={styles.msnFooterLogo}>msn</Text>
          <Text style={styles.msnFooterText}>Messenger</Text>
        </View>
      </LinearGradient>
      
      {/* Status Selection Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowStatusModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>My Status:</Text>
            <View style={styles.statusList}>
              {StatusOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.statusOption,
                    status === option.id && styles.statusOptionSelected
                  ]}
                  onPress={() => handleStatusSelect(option.id)}
                >
                  <View style={styles.radioOuter}>
                    {status === option.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={[styles.statusDot, { backgroundColor: statusColors[option.id] || statusColors.online }]} />
                  <Text style={styles.statusOptionText}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.modalButton}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
              <Pressable 
                style={styles.modalButton}
                onPress={() => setShowStatusModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
      
      {/* Personal Message Modal */}
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowMessageModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Personal Message:</Text>
            <TextInput
              style={styles.messageInput}
              value={tempMessage}
              onChangeText={setTempMessage}
              placeholder="Type a personal message"
              placeholderTextColor="#999"
              maxLength={100}
            />
            <Text style={styles.messageHint}>This message will be shown to your contacts</Text>
            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.modalButton}
                onPress={handleMessageSave}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
              <Pressable 
                style={styles.modalButton}
                onPress={() => setShowMessageModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    color: '#FFFFFF',
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
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3BA3E0',
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
  statusDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  messageDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  chevron: {
    fontSize: 8,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  userStatus: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
  },
  personalMessage: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    flex: 1,
  },
  
  // Contact list with tab strip
  contactListContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 4,
    borderWidth: 1,
    borderColor: '#A8D4F0',
    backgroundColor: Colors.listBackground,
  },
  tabStrip: {
    width: 28,
    backgroundColor: '#D4E8F8',
    borderRightWidth: 1,
    borderRightColor: '#A8D4F0',
    paddingTop: 4,
  },
  tab: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    backgroundColor: '#E0F0FC',
    borderWidth: 1,
    borderTopColor: '#F0F8FF',
    borderLeftColor: '#F0F8FF',
    borderBottomColor: '#A8D4F0',
    borderRightColor: '#A8D4F0',
  },
  tabActive: {
    backgroundColor: Colors.listBackground,
    borderRightColor: Colors.listBackground,
    marginRight: -1,
    zIndex: 1,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabIconImage: {
    width: 18,
    height: 18,
  },
  tabIconText: {
    fontSize: 14,
  },
  contactListInner: {
    flex: 1,
    backgroundColor: Colors.listBackground,
  },
  contactList: {
    flex: 1,
  },
  
  // Add a Contact row at top
  addContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  addContactTopText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#333',
  },
  addContactIcon: {
    width: 24,
    height: 24,
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
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  contactRowPressed: {
    backgroundColor: Colors.selectionBg,
  },
  contactBuddyIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
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
  contactText: {
    flex: 1,
    fontSize: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  contactStatus: {
    fontSize: 12,
    color: '#888',
  },
  contactMessage: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  
  // Bottom section - MSN footer
  bottomSection: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#5EB3E8',
  },
  msnFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msnFooterLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    marginRight: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  msnFooterText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  
  // Modal styles - blue theme
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#D4E8F8',
    borderRadius: 8,
    padding: 16,
    width: '85%',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#5EB3E8',
  },
  modalTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: 'bold',
    color: '#1a5a7a',
    marginBottom: 12,
  },
  statusList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#A8D4F0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  statusOptionSelected: {
    backgroundColor: '#E8F4FC',
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5EB3E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Colors.white,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3BA3E0',
  },
  statusOptionText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#8AC9F0',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderTopColor: '#C5E4F7',
    borderLeftColor: '#C5E4F7',
    borderBottomColor: '#5EB3E8',
    borderRightColor: '#5EB3E8',
    minWidth: 80,
    alignItems: 'center',
    borderRadius: 4,
  },
  modalButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: '#1a5a7a',
    fontWeight: '500',
  },
  messageInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#A8D4F0',
    borderRadius: 4,
    padding: 8,
    fontSize: Typography.fontSizes.sm,
    marginBottom: 8,
  },
  messageHint: {
    fontSize: Typography.fontSizes.xs,
    color: '#5a8a9a',
    fontStyle: 'italic',
    marginBottom: 12,
  },
});