import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography, Emoticons } from '../constants/theme';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them' | 'system';
  timestamp: Date;
}

interface ChatBubbleProps {
  message: Message;
}

// Replace MSN-style emoticon codes with emojis
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

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isMe = message.sender === 'me';
  const isSystem = message.sender === 'system';
  
  if (isSystem) {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isMe ? styles.containerMe : styles.containerThem]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.text, isMe ? styles.textMe : styles.textThem]}>
          {replaceEmoticons(message.text)}
        </Text>
      </View>
      <Text style={[styles.timestamp, isMe ? styles.timestampMe : styles.timestampThem]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    maxWidth: '80%',
  },
  containerMe: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  containerThem: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: Colors.chatBubbleSent,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.chatBubbleReceived,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: Typography.fontSizes.md,
    lineHeight: 20,
  },
  textMe: {
    color: Colors.textPrimary,
  },
  textThem: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  timestampMe: {
    marginRight: Spacing.xs,
  },
  timestampThem: {
    marginLeft: Spacing.xs,
  },
  systemContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    marginVertical: Spacing.sm,
  },
  systemText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});
