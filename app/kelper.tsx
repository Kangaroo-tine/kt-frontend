import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  type KeyboardEvent,
  type KeyboardEventName,
} from 'react-native';
console.log('📍 kelper 렌더링');
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';

//아이콘
import BackIcon from '@/assets/icon/arrow/back_arrow.svg';
import AiProfileIcon from '@/assets/icon/dependent/kelper.svg';
import SendIcon from '@/assets/icon/searchBar/send.svg';
import ChevronIcon from '@/assets/icon/chevron.svg';
//6개 이유 아이콘
import MotiveIcon from '@/assets/icon/kelper_reason/motive.svg';
import AmbivalenceIcon from '@/assets/icon/kelper_reason/ambivalence.svg'; 
import NegativeIcon from '@/assets/icon/kelper_reason/negative.svg';
import ProcrastIcon from '@/assets/icon/kelper_reason/procrast.svg'; 
import PlanIcon from '@/assets/icon/kelper_reason/plan.svg';
import RewardIcon from '@/assets/icon/kelper_reason/reward.svg';

//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

//데이터 타입
import { Message } from '@/types/message';


const BOX_H = 48;

// 더미 메인골
const DUMMY_MAIN_GOALS = [
  { id: 'g1', label: '요가 고수되기' },
  { id: 'g2', label: '일본어 프리토킹 하기' },
  { id: 'g3', label: '다이어트 성공' },
];

// 이유 선택(고정) + 모드 매핑
type ReasonId = 'motivation' | 'ambivalence' | 'negative' | 'procrast' | 'plan' | 'no_reward';
type Mode = 'CBT' | 'MI' | 'EXEC'; // 실행지원 = EXEC
const REASONS: {
  id: ReasonId;
  label: string;
  Icon: React.FC<SvgProps>; 
  mode: Mode;
}[] = [
  { id: 'motivation', label: '동기 부족', Icon: MotiveIcon, mode: 'MI' },
  { id: 'ambivalence', label: '양가감정', Icon: AmbivalenceIcon, mode: 'MI' },
  { id: 'negative', label: '부정적 생각', Icon: NegativeIcon, mode: 'CBT' },
  { id: 'procrast', label: '미루는 습관', Icon: ProcrastIcon, mode: 'CBT' },
  { id: 'plan', label: '계획/단계 부족', Icon: PlanIcon, mode: 'EXEC' },
  { id: 'no_reward', label: '즉각적 보상 없음', Icon: RewardIcon, mode: 'EXEC' },
];

const modeLabel = (m: Mode) =>
  m === 'CBT' ? 'CBT 모드' : m === 'MI' ? 'MI 모드' : '실행 지원 모드';

