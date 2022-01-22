# 일기

## 사용 기술

- Next
- React Query
- Chakra UI

### 구조

- pases/[component].tsx
  - SSR을 위한 초기 데이터 주입을 위해 `**Service()` 를 호출하도록 지시
  - 인증 등이 필요한 경우 쿠키 값 등을 파라미터로 주입하여 백엔드 API서버에 성공적으로 릴레이 될 수 있도록 구성
- repo/\*.tsx
  - 클라이언트에서 API Call을 해 주는 부분
    - react-query에 의해 호출되어 값을 업데이트 해 줄 수 있다.
- pages/api/\*.tsx

  - 클라이언트에서 API Call을 받는 부분
  - 내부적으로 `**Service()`를 호출하게 되어 SSR시 데이터를 얻는 부분과 로직이 중복되지 않도록 구성

- types/index.ts
  - 서버 & 클라이언트에 필요한 인자 및 데이터 타입을 정의해 놓음.
  - 기본 데이터 구조는 Atom으로 구성
  - 서비스 함수의 입출력 타입
  - API 호출 (클라이언트)의 입출력 타입
