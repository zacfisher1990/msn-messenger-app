import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, Emoticons } from '../../constants/theme';
import TypingIndicator from '../../components/TypingIndicator';

// Import buddy icons
const buddyOnline = require('../../assets/images/buddy-online.png');
const buddyAway = require('../../assets/images/buddy-away.png');
const buddyOffline = require('../../assets/images/buddy-offline.png');

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

// Mock messages
const mockMessages = [
  { id: '1', text: 'heyyyy', sender: 'them', timestamp: new Date(Date.now() - 300000) },
  { id: '2', text: 'omg hi!!!', sender: 'me', timestamp: new Date(Date.now() - 290000) },
  { id: '3', text: 'did u see what happened at school today', sender: 'them', timestamp: new Date(Date.now() - 280000) },
  { id: '4', text: 'nooo what??', sender: 'me', timestamp: new Date(Date.now() - 270000) },
  { id: '5', text: 'lol ill tell u later its so crazy', sender: 'them', timestamp: new Date(Date.now() - 260000) },
  { id: '6', text: ':D :D :D', sender: 'them', timestamp: new Date(Date.now() - 250000) },
];

const mockContacts: Record<string, { name: string; status: string; statusMessage: string }> = {
  '1': { name: 'Ashley 💖', status: 'online', statusMessage: '♪ Listening to My Chemical Romance' },
  '2': { name: 'Brandon', status: 'away', statusMessage: 'brb dinner' },
  '3': { name: 'Christina ✨', status: 'online', statusMessage: 'New pics uploaded!!' },
  '4': { name: 'Derek', status: 'busy', statusMessage: 'studying 4 finals 📚' },
  '5': { name: 'Emily', status: 'offline', statusMessage: '' },
  '6': { name: 'Frank', status: 'online', statusMessage: 'who wants to play halo??' },
};

// Quick emoticons for the toolbar
const quickEmoticons = ['😊', '😃', '😉', '😛', '😢', '😎', '❤️', '👍'];

// Replace text emoticons with emoji
function replaceEmoticons(text: string): string {
  let result = text;
  Object.entries(Emoticons).forEach(([code, emoji]) => {
    result = result.split(code).join(emoji);
  });
  return result;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Toolbar component - MSN style with yellow/gold icons
function Toolbar({ onNudge }: { onNudge: () => void }) {
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity style={styles.toolbarButton}>
        <Text style={styles.toolbarIcon}>👥</Text>
        <Text style={styles.toolbarLabel}>Invite</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarButton}>
        <Text style={styles.toolbarIcon}>📁</Text>
        <Text style={styles.toolbarLabel}>Send Files</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarButton}>
        <Text style={styles.toolbarIcon}>📹</Text>
        <Text style={styles.toolbarLabel}>Video</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarButton}>
        <Text style={styles.toolbarIcon}>🎤</Text>
        <Text style={styles.toolbarLabel}>Voice</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarButton} onPress={onNudge}>
        <Text style={styles.toolbarIcon}>👊</Text>
        <Text style={styles.toolbarLabel}>Nudge</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarButton}>
        <Text style={styles.toolbarIcon}>🎮</Text>
        <Text style={styles.toolbarLabel}>Games</Text>
      </TouchableOpacity>
    </View>
  );
}

