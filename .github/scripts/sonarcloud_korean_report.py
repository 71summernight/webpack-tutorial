#!/usr/bin/env python3
"""
SonarCloud 결과를 한글로 변환하는 스크립트
"""
import os
import json
import requests
from github import Github

# 환경 변수
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
SONAR_TOKEN = os.getenv('SONAR_TOKEN')
REPOSITORY = os.getenv('GITHUB_REPOSITORY')
PR_NUMBER = int(os.getenv('PR_NUMBER', 0))
SONAR_PROJECT_KEY = "71summernight-dev_webpack-tutorial"
SONAR_HOST_URL = "https://sonarcloud.io"

# 한글 매핑
SEVERITY_KOREAN = {
    "BLOCKER": "🔴 차단",
    "CRITICAL": "🔴 심각",
    "MAJOR": "🟠 높음",
    "MINOR": "🟡 중간",
    "INFO": "🟢 낮음"
}

ISSUE_TYPE_KOREAN = {
    "BUG": "버그",
    "VULNERABILITY": "취약점",
    "CODE_SMELL": "코드 냄새",
    "SECURITY_HOTSPOT": "보안 핫스팟"
}

def get_sonar_issues():
    """SonarCloud에서 이슈 조회"""
    headers = {
        "Authorization": f"Bearer {SONAR_TOKEN}",
        "Content-Type": "application/json"
    }

    try:
        # SonarCloud API에서 이슈 조회
        response = requests.get(
            f"{SONAR_HOST_URL}/api/issues/search",
            headers=headers,
            params={
                "projectKey": SONAR_PROJECT_KEY,
                "statuses": "OPEN",
                "types": "BUG,VULNERABILITY,CODE_SMELL",
                "ps": 100
            },
            timeout=30
        )

        if response.status_code == 200:
            return response.json().get("issues", [])
        else:
            print(f"⚠️ SonarCloud API 오류: {response.status_code}")
            return []
    except Exception as e:
        print(f"⚠️ SonarCloud 조회 실패: {e}")
        return []

def format_korean_report(issues):
    """SonarCloud 이슈를 한글 리포트로 포맷팅"""
    if not issues:
        return "## 📊 SonarCloud 품질 분석\n\n✅ 발견된 이슈가 없습니다!\n"

    # 심각도별 분류
    issues_by_severity = {}
    for issue in issues:
        severity = issue.get("severity", "INFO")
        if severity not in issues_by_severity:
            issues_by_severity[severity] = []
        issues_by_severity[severity].append(issue)

    report = "## 📊 SonarCloud 품질 분석\n\n"

    # 심각도 순서
    severity_order = ["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "INFO"]

    total_issues = len(issues)
    report += f"**총 이슈: {total_issues}개**\n\n"

    for severity in severity_order:
        if severity not in issues_by_severity:
            continue

        severity_issues = issues_by_severity[severity]
        korean_severity = SEVERITY_KOREAN.get(severity, severity)

        report += f"### {korean_severity} ({len(severity_issues)}개)\n\n"

        for issue in severity_issues[:10]:  # 심각도별 최대 10개
            issue_type = ISSUE_TYPE_KOREAN.get(
                issue.get("type", "CODE_SMELL"),
                issue.get("type", "기타")
            )
            message = issue.get("message", "")
            component = issue.get("component", "").split(":")[-1]
            line = issue.get("line", "?")

            report += f"- **{issue_type}** - `{component}:{line}`\n"
            report += f"  {message}\n\n"

    return report

def post_korean_report(pr, report_text):
    """PR에 한글 리포트 포스팅"""
    comment = f"""{report_text}

---
<details>
<summary>ℹ️ SonarCloud 정보</summary>

- 대시보드: https://sonarcloud.io/project/overview?id={SONAR_PROJECT_KEY}
- 날짜: {os.popen('date').read().strip()}
- 상태: 분석 완료
</details>

💡 상세 분석은 SonarCloud 대시보드를 참고하세요.
"""

    pr.create_issue_comment(comment)
    print("✅ 한글 리포트 포스팅 완료!")

def main():
    if not all([GITHUB_TOKEN, SONAR_TOKEN, REPOSITORY, PR_NUMBER]):
        print("❌ 필수 환경 변수 누락")
        return

    print("📥 SonarCloud 이슈 조회 중...")
    issues = get_sonar_issues()

    if not issues:
        print("ℹ️  조회할 이슈 없음 또는 API 오류")
        return

    print(f"📊 {len(issues)}개의 이슈 발견")

    print("📝 한글 리포트 생성 중...")
    report = format_korean_report(issues)

    print("💬 리포트 포스팅 중...")
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPOSITORY)
    pr = repo.get_pull(PR_NUMBER)
    post_korean_report(pr, report)

    print("🎉 완료!")

if __name__ == '__main__':
    main()
