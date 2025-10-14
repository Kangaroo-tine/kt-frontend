import React , { useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

//아이콘
import BackArrow from '@/assets/icon/arrow/back_arrow.svg';
import NextArrow from '@/assets/icon/arrow/next_arrow.svg';
import DownArrow from '@/assets/icon/arrow/down_arrow.svg';
import WithdrawIllust from '@/assets/GUI/withdraw_account.svg';

//컴포넌트
import ReusableModal from "@/components/shared/ReusableModal"; 
import { AuthService } from '@/services/auth/authService';

const REASONS: {
  id: string;
  label: string;
}[] = [
  { id: '1', label: '필요한 기능이 없어요'},
  { id: '2', label: '도움이 되지 않아요'},
  { id: '3', label: '이용이 어려워요'},
  { id: '4', label: '피드백이 느려요'},
  { id: '5', label: '기타'},
];

export default function Withdraw() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  //탈퇴하기 모달
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  //모달에서 탈퇴하기 버튼 눌렀을 때 핸들러
  const handleWithdraw = async () => {
    if (isWithdrawing) {
      console.log('[Withdraw] Withdrawal already in progress');
      return;
    }

    try {
      setIsWithdrawing(true);
      console.log('[Withdraw] Sending withdraw request');
      const response = await AuthService.withdraw();
      console.log('[Withdraw] withdraw response:', JSON.stringify(response));

      await AuthService.logout();
      setWithdrawModalVisible(false);

      Alert.alert(
        '탈퇴 완료',
        response?.message || '탈퇴가 성공적으로 처리되었습니다.',
        [
          {
            text: '확인',
            onPress: () => router.replace('/(onboarding)/step0'),
          },
        ],
      );
    } catch (error) {
      console.error('[Withdraw] withdraw failed:', error);
      const message =
        error instanceof Error
          ? error.message
          : '탈퇴 처리 중 문제가 발생했습니다.';
      Alert.alert('탈퇴 실패', message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // 이유 선택 상태
  const [reasonOpen, setReasonOpen] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);
  const selected = REASONS.find((r) => r.id === selectedReasonId);

  const onSelectReason = (rid: string) => {
    setSelectedReasonId(rid);
    setReasonOpen(false);
    sendSelectedReasonToServer(rid);
  };
  const sendSelectedReasonToServer = async (rid: string) => {
    // TODO: API 연동
    console.log("선택된 이유:", rid);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <BackArrow width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>탈퇴하기</Text>
      </View>

      {/* 본문 */}
      <View style={styles.content}>
        {/* 일러스트 */}
        <WithdrawIllust style={styles.illust} />
        {/* 설명 텍스트 */}
        <View style={styles.reasonWrapper}>
          <Text style={styles.descText}>
            탈퇴를 결심하게 된 이유를 알려주세요
          </Text>
          {/* 이유 선택 박스 */}
          <View
            style={[
              styles.dropdownBox,
              selectedReasonId && styles.dropdownBoxSelected,
            ]}
          >
            {/* 기본 이유 리스트 (이유 선택 기본값/선택값 + 화살표) */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.dropdownHeaderRow}
              onPress={() => {
                setReasonOpen((prev) => !prev);
              }}
            >
              <Text
                style={[
                  styles.reasonText,
                  !selected && { color: Colors.gray300 },
                ]}
              >
                {selected ? selected.label : "이유를 선택해 주세요"}
              </Text>
              <DownArrow
                width={20}
                height={20}
                style={{
                  transform: [{ rotate: reasonOpen ? "180deg" : "0deg" }],
                }}
              />
            </TouchableOpacity>

            {/* 이유 토글 열렸을 때에만 나오는 이유들 리스트 */}
            {reasonOpen && (
              <View style={styles.dropdownList}> 
                {REASONS.map(({id, label}, idx) => (
                  <TouchableOpacity
                    key={id}
                    style={[
                      styles.reasonRow,
                      idx < REASONS.length - 1 && styles.rowDivider,
                    ]}
                    onPress={() => onSelectReason(id)}
                  >
                    <Text style={styles.reasonText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )} 
          </View>
        </View>
      </View>

      {/* 버튼 영역 */}
      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          style={[styles.buttonHalf, 
            { backgroundColor: Colors.gray100, marginRight: 8 },]}
          onPress={() => setWithdrawModalVisible(true)}
        >
          <Text style={[Typo.heading03, { color: Colors.gray500 }]}>
            탈퇴하기
          </Text>
        </TouchableOpacity>
      
        <TouchableOpacity
          style={[styles.buttonHalf, { backgroundColor: Colors.main600 }]}
          onPress={() => router.back()}
        >
          <Text style={[Typo.heading03, { color: Colors.gray900 }]}>
            취소
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탈퇴하기 모달 */}
      <ReusableModal
        isVisible={withdrawModalVisible}
        title="탈퇴 하시겠어요?"
        subtitle="모든 게시물에 대한 권한이 없어집니다"
        cancelText="탈퇴하기"
        confirmText="돌아가기"
        onCancel={handleWithdraw}  // → 탈퇴핸들러
        onConfirm={() => {
          if (!isWithdrawing) {
            setWithdrawModalVisible(false);
          }
        }} // → 돌아가기 누르면 모달 닫힘
      />
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

  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  illust: {
    marginVertical: 28,
  },
  reasonWrapper: {
    width: '80%',
    gap:10,
  },
  descText: {
    ...Typo.body02,
    color: Colors.gray900,
  },
  // 드롭다운 박스 전체
  dropdownBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.gray200,
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
    ...Typo.heading04,
    color: Colors.gray500,
    flexShrink: 1,
  },

  bottomButtonWrapper: {
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonHalf: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
