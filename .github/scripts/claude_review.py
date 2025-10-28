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
