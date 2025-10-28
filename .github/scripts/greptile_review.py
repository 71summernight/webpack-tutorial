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
                            "remote": repository_url,
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
                    "query": query[:80],  # 쿼리 요약
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
                review += f"- `{source.get('file', 'unknown')}`\n"

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

    pr.create_issue_comment(comment)
    print("✅ Greptile review posted successfully!")

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
