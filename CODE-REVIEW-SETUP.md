# 자동 코드리뷰 설정 가이드

이 문서는 다른 프로젝트에서 자동 코드리뷰 시스템을 설정하는 방법을 설명합니다.

## 🚀 빠른 시작

### 1단계: 스크립트 실행

```bash
bash setup-code-review.sh
```

스크립트가 다음을 자동으로 생성합니다:

- `.github/workflows/code-quality.yml` - GitHub Actions workflow
- `.github/scripts/claude_review.py` - Claude AI 리뷰
- `.github/scripts/greptile_review.py` - Greptile 구조 분석
- `sonar-project.properties` - SonarCloud 설정

### 2단계: GitHub Secrets 설정

Repository Settings > Secrets and variables > Actions에서 다음을 추가:

| Secret 이름        | 값              | 출처                                       |
| ------------------ | --------------- | ------------------------------------------ |
| `CLAUDE_API_KEY`   | Claude API 키   | https://console.anthropic.com/account/keys |
| `SONAR_TOKEN`      | SonarCloud 토큰 | https://sonarcloud.io/account/security     |
| `GREPTILE_API_KEY` | Greptile API 키 | https://greptile.com                       |

### 3단계: SonarCloud 프로젝트 생성

1. https://sonarcloud.io/projects/create 방문
2. GitHub를 선택하고 로그인
3. 프로젝트 생성
4. 프로젝트 키와 조직명 확인

### 4단계: Git에 커밋

```bash
git add .github/ sonar-project.properties setup-code-review.sh
git commit -m "Add: 자동 코드리뷰 설정"
git push origin develop
```

### 5단계: PR 생성 후 확인

PR을 생성하면 자동으로 3가지 리뷰가 실행됩니다:

- ✅ SonarCloud Analysis
- ✅ Greptile Code Structure Analysis
- ✅ Claude AI Review

---

## 📋 상세 설정 옵션

### sonar-project.properties 커스터마이징

```properties
sonar.projectKey=your-project-name        # 프로젝트 키
sonar.projectName=your-project-name       # 프로젝트명
sonar.organization=your-organization      # SonarCloud 조직

sonar.sources=src                         # 소스 코드 위치
sonar.exclusions=**/node_modules/**,...   # 제외할 파일

sonar.language=ts                         # 언어 (ts, js 등)
sonar.javascript.lcov.reportPaths=...     # 커버리지 파일
```

### GitHub Actions 권한 설정

`.github/workflows/code-quality.yml`에서:

```yaml
permissions:
  contents: read # 코드 읽기
  pull-requests: write # PR 코멘트 작성
  issues: write # 이슈 코멘트 작성
  checks: write # 체크 상태 업데이트
```

---

## 🔧 커스터마이징

### Claude AI 리뷰 프롬프트 변경

`.github/scripts/claude_review.py`의 `review_with_claude()` 함수에서 `prompt` 변수 수정:

```python
prompt = f"""당신은 시니어 개발자입니다. ...

**리뷰 기준:**
1. 🔒 보안
2. 🐛 버그
...
"""
```

### Greptile 분석 쿼리 변경

`.github/scripts/greptile_review.py`의 `queries` 리스트 수정:

```python
queries = [
    "분석 대상 파일: ...",
    "TypeScript 및 React 코드의...",
    "모듈 간의 의존성 구조를...",
]
```

---

## 🔍 문제 해결

### "Project does not exist" 오류

**원인**: SonarCloud에 프로젝트가 없음

**해결책**:

1. https://sonarcloud.io에서 프로젝트 생성
2. `sonar-project.properties`의 `sonar.projectKey` 확인
3. `sonar.organization` 확인

### "Missing required environment variables" 오류

**원인**: GitHub Secrets이 설정되지 않음

**해결책**:

1. Repository Settings > Secrets and variables > Actions 확인
2. `CLAUDE_API_KEY`, `SONAR_TOKEN`, `GREPTILE_API_KEY` 추가

### "Resource not accessible by integration" 오류

**원인**: GitHub Actions 권한 부족

**해결책**:

1. `.github/workflows/code-quality.yml`에 `permissions` 섹션 확인
2. `pull-requests: write`, `issues: write` 설정 확인

---

## 📊 자동화된 파이프라인

```
PR 생성
  │
  ├─ 1️⃣ SonarCloud Analysis
  │   └─ 정적 분석 (GitHub 체크)
  │
  ├─ 2️⃣ Greptile Code Structure
  │   └─ 아키텍처 분석 (PR 코멘트)
  │
  └─ 3️⃣ Claude AI Review
     └─ 종합 리뷰 (PR 코멘트, 한글)
```

---

## 📚 추가 리소스

- [Claude API 문서](https://docs.anthropic.com/)
- [SonarCloud 문서](https://docs.sonarcloud.io/)
- [Greptile 문서](https://docs.greptile.com/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

---

## 💡 팁

1. **local 테스트**: 스크립트를 로컬에서 먼저 실행해보세요
2. **점진적 추가**: 한 번에 한 가지 리뷰 도구만 추가하기
3. **모니터링**: 첫 PR에서 로그를 자세히 확인하기
4. **커스터마이징**: 팀의 규칙에 맞게 프롬프트 수정하기

---

**질문이나 이슈**: 프로젝트 이슈 탭에서 보고하세요!
