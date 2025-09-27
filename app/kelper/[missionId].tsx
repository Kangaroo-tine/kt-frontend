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
  Keyboard,
  type KeyboardEvent, type KeyboardEventName
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from 'expo-router';

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
import TrashIcon from '@/assets/icon/searchBar/trash.svg';
import PlayIcon from '@/assets/icon/searchBar/play.svg';
import PauseIcon from '@/assets/icon/searchBar/pause.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* 나중에 추가할 것
- 타이핑 인디케이터(“AI가 입력 중…”)
- 메세지 시간 그룹화(보낸 메세지의 시간이 똑같으면 두번째부턴 표시X)
*/
const BOX_H = 48;

const Kelper = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  //미션별 라우트 파라미터
  const { missionId, title, detail } = useLocalSearchParams<{
    missionId: string; title?: string; detail?: string;
  }>();
  //채팅방 입장 시각 (고정)
  const entryTimeRef = useRef<Date>(new Date());
  const formatClock = (d: Date) => d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false); //사용자 음성 녹음
  const [isPaused, setIsPaused] = useState(false);   //녹음 일시정지 여부
  const [elapsed, setElapsed] = useState(0);  //녹음 시간
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList<Message>>(null);
  
  //missionId 마다 새로운 켈퍼 채팅방
  useEffect(() => {
    entryTimeRef.current = new Date();
    const t = formatClock(entryTimeRef.current);
    setMessages([
      {
        id: `welcome-${missionId}-${Date.now()}`,
        text: '안녕하세요, 효원님!\n무엇을 도와드릴까요?',
        sender: 'ai',
        timestamp: t,
      },
      {
        id: `task-${missionId}-${Date.now()+1}`,
        text: `할 일 : ${title ?? '제목 없음'}\n\n상세내용\n${detail ?? '상세내용 없음'}`,
        sender: 'ai',
        timestamp: t,
      },
    ]);
  }, [missionId, title, detail]);

  // 키보드 이벤트 리스너 추가
  useEffect(() => {
    const showEvt: KeyboardEventName =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt: KeyboardEventName =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };
    const onHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvt, onShow);
    const hideSub = Keyboard.addListener(hideEvt, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 새 메시지 전송
  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        text,
        sender: 'user',
        timestamp: formatClock(new Date()),
      },
    ]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  //음성 부분
  const SEGMENTS = 25; //진행바 구간 개수
  const MAX_SECONDS = 40; //녹음 시간 (임시 40초)

  //녹음 시간 측정
  useEffect(() => {
    if (!isRecording || isPaused) return;
    const t = setInterval(() => setElapsed((s) => Math.min(s + 1, MAX_SECONDS)), 1000);
    return () => clearInterval(t);
  }, [isRecording, isPaused]);

  //시간 표현
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  //녹음 - 클릭 핸들러들 
  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsed(0);
  };
  const togglePause = () => setIsPaused((p) => !p);
  const resetRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setElapsed(0);
  };
  // "보내기" 버튼 (UI만)
  const sendVoiceMock = () => {
    // 여기서 백엔드 전송/실제 파일 연결 예정
    resetRecording();
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Kelper</Text>
      </View>

      {/* 메인 컨텐츠 영역 */}
      <View style={{ flex: 1 }}>
        {/* 메시지 리스트 */}
        <FlatList<Message>
          ref={flatListRef}
          data={messages} 
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: Platform.OS === 'android' ? 20 : 0 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
        />

        {/* 입력 영역 */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View style={[
            styles.inputContainer,
            Platform.OS === 'android' && keyboardHeight > 0 && { marginBottom: 0 },
            { paddingBottom: insets.bottom }
          ]}>
            {/** 기본메세지입력창 */}
            {!isRecording ? (
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="메시지를 입력해 주세요"
                  placeholderTextColor="#818181ff"
                  multiline
                  maxLength={1000}
                  textAlignVertical="center"
                  onFocus={() => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300)}
                />

                <View style={styles.inputButtons}>
                  <TouchableOpacity
                    style={[styles.micButton, isRecording && styles.micButtonActive]}
                    onPress={startRecording}
                    accessibilityLabel="음성 녹음 시작"
                  >
                    <MicIcon width={18} height={18}/>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
                    onPress={sendMessage}
                    disabled={!inputText.trim()}
                    accessibilityLabel="메시지 보내기"
                  >
                    <SendIcon width={18} height={18}/>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /** 녹음 UI 바 */
              <View style={styles.recordRow}>
                {/* 왼쪽: Trash 칩 (분리된 버튼) */}
                <TouchableOpacity
                  style={styles.trashChip}
                  onPress={resetRecording}
                  accessibilityLabel="녹음 삭제"
                >
                  <TrashIcon width={18} height={18} />
                </TouchableOpacity>

                {/* 오른쪽: 메인 녹음바 */}
                <View style={styles.recordBar}>
                  {/* 재생/일시정지 토글 */}
                  <TouchableOpacity
                    onPress={togglePause}
                    accessibilityLabel={isPaused ? '녹음 다시 시작' : '녹음 일시정지'}
                  >
                    {isPaused ? <PlayIcon width={27} height={27}/> : <PauseIcon width={27} height={27}/>}
                  </TouchableOpacity>

                  {/* 세그먼트 진행바 */}
                  <View style={styles.progressWrap}>
                    {Array.from({ length: SEGMENTS }).map((_, i) => {
                      const ratio = elapsed / MAX_SECONDS;
                      const activeCount = Math.round(SEGMENTS * ratio);
                      const active = i < activeCount;
                      return <View key={i} style={[styles.segment, active && styles.segmentActive,i !== SEGMENTS - 1 && { marginRight: 3 },]} />;
                    })}
                  </View>

                  {/* 타이머 */}
                  <Text style={styles.recordTime}>{formatTime(elapsed)}</Text>

                  {/* 전송 아이콘 */}
                  <TouchableOpacity
                    style={styles.sendIconBtn}
                    onPress={sendVoiceMock}
                    accessibilityLabel="음성 전송"
                  >
                    <SendIcon width={18} height={18} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
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
    gap:4,
  },
  userMessageContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap:4,
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
    borderWidth: 1,
    borderColor:Colors.gray200,
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
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center', 
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 20,
    height: BOX_H,
  },
  textInput: {
    flex: 1,           
    minWidth: 0,     
    flexShrink: 1,   
    ...Typo.body02,
    color: '#333333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  
  // 입력 버튼들 스타일
  inputButtons: {
    flexGrow: 0,     
    flexShrink: 0,    
    flexDirection: 'row',
    gap: 10,
    marginLeft: 8,
  },
  micButton: {
  },
  micButtonActive: {
  },
  sendButton: {
  },
  sendButtonActive: {
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trashChip: {
    width: BOX_H,
    height: BOX_H,          // ★ 높이 통일
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,         // gap 대체
  },
  recordBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 12,
    height: BOX_H,
  },
  progressWrap: {
    flexGrow: 1,
    flexShrink: 1,     
    minWidth: 0,    
    height: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    flex: 1,
    height: 17,
    borderRadius: 3,
    backgroundColor: Colors.gray200,
  },
  segmentActive: {
    backgroundColor: Colors.main400, 
  },
  recordTime: {
    ...Typo.label03,  
    color: Colors.gray300,
    marginLeft:5,
    marginRight:5,
    width: 35,
    textAlign: 'right',
  },
  sendIconBtn: {
    width: 30,
    height: 30,
    marginRight:2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Kelper;