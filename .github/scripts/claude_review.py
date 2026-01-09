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

def get_previous_reviews(pr):
    """이전 Claude 리뷰 코멘트 가져오기"""
    previous_reviews = []

    try:
        comments = pr.get_issue_comments()
        for comment in comments:
            # Claude AI 리뷰 코멘트만 필터링
            if "🤖 Claude AI 코드 리뷰" in comment.body:
                # 코멘트 본문에서 실제 리뷰 내용만 추출 (메타 정보 제외)
                review_body = comment.body.split("---")[0]  # 첫 번째 구분선 이전 내용만
                previous_reviews.append({
                    'date': comment.created_at.strftime('%Y-%m-%d'),
                    'content': review_body[:1000]  # 최대 1000자로 제한
                })
    except Exception as e:
        print(f"⚠️  이전 리뷰 가져오기 실패: {e}")
        # 실패해도 계속 진행

    return previous_reviews

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

def review_with_claude(diff, previous_reviews):
    """Claude로 코드 리뷰"""
    client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)

    sanitized_diff = sanitize_diff(diff)

    # 이전 리뷰 컨텍스트 구성
    previous_context = ""
    if previous_reviews:
        previous_context = "\n\n**이전 리뷰 기록:**\n"
        for idx, review in enumerate(previous_reviews[-2:], 1):  # 최근 2개만
            previous_context += f"\n{idx}. {review['date']} 리뷰:\n{review['content'][:500]}...\n"

    prompt = f"""당신은 시니어 개발자입니다. 다음 Pull Request의 **변경된 부분만** 리뷰해주세요.

**중요 규칙:**
1. **diff의 + 라인(추가/수정된 코드)에만 집중**하세요
2. **새로운 이슈를 우선적으로 보고**하세요
3. 이전 리뷰에서 이미 지적한 내용은 **여전히 Critical하고 안 고쳐진 경우만** 최대 2-3개로 제한해서 언급하세요
4. 사소한 스타일 문제는 보고하지 마세요
{previous_context}

**리뷰 기준 (우선순위 순):**
1. 🔒 보안: SQL Injection, XSS, 하드코딩된 비밀번호, 인증/권한
2. 🐛 버그: Null 참조, 예외 처리 누락, 엣지 케이스
3. ⚡ 성능: 비효율적인 알고리즘, 메모리 누수, 무한 루프
4. 📖 가독성: 네이밍, 주석, 코드 구조
5. ✨ Best Practice: 디자인 패턴, 원칙 준수
**변경사항 (diff):**
{sanitized_diff[:20000]}

**응답 형식:**
### 🆕 새로운 이슈
각 이슈마다:
- **[심각도]** 파일명:라인 - 간단한 제목
- 문제: 구체적으로
- 제안: 코드 예시 포함

### ⚠️ 이전 이슈 중 여전히 Critical (최대 2-3개)
(이전 리뷰에서 지적했지만 여전히 안 고쳐진 Critical 이슈만)

심각도: 🔴 Critical | 🟠 High | 🟡 Medium

**이슈가 없으면 "✅ 변경사항에서 특별한 문제를 발견하지 못했습니다"라고 답하세요.**
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

    print("📋 Checking previous reviews...")
    previous_reviews = get_previous_reviews(pr)
    if previous_reviews:
        print(f"   Found {len(previous_reviews)} previous review(s)")
    else:
        print("   No previous reviews found")

    print("🤖 Reviewing with Claude AI...")
    review = review_with_claude(diff, previous_reviews)

    print("💬 Posting review...")
    post_review(pr, review)

    print("🎉 Done!")

if __name__ == '__main__':
    main()
