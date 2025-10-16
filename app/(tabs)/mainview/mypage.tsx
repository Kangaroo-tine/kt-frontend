//아이콘
import NextArrow from '@/assets/icon/arrow/next_arrow.svg';
import AlarmIcon from '@/assets/icon/blackline_icon/alarm.svg';
import AtIcon from '@/assets/icon/blackline_icon/at.svg';
import BookIcon from '@/assets/icon/blackline_icon/book.svg';
import MegaphoneIcon from '@/assets/icon/blackline_icon/megaphone.svg';
//세부 메뉴 아이콘
import PortraitIcon from '@/assets/icon/blackline_icon/portrait.svg';
//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

import React, { useEffect, useState } from 'react';

import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';
import { SvgProps } from 'react-native-svg';
import { AuthService } from '@/services/auth/authService';
import type { ProfileResponseResult } from '@/types/auth';

type MenuItemProps = {
  icon: React.FC<SvgProps>;
  label: string;
  onPress?: () => void;
};

const MenuItem = ({ icon: Icon, label, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Icon width={14} height={14} style={{ marginRight: 5 }} />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <NextArrow width={15} height={15} />
  </TouchableOpacity>
);

//dependent 마이페이지 구현
const MyPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await AuthService.fetchProfile();
        if (!isMounted) {
          return;
        }
        const result = response?.result ?? null;
        setProfile(result);
        setImageError(false);
        console.log('[MyPage] Profile fetched:', JSON.stringify(result));
      } catch (err) {
        if (!isMounted) {
          return;
        }
        console.error('[MyPage] Failed to fetch profile:', err);
        const message =
          err instanceof Error ? err.message : '프로필 정보를 불러오지 못했습니다.';
        setError(message);
        setProfile(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const userName = profile?.nickname ?? '알 수 없는 사용자';
  const userEmail = profile?.email ?? '이메일 정보가 없습니다.';
  const profileImageUrl =
    profile?.profileImageUrl && !imageError ? profile.profileImageUrl : undefined;

  useEffect(() => {
    setImageError(false);
  }, [profile?.profileImageUrl]);

  //가장 바깥을 SafeAreaView로 감쌀지 고민 중. 일단 테스트 해보고 비교해보자.
  return (
    <View style={styles.container}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profileImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>
                {userName ? userName.charAt(0) : '?'}
              </Text>
            </View>
          )}
        </View>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.main600} />
        ) : (
          <>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
            {error ? (
              <Text style={styles.profileError}>{error}</Text>
            ) : null}
          </>
        )}
      </View>
      {/* MY 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MY</Text>
        <View style={styles.box}>
          <MenuItem
            icon={PortraitIcon}
            label="프로필 수정"
            onPress={() => router.push('../mypages/profile/edit')}
          />
          <MenuItem icon={AtIcon} label="계정 관리" onPress={() => router.push('../mypages/account/manage')} />
          <MenuItem
            icon={AlarmIcon}
            label="푸시 알림 동의"
            onPress={() => { }}
          />
        </View>
      </View>
      {/* 지원 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>지원</Text>
        <View style={styles.box}>
          <MenuItem icon={MegaphoneIcon} label="문의하기" />
          <MenuItem
            icon={BookIcon}
            label="서비스 이용 약관"
            onPress={() => { }}
          />
          <MenuItem icon={BookIcon} label="개인정보 처리방침" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingTop: 32,
    paddingBottom: 20,
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  profileImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
  },
  profileInitial: {
    ...Typo.heading02,
    color: Colors.gray600,
  },
  profileName: {
    ...Typo.heading02,
    color: Colors.gray500,
    marginBottom: 8,
  },
  profileEmail: {
    ...Typo.label02,
    color: Colors.gray300,
    marginTop: 4,
  },
  profileError: {
    ...Typo.label03,
    color: Colors.main600,
    marginTop: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...Typo.label01,
    color: Colors.gray500,
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    ...Typo.body02,
    color: Colors.gray900,
  },
});

export default MyPage;
