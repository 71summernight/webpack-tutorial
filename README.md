# 🎬 Movie App

TMDB API를 활용한 영화 정보 제공 웹 애플리케이션

## 🌐 배포 환경

| 환경       | URL                                    | 설명           |
| ---------- | -------------------------------------- | -------------- |
| Production | https://d30jeeksrrdvnl.cloudfront.net/ | CloudFront CDN |

> **참고:** 프로덕션 환경은 자동 배포됩니다 (`feature/hyunjin` 브랜치 push 시)

## ✨ 주요 기능

- 🎥 **영화 목록**: 인기, 현재 상영, 높은 평점, 개봉 예정 영화 조회
- 🔍 **영화 검색**: 제목으로 영화 검색
- 📄 **상세 정보**: 영화 상세 정보 및 포스터 확인

## 🛠️ 기술 스택

### Core

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Webpack 5** - 모듈 번들러

### 상태 관리 & 데이터 페칭

- **TanStack Query (React Query)** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리
- **Axios** - HTTP 클라이언트

### 라우팅 & 스타일링

- **React Router v7** - SPA 라우팅
- **Tailwind CSS** - 유틸리티 CSS 프레임워크

### 개발 도구

- **ESLint** + **Prettier** - 코드 품질 관리
- **Husky** + **lint-staged** - Git 훅 자동화
- **Babel** - 트랜스파일러

## 📦 설치 및 실행

### 필수 요구사항

- Node.js `^23.7.0`
- pnpm `10.18.2`

### 환경 변수 설정

1. `.env.example` 파일을 복사하여 `.env.development`, `.env.production` 생성:

```bash
cp .env.example .env.development
cp .env.example .env.production
```

2. 각 파일에 TMDB API 토큰 입력:

```env
TMDB_API_TOKEN=your_api_token_here
TMDB_BASE_URL=https://api.themoviedb.org/3
```

> TMDB API 토큰은 [TMDB 설정](https://www.themoviedb.org/settings/api)에서 발급받을 수 있습니다.

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 개발 모드로 실행 (http://localhost:3000)
pnpm dev

# 또는
pnpm start
```

### 프로덕션 빌드

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 모드로 로컬 실행
pnpm start:prod
```

### 타입 체크

```bash
pnpm type-check
```

## 📁 프로젝트 구조

```
src/
├── app/              # 앱 진입점 및 라우팅 설정
├── entities/         # 도메인 엔티티 (영화)
├── features/         # 기능별 컴포넌트
│   ├── detail/       # 영화 상세 페이지
│   ├── list/         # 영화 목록 페이지
│   └── search/       # 검색 페이지
├── shared/           # 공통 컴포넌트 및 유틸리티
│   ├── api/          # API 클라이언트 및 설정
│   ├── components/   # 재사용 가능한 컴포넌트
│   ├── hooks/        # 커스텀 훅
│   └── ui/           # UI 컴포넌트
├── styles/           # 전역 스타일
└── widgets/          # 레이아웃 위젯 (헤더 등)
```

## 🚀 성능 최적화

- ✅ **Lazy Loading**: IntersectionObserver를 활용한 이미지 지연 로딩
- ✅ **Code Splitting**: React.lazy()를 활용한 코드 분할
- ✅ **브라우저 캐싱**: 이미지 및 리소스 브라우저 캐시 활용
- ✅ **번들 최적화**: Terser 및 CSS Minimizer로 번들 크기 최소화
- ✅ **CLS 개선**: Placeholder 및 고정 높이로 레이아웃 시프트 방지
- ✅ **리소스 힌트**: preconnect를 통한 DNS/TCP 미리 연결

## 🏗️ 배포

GitHub Actions를 통해 자동 배포됩니다:

- `main` 브랜치에 push 시 자동으로 S3에 업로드
- CloudFront를 통해 CDN 제공

## 📄 라이선스

ISC

## 🤝 기여

이 프로젝트는 학습 목적으로 제작되었습니다.
