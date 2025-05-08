# Kangaroo-tine 앱에 오신 것을 환영합니다 🦘

이 프로젝트는 [`create-expo-app`](https://www.npmjs.com/package/create-expo-app)으로 생성된 [Expo](https://expo.dev) 기반의 **React Native** 앱입니다.  
**TypeScript**, **Yarn**, **NativeWind**를 사용하여 개발되고 있습니다.

## 시작하기

1. 의존성 설치

   ```bash
   yarn install
   ```

2. 앱 실행

   ```bash
   yarn start
   ```

3. 엑스포 고 실행

   ```bash
   yarn start --tunnel --clear
   ```
   실행 후 나오는 콘솔에서 아래 옵션 중 하나를 선택하여 앱을 실행할 수 있습니다:

   - [개발 빌드](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android 에뮬레이터](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS 시뮬레이터](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go) – 간단한 테스트를 위한 제한된 환경

3. 앱 개발은 `app/` 디렉토리 내부의 파일을 수정하면서 진행하세요.  
   이 프로젝트는 [파일 기반 라우팅](https://docs.expo.dev/router/introduction)을 사용합니다.

## 새 프로젝트로 초기화

스타터 코드를 분리하고 빈 프로젝트를 시작하려면 아래 명령어를 실행하세요:

```bash
yarn reset-project
```

이 명령은 현재 코드를 `app-example` 디렉토리로 이동시키고, 비어있는 `app` 디렉토리를 생성합니다.

## 사용 기술 및 버전 정보

- React Native: **0.79.2**
- Expo SDK: **53**
- React: **19.0.0** → ⚠️ 최신 버전, 일부 라이브러리 호환성 주의
- TypeScript: ~5.8.3
- NativeWind: 2.0.11 + Tailwind CSS 4.1.5
- 라우팅: **expo-router 5.0.6** 사용 (파일 기반 라우팅)

### 특이사항

- `react`와 `react-dom`이 **19.0.0**으로 고정되어 있어 일부 구버전 라이브러리와의 호환성 이슈 주의
- **Expo SDK 53** 기준 설정, Expo Go 앱도 최신 버전 필요
- `nativewind`는 v2 기반이며 `tailwind.config.js`가 구성되어 있어야 동작

## 참고 자료

- [Expo 공식 문서](https://docs.expo.dev/): 기본 개념부터 고급 주제까지 학습 가능
- [Expo 튜토리얼](https://docs.expo.dev/tutorial/introduction/): Android, iOS, Web을 모두 지원하는 앱을 직접 만들어보세요.

## 커뮤니티에 참여하세요

- [Expo GitHub](https://github.com/expo/expo): 오픈소스 플랫폼을 확인하고 기여하기
- [Discord 커뮤니티](https://chat.expo.dev): 질문하고 다른 개발자들과 소통하기

## 폴더 구조

```
Kangaroo-tine/
├── app/                    # 주요 화면 및 라우트 컴포넌트
├── components/             # 재사용 가능한 UI 컴포넌트
├── constants/              # 상수 정의 (키값, 테마 등)
├── context/                # 전역 상태관리 (예: AuthContext)
├── hooks/                  # Custom Hooks
├── navigation/             # 내비게이션 설정
├── scripts/                # 프로젝트 초기화 등 유틸 스크립트
├── assets/                 # 이미지 및 폰트
├── app-example/            # 초기 스타터 예시 (reset-project 시 생성)
├── README.md               # 프로젝트 설명서
├── package.json            # 의존성 및 스크립트 정의
└── ...
```

## GitHub Convention

### Commit Convention

- **[FEAT]** : 새로운 기능 구현
- **[MOD]** : 코드 수정 및 내부 파일 수정
- **[ADD]** : 부수적인 코드 추가 및 라이브러리 추가, 새로운 파일 생성
- **[CHORE]** : 버전 코드 수정, 패키지 구조 변경, 타입 및 변수명 변경 등의 작은 작업
- **[DEL]** : 쓸모없는 코드나 파일 삭제
- **[UI]** : UI 작업
- **[FIX]** : 버그 및 오류 해결
- **[HOTFIX]** : issue나 QA에서 문의된 급한 버그 및 오류 해결
- **[MERGE]** : 다른 브랜치와의 MERGE
- **[MOVE]** : 프로젝트 내 파일이나 코드의 이동
- **[RENAME]** : 파일 이름 변경
- **[REFACTOR]** : 전면 수정
- **[DOCS]** : README나 WIKI 등의 문서 개정

### Branch Convention

- 브랜치 이름: `유형/#이슈번호-작업내용`
  - 예시: `FEAT/#11-login-view-ui`

### PR Convention

- PR 제목: `[유형/#이슈번호] 작업 위치 / 작업 내용`
  - 예시: `[FEAT/#11] 로그인 뷰 / UI 구현`

### Merge Rule

- PR은 **FE팀원 모두에게 승인**을 받은 뒤 머지합니다.
- 머지 커밋 메시지 예시: `[MERGE] #11 -> develop`
