import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from 'expo-router';

//데이터 타입
import { Message } from '@/types/message';
//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';
//아이콘
import AiProfileIcon from '@/assets/icon/dependent/kelper.svg';
import MicIcon from '@/assets/icon/searchBar/mic.svg';
import SendIcon from '@/assets/icon/searchBar/send.svg';
import BackIcon from '@/assets/icon/arrow/back_arrow.svg';

const Kelper = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요, 효원님!\n오늘은 무엇을 도와드릴까요?',
      sender: 'ai',
      timestamp: '00:00',
    },
    {
      id: '2',
      text: '할 일 : 세탁기돌리기\n\n상세내용\n세탁기 전원버튼을 킨다.\n세제를 넣는다\n삼유유연제를 넣는다\n표준세탁을 다이얼을 돌려서 선택한다.\n시작버튼을 선택한다\n세탁기가 잘 돌아가고 있는지 확인한다.',
      sender: 'ai',
      timestamp: '00:00',
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const navigation = useNavigation();

  // 새 메시지 전송
  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // 스크롤을 맨 아래로
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // 음성 녹음 토글
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // 실제 음성 인식 로직은 여기에 구현
  };

  // 메시지 렌더링
  const renderMessage = ({ item } : { item: Message } ) => {
    const isAI = item.sender === 'ai';
    
    return (
      <View style={[styles.messageContainer, isAI ? styles.aiMessageContainer : styles.userMessageContainer]}>
        {isAI && (
          <View style={styles.aiProfileContainer}>
            <AiProfileIcon width={43} height={37} />
          </View>
        )}
        
        <View style={[styles.messageBubble, isAI ? styles.aiMessageBubble : styles.userMessageBubble]}>
          <Text style={[styles.messageText, isAI ? styles.aiMessageText : styles.userMessageText]}>
            {item.text}
          </Text>
        </View>
        
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Kelper</Text>
      </View>

      {/* 메시지 리스트 */}
      <FlatList<Message>
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 입력 영역 */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="메시지를 입력해 주세요"
              placeholderTextColor="#999999"
              multiline
              maxLength={1000}
            />
            
            <View style={styles.inputButtons}>
              <TouchableOpacity 
                style={[styles.micButton, isRecording && styles.micButtonActive]}
                onPress={toggleRecording}
              >
                <MicIcon width={16} height={16}/>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <SendIcon width={16} height={16} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // 헤더 스타일
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight : 12,
  },
  headerTitle: {
    ...Typo.heading04,
    color : Colors.gray800,
  },
  // 메시지 리스트 스타일
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  // 메시지 컨테이너 스타일
  messageContainer: {
    marginBottom: 16,
  }, 
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  
  // AI 프로필 스타일
  aiProfileContainer: {
    marginRight: 12,
    marginTop: 4,
  },

  // 메시지 버블 스타일
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  aiMessageBubble: {
    backgroundColor: Colors.main100,
    borderBottomLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: Colors.gray0,
    borderBottomRightRadius: 4,
  },
  
  // 메시지 텍스트 스타일
  messageText: {
    ...Typo.label02,
  },
  aiMessageText: {
    color: Colors.main900,
  },
  userMessageText: {
    color: Colors.gray900,
  },
  
  // 타임스탬프 스타일
  timestamp: {
    ...Typo.label03,
    color : Colors.gray300,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
 
  // 입력 영역 스타일
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 40,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  
  // 입력 버튼들 스타일
  inputButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
  },
});

export default Kelper;