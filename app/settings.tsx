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
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, Emoticons } from '../constants/theme';
import TypingIndicator from '../components/TypingIndicator';

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

// Toolbar component
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

// Menu bar
function MenuBar() {
  return (
    <View style={styles.menuBar}>
      <Text style={styles.menuItem}>File</Text>
      <Text style={styles.menuItem}>Edit</Text>
      <Text style={styles.menuItem}>Actions</Text>
      <Text style={styles.menuItem}>Tools</Text>
      <Text style={styles.menuItem}>Help</Text>
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
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
        {/* Menu Bar */}
        <MenuBar />
        
        {/* Toolbar */}
        <Toolbar onNudge={sendNudge} />
        
        {/* To: header */}
        <View style={styles.toHeader}>
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
                        {replaceEmoticons(msg.text)}
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
            <View style={styles.displayPicture}>
              <Text style={styles.dpText}>👤</Text>
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
              placeholderTextColor={Colors.textDisabled}
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

        {/* Status bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusBarText}>
            Click for new Emoticons and Theme Packs from Blue Mountain
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.windowBackground,
  },
  keyboardAvoid: {
    flex: 1,
  },
  
  // Menu bar
  menuBar: {
    flexDirection: 'row',
    backgroundColor: Colors.panelBackground,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderMid,
  },
  menuItem: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  // Toolbar
  toolbar: {
    flexDirection: 'row',
    backgroundColor: Colors.panelBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderMid,
    justifyContent: 'flex-start',
    gap: 4,
  },
  toolbarButton: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  toolbarIcon: {
    fontSize: 20,
  },
  toolbarLabel: {
    fontSize: 9,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  
  // To header
  toHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderMid,
  },
  toLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
  },
  toName: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  
  // Chat area
  chatArea: {
    flex: 1,
    flexDirection: 'row',
  },
  messagesPanel: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    margin: 4,
    marginRight: 0,
  },
  messagesList: {
    flex: 1,
    padding: 8,
  },
  messageRow: {
    marginBottom: 4,
  },
  messageSender: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: 'bold',
  },
  senderMe: {
    color: '#0000FF',
  },
  senderThem: {
    color: '#FF0000',
  },
  messageText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  systemMessage: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 4,
  },
  typingText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  
  // Sidebar
  sidebar: {
    width: 100,
    padding: 4,
    alignItems: 'center',
  },
  displayPicture: {
    width: 80,
    height: 80,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpText: {
    fontSize: 40,
  },
  
  // Input area
  inputArea: {
    backgroundColor: Colors.panelBackground,
    borderTopWidth: 1,
    borderTopColor: Colors.borderMid,
  },
  emoticonBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderMid,
  },
  emoticonBarLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  emoticonDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.borderMid,
    marginRight: 8,
  },
  emoticonButton: {
    paddingHorizontal: 4,
  },
  emoticonText: {
    fontSize: 18,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    padding: 8,
    fontSize: Typography.fontSizes.md,
    minHeight: 60,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  buttonArea: {
    marginLeft: 8,
    justifyContent: 'flex-end',
  },
  sendButton: {
    backgroundColor: Colors.buttonFace,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderTopColor: Colors.borderLight,
    borderLeftColor: Colors.borderLight,
    borderBottomColor: Colors.borderDark,
    borderRightColor: Colors.borderDark,
  },
  sendButtonText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
  },
  
  // Status bar
  statusBar: {
    backgroundColor: Colors.panelBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.borderMid,
  },
  statusBarText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textLink,
  },
});

