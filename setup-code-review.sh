#!/bin/bash

# 자동 코드리뷰 설정 스크립트
# 사용법: bash setup-code-review.sh

set -e  # 에러 발생 시 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  자동 코드리뷰 설정 스크립트${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. 입력값 받기
echo -e "${YELLOW}📝 필수 정보를 입력해주세요:${NC}\n"

read -p "GitHub 사용자명/조직명: " GITHUB_ORG
if [ -z "$GITHUB_ORG" ]; then
    echo -e "${RED}❌ GitHub 사용자명/조직명은 필수입니다.${NC}"
    exit 1
fi

read -p "GitHub 레퍼지토리명: " REPO_NAME
if [ -z "$REPO_NAME" ]; then
    echo -e "${RED}❌ 레퍼지토리명은 필수입니다.${NC}"
    exit 1
fi

read -p "SonarCloud 프로젝트명 (기본값: $REPO_NAME): " SONAR_PROJECT
SONAR_PROJECT=${SONAR_PROJECT:-$REPO_NAME}

read -p "SonarCloud 조직명: " SONAR_ORG
if [ -z "$SONAR_ORG" ]; then
    echo -e "${RED}❌ SonarCloud 조직명은 필수입니다.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}✅ 입력값:${NC}"
echo "  - GitHub: $GITHUB_ORG/$REPO_NAME"
echo "  - SonarCloud: $SONAR_PROJECT (조직: $SONAR_ORG)"
echo ""

# 2. 디렉토리 구조 생성
echo -e "${BLUE}📁 디렉토리 구조 생성 중...${NC}"
mkdir -p .github/workflows
mkdir -p .github/scripts
echo -e "${GREEN}✅ 디렉토리 생성 완료${NC}\n"

# 3. GitHub workflow 파일 생성
echo -e "${BLUE}📄 GitHub Actions workflow 생성 중...${NC}"
cat > .github/workflows/code-quality.yml << 'EOF'
name: Code Quality

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    types: [opened, synchronize, reopened]

# GitHub Actions 권한 설정
permissions:
  contents: read
  pull-requests: write
  issues: write
  checks: write

jobs:
  sonarcloud:
    name: SonarCloud Analysis
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  greptile-review:
    name: Greptile Code Structure Analysis
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install requests PyGithub

      - name: Run Greptile Review
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GREPTILE_API_KEY: ${{ secrets.GREPTILE_API_KEY }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          python .github/scripts/greptile_review.py

  claude-review:
    name: Claude AI Review
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install anthropic PyGithub

      - name: Run Claude Review
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CLAUDE_API_KEY: ${{ secrets.CLAUDE_API_KEY }}
          GITHUB_REPOSITORY: ${{ github.repository }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
        run: |
          python .github/scripts/claude_review.py
EOF
echo -e "${GREEN}✅ workflow 파일 생성 완료${NC}\n"

# 4. Claude 리뷰 스크립트 생성
echo -e "${BLUE}🤖 Claude AI 리뷰 스크립트 생성 중...${NC}"
cat > .github/scripts/claude_review.py << 'EOF'
#!/usr/bin/env python3
"""
Claude AI 코드 리뷰 스크립트 (GitHub Actions용)
"""
import os
import sys
import json
import anthropic
from github import Github

# 환경 변수
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
REPOSITORY = os.getenv('GITHUB_REPOSITORY')  # owner/repo
PR_NUMBER = int(os.getenv('PR_NUMBER', 0))

def get_pr_diff():
    """PR의 diff 가져오기"""
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPOSITORY)
    pr = repo.get_pull(PR_NUMBER)

    # 파일별 diff 수집
    files = pr.get_files()
    diffs = []

    for file in files:
        if file.patch:  # diff가 있는 파일만
            diffs.append(f"""
### {file.filename}
Status: {file.status}
Changes: +{file.additions} -{file.deletions}
```diff
{file.patch}
```
""")

    return "\n\n".join(diffs), pr

def sanitize_diff(diff):
    """민감 정보 제거"""
    import re

    patterns = [
        (r'(api[_-]?key|token|password|secret)["\']?\s*[:=]\s*["\']([^"\']+)["\']',
         r'\1="***REDACTED***"'),
        (r'Bearer\s+\S+', 'Bearer ***REDACTED***'),
        (r'sk-[a-zA-Z0-9]{48}', 'sk-***REDACTED***'),
    ]

    for pattern, replacement in patterns:
        diff = re.sub(pattern, replacement, diff, flags=re.IGNORECASE)

    return diff

def review_with_claude(diff):
    """Claude로 코드 리뷰"""
    client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)

    sanitized_diff = sanitize_diff(diff)

    prompt = f"""당신은 시니어 개발자입니다. 다음 Pull Request를 리뷰해주세요.

**리뷰 기준:**
1. 🔒 보안: SQL Injection, XSS, 하드코딩된 비밀번호 등
2. 🐛 버그: Null 참조, 예외 처리, 엣지 케이스
3. ⚡ 성능: 비효율적인 알고리즘, 메모리 누수
4. 📖 가독성: 네이밍, 주석, 코드 구조
5. ✨ Best Practice: 디자인 패턴, 원칙 준수

**변경사항:**
{sanitized_diff[:20000]}

**응답 형식:**
각 이슈마다:
- **[심각도]** 파일명 (라인)
- 문제: 구체적으로
- 제안: 코드 예시 포함

심각도: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

마지막에 전체 평가 요약해주세요.
"""

    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )

    return message.content[0].text