// Menu bar - removed for mobile

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const contact = mockContacts[id || '1'] || { name: 'Unknown', status: 'offline', statusMessage: '' };

  useEffect(() => {
    navigation.setOptions({
      title: contact.name,
      headerShown: false,
    });
  }, [contact.name, navigation]);

  // Simulate typing indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me' as const,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendNudge = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    const nudgeMessage = {
      id: Date.now().toString(),
      text: '👊 You have just sent a nudge!',
      sender: 'system' as const,
      timestamp: new Date(),
    };
    setMessages([...messages, nudgeMessage]);
  };

  const insertEmoticon = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateX: shakeAnimation }] }
      ]}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Toolbar */}
        <Toolbar onNudge={sendNudge} />
        
        {/* To: header with back button */}
        <View style={styles.toHeader}>
          <Pressable onPress={() => router.push('/')} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.toLabel}>To: </Text>
          <Text style={styles.toName}>{contact.name}</Text>
        </View>

        {/* Main chat area */}
        <View style={styles.chatArea}>
          {/* Messages panel */}
          <View style={styles.messagesPanel}>
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesList}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
            >
              {messages.map((msg) => (
                <View key={msg.id} style={styles.messageRow}>
                  {msg.sender === 'system' ? (
                    <Text style={styles.systemMessage}>{msg.text}</Text>
                  ) : (
                    <>
                      <Text style={[
                        styles.messageSender,
                        msg.sender === 'me' ? styles.senderMe : styles.senderThem
                      ]}>
                        {msg.sender === 'me' ? 'You' : contact.name.split(' ')[0]} says:
                      </Text>
                      <Text style={styles.messageText}>
                        {'  '}{replaceEmoticons(msg.text)}
                      </Text>
                    </>
                  )}
                </View>
              ))}
              {isTyping && (
                <View style={styles.messageRow}>
                  <Text style={styles.typingText}>{contact.name.split(' ')[0]} is typing...</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Display picture sidebar */}
          <View style={styles.sidebar}>
            {/* Contact's display picture */}
            <View style={styles.displayPicture}>
              <Image 
                source={getBuddyIcon(contact.status)} 
                style={styles.dpImage} 
                resizeMode="contain" 
              />
            </View>
            
            {/* Spacer */}
            <View style={styles.sidebarSpacer} />
            
            {/* Your display picture */}
            <View style={styles.displayPicture}>
              <Image 
                source={buddyOnline} 
                style={styles.dpImage} 
                resizeMode="contain" 
              />
            </View>
          </View>
        </View>

        {/* Input area */}
        <View style={styles.inputArea}>
          {/* Emoticon bar */}
          <View style={styles.emoticonBar}>
            <Text style={styles.emoticonBarLabel}>A</Text>
            <View style={styles.emoticonDivider} />
            {quickEmoticons.map((emoji, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.emoticonButton}
                onPress={() => insertEmoticon(emoji)}
              >
                <Text style={styles.emoticonText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Text input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message here..."
              placeholderTextColor="#999"
              multiline
              onSubmitEditing={sendMessage}
            />
            
            {/* Send button area */}
            <View style={styles.buttonArea}>
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Status bar / link */}
        <LinearGradient
          colors={['#8AC9F0', '#5EB3E8', '#3BA3E0']}
          style={styles.statusBar}
        >
          <Text style={styles.statusBarText}>
            Click for new Emoticons and Theme Packs from Blue Mountain
          </Text>
        </LinearGradient>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4E8F8',
  },
  keyboardAvoid: {
    flex: 1,
  },
  
  // Toolbar
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FC',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#A8D4F0',
    justifyContent: 'flex-start',
    gap: 4,
  },
  toolbarButton: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  toolbarIcon: {
    fontSize: 24,
  },
  toolbarLabel: {
    fontSize: 9,
    color: '#333',
    marginTop: 2,
  },
  
  // To header
  toHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#A8D4F0',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  backButtonText: {
    fontSize: 18,
    color: '#3BA3E0',
    fontWeight: 'bold',
  },
  toLabel: {
    fontSize: 12,
    color: '#666',
  },
  toName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  
  // Chat area
  chatArea: {
    flex: 1,
    flexDirection: 'row',
    padding: 4,
  },
  messagesPanel: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#A8D4F0',
    borderRadius: 2,
    marginRight: 4,
  },
  messagesList: {
    flex: 1,
    padding: 8,
  },
  messageRow: {
    marginBottom: 2,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  senderMe: {
    color: '#0066CC',
  },
  senderThem: {
    color: '#CC0000',
  },
  messageText: {
    fontSize: 12,
    color: '#333',
  },
  systemMessage: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 4,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  
  // Sidebar
  sidebar: {
    width: 90,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    justifyContent: 'space-between',
  },
  sidebarSpacer: {
    flex: 1,
  },
  displayPicture: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#5EB3E8',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dpImage: {
    width: 70,
    height: 70,
  },
  
  // Input area
  inputArea: {
    backgroundColor: '#E8F4FC',
    borderTopWidth: 1,
    borderTopColor: '#A8D4F0',
  },
  emoticonBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#A8D4F0',
    backgroundColor: '#fff',
  },
  emoticonBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  emoticonDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#A8D4F0',
    marginRight: 8,
  },
  emoticonButton: {
    paddingHorizontal: 4,
  },
  emoticonText: {
    fontSize: 20,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#A8D4F0',
    borderRadius: 2,
    padding: 8,
    fontSize: 12,
    minHeight: 60,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  buttonArea: {
    marginLeft: 8,
    justifyContent: 'flex-end',
  },
  sendButton: {
    backgroundColor: '#8AC9F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderTopColor: '#C5E4F7',
    borderLeftColor: '#C5E4F7',
    borderBottomColor: '#5EB3E8',
    borderRightColor: '#5EB3E8',
    borderRadius: 4,
  },
  sendButtonText: {
    fontSize: 12,
    color: '#1a5a7a',
    fontWeight: '500',
  },
  
  // Status bar
  statusBar: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  statusBarText: {
    fontSize: 11,
    color: '#1a5a7a',
    textDecorationLine: 'underline',
  },
});