const Kelper = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const entryTimeRef = useRef<Date>(new Date());
  const formatClock = (d: Date) =>
    d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

  const [messages, setMessages] = useState<Message[]>([]); 
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList<Message>>(null);

  const [selectedMainGoalId, setSelectedMainGoalId] = useState<string | null>(null); // 메인골 단일 선택 상태
  const [reasonOpen, setReasonOpen] = useState(false); // 메인골 선택되면 true로
  const [selectedReasonId, setSelectedReasonId] = useState<ReasonId | null>(null); // 이유 선택
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null); // 모드

  // 키보드 핸들링
  useEffect(() => {
    const showEvt: KeyboardEventName = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt: KeyboardEventName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

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

  // 텍스트 전송
  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), text, sender: 'user', timestamp: formatClock(new Date()) },
    ]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // 메인골 선택 (단일 선택)
  const onSelectMainGoal = (goalId: string) => {
    setSelectedMainGoalId(goalId);
    const g = DUMMY_MAIN_GOALS.find((x) => x.id === goalId);
    sendSelectedMainGoalToServer(g?.id ?? null, g?.label ?? null);

    setReasonOpen(false);   //처음 상태는 토글 오프
    setSelectedReasonId(null);
    setSelectedMode(null);
  };

  // 선택된 메인골 - 백엔드 전송용 빈 함수 (TODO)
  const sendSelectedMainGoalToServer = async (goalId: string | null, goalLabel: string | null) => {
    // TODO: await api.kelper.setMainGoal({ goalId, goalLabel });
  };

  // 이유 선택 (단일 선택)
  const onSelectReason = (rid: ReasonId) => {
    if (selectedReasonId) return; // 이미 선택되면 변경 불가 (필요 시 제거)
    const r = REASONS.find((x) => x.id === rid)!;
    setSelectedReasonId(r.id);
    setSelectedMode(r.mode);
    setReasonOpen(false); // 접기
    sendSelectedReasonToServer(r.id, r.mode);
  };
  // 선택된 이유 - 백엔드 전송용 빈 함수 (TODO)
  const sendSelectedReasonToServer = async (reasonId: ReasonId, mode: Mode) => {
    // TODO: await api.kelper.setReason({ reasonId, mode });
  };

  // 메시지 렌더
  const renderMessage = ({ item }: { item: Message }) => {
    const isAI = item.sender === 'ai';
    return (
      <View
        style={[
          styles.messageContainer,
          isAI ? styles.aiMessageContainer : styles.userMessageContainer,
        ]}
      >
        {isAI && (
          <View style={styles.aiProfileContainer}>
            <AiProfileIcon width={39}/>
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

  // 메인골 선택 버블 (처음에 항상 노출)
  const GoalPickerBubble = () => {
    const ts = formatClock(entryTimeRef.current);
    return (
      <View style={[styles.messageContainer, styles.aiMessageContainer]}>
        <View style={styles.aiProfileContainer}>
          <AiProfileIcon width={39}/>
        </View>

        <View style={[styles.goalBubble, styles.aiMessageBubble]}>
          <Text style={[styles.messageText, styles.aiMessageText, { marginBottom: 12 }]}>
            AI Kelper와 이야기 나누고 싶은{'\n'}메인 골을 골라주세요.
          </Text>
          {DUMMY_MAIN_GOALS.map((g) => {
            const active = selectedMainGoalId === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => onSelectMainGoal(g.id)}
                activeOpacity={0.9}
                style={[styles.goalOption, active && styles.goalOptionActive]}
              >
                <Text style={[styles.goalOptionText, active && styles.goalOptionTextActive]} numberOfLines={2} ellipsizeMode="tail">
                  {g.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.timestamp}>{ts}</Text>
      </View>
    );
  };

  const ReasonPickerBubble = () => {
    if (!selectedMainGoalId) return null;
    const ts = formatClock(new Date());
    const selected = REASONS.find((r) => r.id === selectedReasonId);
    return (
      <View style={[styles.messageContainer, styles.aiMessageContainer]}>
        <View style={styles.aiProfileContainer}>
          <AiProfileIcon width={39}/>
        </View>

        <View style={[styles.reasonBubble, styles.aiMessageBubble]}>
          <Text style={[styles.messageText, styles.aiMessageText, { marginBottom: 12 }]}>
            지금 목표 달성에 어려움을 겪는 이유를{'\n'}선택해주세요.
          </Text>

          {/* 박스 전체 */}
          <View
            style={[
              styles.dropdownBox,
              selectedReasonId && styles.dropdownBoxSelected,
            ]}
          >
            {/* 항상 보이는 "헤더 행" (이유 선택 기본값/선택값 + 화살표) */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.dropdownHeaderRow}
              onPress={() => {
                if (selectedReasonId) return;  // 선택 완료 후 토글 비활성 (원하면 제거)
                setReasonOpen((p) => !p);
              }}
            >
              <View style={styles.headerLeft}>
                {selected ? (
                  <>
                    <selected.Icon width={18} height={18} />
                    <Text style={styles.reasonText}>{selected.label}</Text>
                  </>
                ) : (
                  <Text style={[styles.reasonText, { color: Colors.gray300 }]}>
                    이유 선택
                  </Text>
                )}
              </View>
              <ChevronIcon
                width={12}
                height={12}
                style={{ transform: [{ rotate: reasonOpen ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {/* 열렸을 때에만 나오는 리스트 (헤더 아래로) */}
            {reasonOpen && !selectedReasonId && (
              <View style={styles.dropdownList}>
                {REASONS.map(({ id, label, Icon }, idx) => (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.reasonRow,
                      idx < REASONS.length - 1 && styles.rowDivider,
                    ]}
                    onPress={() => onSelectReason(id)}
                  >
                    <Icon width={18} height={18} />
                    <Text style={styles.reasonText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        <Text style={styles.timestamp}>{ts}</Text>
      </View>
    );
  };


  // 모드 전환 안내 버블 + 칩
  const ModeIntroBubble = () => {
    if (!selectedMode || !selectedReasonId) return null;
    const ts = formatClock(new Date());

    const introText =
      selectedMode === 'CBT'
        ? '지금 선택하신 이유는 부정적인 생각과 관련된 부분이에요. 자동적 사고를 점검하고 새로운 관점을 세울 수 있도록 돕는 CBT 모드로 전환할게요.'
        : selectedMode === 'MI'
        ? '선택하신 이유는 동기/양가감정과 관련이 있어요. 스스로의 동기를 탐색하도록 돕는 MI 모드로 전환할게요.'
        : '계획/실행을 도와드릴게요. 구체적 단계와 즉시 보상 설계를 도와주는 실행 지원 모드로 전환할게요.';

    return (
      <View style={[styles.messageContainer, styles.aiMessageContainer]}>
        <View style={styles.aiProfileContainer}>
          <AiProfileIcon width={39}/>
        </View>
        <View style={[styles.messageBubble, styles.aiMessageBubble]}>
          <Text style={[styles.messageText, styles.aiMessageText]}>{introText}</Text>
        </View>
        <Text style={styles.timestamp}>{ts}</Text>
      </View>
    );
  };
  const ModeChipStandalone = () => {
    if (!selectedMode) return null;
    const label = selectedMode === 'CBT' ? 'CBT 모드' : selectedMode === 'MI' ? 'MI 모드' : '실행 지원 모드';
    return (
      <View style={styles.modeChipWrapper}>
        <View style={styles.modeChip}>
          <Text style={styles.modeChipText}>{label}</Text>
        </View>
      </View>
    );
  };

  // kelper 입장 시 고정으로 보내지는 버블들
  const HeaderBubbles = () => {
    return (
      <View>
        <GoalPickerBubble />
        <ReasonPickerBubble />
        <ModeIntroBubble />
        <ModeChipStandalone />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <BackIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Kelper</Text>
      </View>

      {/* 메인 컨텐츠 */}
      <View style={{ flex: 1 }}>
        {/* 메시지 리스트 */}
        <FlatList<Message>
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={[styles.messagesContent, { paddingBottom: Platform.OS === 'android' ? 20 : 0 }]}
          ListHeaderComponent={HeaderBubbles}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: 10 }}
        />

        {/* 입력 영역 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View
            style={[
              styles.inputContainer,
              Platform.OS === 'android' && keyboardHeight > 0 && { marginBottom: 0 },
              { paddingBottom: insets.bottom },
            ]}
          >
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
                  style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
                  onPress={sendMessage}
                  disabled={!inputText.trim()}
                  accessibilityLabel="메시지 보내기"
                >
                  <SendIcon width={18} height={18} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  backButton: { marginRight: 12 },
  headerTitle: { ...Typo.heading04, color: Colors.gray800 },
  // 리스트
  messagesList: { flex: 1 },
  messagesContent: { paddingHorizontal: 15, paddingBottom: 12 },

  // 공통 메시지 레이아웃
  messageContainer: { marginBottom: 16 },
  aiMessageContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  userMessageContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 4,
  },
  aiProfileContainer: { marginRight: 12, marginTop: 4 },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  aiMessageBubble: { 
    backgroundColor: Colors.main100, borderBottomLeftRadius: 4 },
  userMessageBubble: {
    backgroundColor: Colors.gray0,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderBottomRightRadius: 4,
  },

  messageText: { ...Typo.label02 },
  aiMessageText: { color: Colors.main900 },
  userMessageText: { color: Colors.gray900 },

  timestamp: {
    ...Typo.label03,
    color: Colors.gray300,
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  // 입력창
  inputContainer: {
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.gray0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray0,
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
    color: Colors.gray300,
    paddingVertical: 8,
  },
  inputButtons: { flexDirection: 'row', marginLeft: 8 },
  sendButton: {},
  sendButtonActive: {},

  // 메인골 선택 전용 스타일
  goalBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    borderRadius: 12,
  },
  goalOption: {
    backgroundColor: Colors.gray0,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  goalOptionActive: {
    borderColor: Colors.main500,
    shadowOpacity: 0.15,
    elevation: 2,
  },
  goalOptionText: { ...Typo.body02, 
    color: Colors.gray300 },
  goalOptionTextActive: { color: Colors.main900 },

  // 이유 선택 버블
  reasonBubble: {
    width: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  // 드롭다운 박스 전체
  dropdownBox: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dropdownBoxSelected: {
    borderColor: Colors.main500,
  },
  dropdownHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownList: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },   
  reasonText: {
    ...Typo.body02,
    color: Colors.gray900,
    flexShrink: 1,
  },
  // 모드 칩
  modeChipWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  modeChip: {
    backgroundColor: Colors.gray200, // 연한 회색 배경
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  modeChipText: {
    ...Typo.label03,
    color: Colors.gray500,
  },
});

export default Kelper;