def post_review(pr, review_text):
    """PR에 리뷰 코멘트 작성"""
    comment = f"""## 🤖 Claude AI 코드 리뷰

{review_text}

---
<details>
<summary>ℹ️ 리뷰 정보</summary>

- Model: Claude Sonnet 4.5
- Date: {os.popen('date').read().strip()}
- Reviewer: AI Assistant
</details>

*피드백이 도움이 되었다면 👍를 눌러주세요!*
"""

    try:
        pr.create_issue_comment(comment)
        print("✅ Review posted successfully!")
    except Exception as e:
        print(f"⚠️  리뷰 코멘트 작성 실패: {type(e).__name__}")
        print(f"   이유: {str(e)[:200]}")
        print("   (분석 자체는 완료되었습니다)")

def main():
    if not all([GITHUB_TOKEN, CLAUDE_API_KEY, REPOSITORY, PR_NUMBER]):
        print("❌ Missing required environment variables")
        sys.exit(1)

    print(f"📥 Fetching PR #{PR_NUMBER} from {REPOSITORY}...")
    diff, pr = get_pr_diff()

    if not diff:
        print("ℹ️  No code changes to review")
        sys.exit(0)

    print("🤖 Reviewing with Claude AI...")
    review = review_with_claude(diff)

    print("💬 Posting review...")
    post_review(pr, review)

    print("🎉 Done!")

if __name__ == '__main__':
    main()
EOF
chmod +x .github/scripts/claude_review.py
echo -e "${GREEN}✅ Claude AI 리뷰 스크립트 생성 완료${NC}\n"

# 5. Greptile 리뷰 스크립트 생성 (동적으로 owner/name 주입)
echo -e "${BLUE}🔍 Greptile 리뷰 스크립트 생성 중...${NC}"
cat > .github/scripts/greptile_review.py << EOF
#!/usr/bin/env python3
"""
Greptile 코드 리뷰 스크립트 (GitHub Actions용)
코드 구조 및 맥락 기반 분석
"""
import os
import sys
import json
import requests
from github import Github

# 환경 변수
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GREPTILE_API_KEY = os.getenv('GREPTILE_API_KEY')
REPOSITORY = os.getenv('GITHUB_REPOSITORY')  # owner/repo
PR_NUMBER = int(os.getenv('PR_NUMBER', 0))
GREPTILE_API_URL = "https://api.greptile.com/v2"

def get_pr_info():
    """PR 정보 및 변경된 파일 가져오기"""
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPOSITORY)
    pr = repo.get_pull(PR_NUMBER)

    files_info = []
    for file in pr.get_files():
        files_info.append({
            "filename": file.filename,
            "status": file.status,
            "additions": file.additions,
            "deletions": file.deletions,
            "patch": file.patch or ""
        })

    return pr, files_info

def analyze_with_greptile(repository_url, changed_files):
    """Greptile를 사용한 코드 구조 분석"""
    headers = {
        "Authorization": f"Bearer {GREPTILE_API_KEY}",
        "Content-Type": "application/json"
    }

    # 변경된 파일 목록
    file_paths = [f["filename"] for f in changed_files]

    # Greptile 쿼리 (한글 지원)
    queries = [
        f"분석 대상 파일: {', '.join(file_paths[:5])}. 이 파일들의 변경이 전체 아키텍처에 어떤 영향을 미치는지 분석해주세요.",
        "TypeScript 및 React 코드의 타입 안정성과 성능 최적화 측면에서 개선 사항을 제안해주세요.",
        "모듈 간의 의존성 구조를 분석하고 결합도 문제가 있는지 확인해주세요.",
    ]

    analysis_results = []

    for i, query in enumerate(queries):
        try:
            print(f"📍 Greptile 쿼리 {i+1}/{len(queries)} 실행 중...")

            response = requests.post(
                f"{GREPTILE_API_URL}/query",
                headers=headers,
                json={
                    "repositories": [
                        {
                            "remote": "github",
                            "owner": "$GITHUB_ORG",
                            "name": "$REPO_NAME",
                            "branch": "develop"
                        }
                    ],
                    "query": query
                },
                timeout=45
            )

            print(f"   응답 상태: {response.status_code}")

            if response.status_code == 200:
                result = response.json()
                analysis_results.append({
                    "query": query[:80],
                    "response": result.get("response", "응답 없음"),
                    "sources": result.get("sources", [])
                })
                print(f"   ✅ 성공")
            elif response.status_code == 401:
                print(f"   ❌ 인증 실패 (토큰 확인 필요)")
                print(f"   응답: {response.text[:200]}")
            else:
                print(f"   ⚠️  API 오류: {response.status_code}")
                print(f"   응답: {response.text[:200]}")

        except requests.exceptions.Timeout:
            print(f"   ❌ 타임아웃 (30초 초과)")
        except requests.exceptions.RequestException as e:
            print(f"   ❌ 요청 실패: {e}")
        except Exception as e:
            print(f"   ❌ 예상치 못한 오류: {type(e).__name__}: {e}")

    return analysis_results

def format_greptile_review(analysis_results, changed_files):
    """Greptile 분석 결과 포맷팅"""
    review = "## 📊 Greptile 코드 구조 분석\n\n"

    if not analysis_results:
        return review + "분석 결과가 없습니다.\n"

    # 변경 파일 요약
    review += "### 📝 변경된 파일\n"
    for file in changed_files[:10]:
        review += f"- **{file['filename']}** ({file['status']}) +{file['additions']}−{file['deletions']}\n"

    review += "\n### 🔍 구조 분석\n"

    for result in analysis_results:
        review += f"\n#### {result['query']}\n"
        review += f"{result['response'][:500]}\n"

        if result['sources']:
            review += "\n**참고 파일:**\n"
            for source in result['sources'][:3]:
                review += f"- \`{source.get('file', 'unknown')}\`\n"

    return review

def post_review(pr, review_text):
    """PR에 리뷰 코멘트 작성"""
    comment = f"""{review_text}

---
<details>
<summary>ℹ️ Greptile 분석 정보</summary>

- Tool: Greptile AI Code Intelligence
- Purpose: Architecture & Structure Analysis
- Date: {os.popen('date').read().strip()}
</details>
"""

    try:
        pr.create_issue_comment(comment)
        print("✅ Greptile review posted successfully!")
    except Exception as e:
        print(f"⚠️  리뷰 코멘트 작성 실패: {type(e).__name__}")
        print(f"   이유: {str(e)[:200]}")
        print("   (분석 자체는 완료되었습니다)")

def main():
    if not all([GITHUB_TOKEN, GREPTILE_API_KEY, REPOSITORY, PR_NUMBER]):
        print("❌ Missing required environment variables")
        print(f"GITHUB_TOKEN: {bool(GITHUB_TOKEN)}")
        print(f"GREPTILE_API_KEY: {bool(GREPTILE_API_KEY)}")
        print(f"REPOSITORY: {bool(REPOSITORY)}")
        print(f"PR_NUMBER: {PR_NUMBER}")
        sys.exit(1)

    print(f"📥 Fetching PR #{PR_NUMBER} from {REPOSITORY}...")
    pr, files_info = get_pr_info()

    if not files_info:
        print("ℹ️  No code changes to analyze")
        sys.exit(0)

    print("🔍 Analyzing with Greptile...")
    repository_url = f"https://github.com/{REPOSITORY}"
    analysis = analyze_with_greptile(repository_url, files_info)

    print("💬 Formatting and posting review...")
    review = format_greptile_review(analysis, files_info)
    post_review(pr, review)

    print("🎉 Done!")

if __name__ == '__main__':
    main()
EOF
chmod +x .github/scripts/greptile_review.py
echo -e "${GREEN}✅ Greptile 리뷰 스크립트 생성 완료${NC}\n"

# 6. SonarCloud 설정 파일 생성
echo -e "${BLUE}📊 SonarCloud 설정 파일 생성 중...${NC}"
cat > sonar-project.properties << EOF
# sonar-project.properties

# 프로젝트 설정
sonar.projectKey=$SONAR_PROJECT
sonar.projectName=$SONAR_PROJECT
sonar.organization=$SONAR_ORG

# 소스 코드 경로
sonar.sources=src

# 제외할 파일
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.test.js,**/*.spec.ts,**/coverage/**

# JavaScript/TypeScript 설정
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# 언어 설정
sonar.language=ts
EOF
echo -e "${GREEN}✅ SonarCloud 설정 파일 생성 완료${NC}\n"

# 7. 설정 요약
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ 설정이 완료되었습니다!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${YELLOW}📋 다음 단계:${NC}\n"

echo "1️⃣  GitHub Secrets 설정:"
echo "   Repository Settings > Secrets and variables > Actions에서 다음을 추가하세요:"
echo "   - CLAUDE_API_KEY: https://console.anthropic.com/account/keys"
echo "   - SONAR_TOKEN: https://sonarcloud.io/account/security"
echo "   - GREPTILE_API_KEY: https://greptile.com"
echo ""

echo "2️⃣  SonarCloud 프로젝트 생성:"
echo "   - https://sonarcloud.io/projects/create에서 프로젝트 생성"
echo "   - Organization: $SONAR_ORG"
echo "   - Project Key: $SONAR_PROJECT"
echo ""

echo "3️⃣  Git에 추가:"
echo "   git add .github/ sonar-project.properties"
echo "   git commit -m 'Add: 자동 코드리뷰 설정'"
echo "   git push origin develop"
echo ""

echo "4️⃣  PR 생성 후 확인:"
echo "   - SonarCloud Analysis"
echo "   - Greptile Code Structure Analysis"
echo "   - Claude AI Review"
echo ""

echo -e "${GREEN}🎉 모든 준비가 완료되었습니다!${NC}\n"
