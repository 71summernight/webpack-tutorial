# 배포 가이드

## 캐싱 전략

이 프로젝트는 S3 + CloudFront를 사용하여 다음과 같은 캐싱 전략을 적용합니다:

- **index.html**: `Cache-Control: no-cache, no-store, must-revalidate`
  - 항상 최신 버전을 가져옵니다
  - 브라우저와 CDN 모두 캐싱하지 않습니다

- **JS/CSS 파일**: `Cache-Control: s-maxage=31536000, max-age=0, immutable`
  - CDN에서는 1년 동안 캐싱 (s-maxage=31536000)
  - 브라우저에서는 항상 재검증 (max-age=0)
  - 파일명에 contenthash를 포함하여 변경 시 자동으로 새 파일 요청
  - immutable 플래그로 재검증 요청 최소화

## GitHub Actions 자동 배포 설정

### 1. GitHub Secrets 설정

Repository Settings → Secrets and variables → Actions → New repository secret

다음 4개의 Secret을 추가하세요:

| Secret Name                  | 설명                              | 예시                                       |
| ---------------------------- | --------------------------------- | ------------------------------------------ |
| `AWS_ACCESS_KEY_ID`          | AWS Access Key                    | `AKIAIOSFODNN7EXAMPLE`                     |
| `AWS_SECRET_ACCESS_KEY`      | AWS Secret Key                    | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `S3_BUCKET`                  | S3 버킷 이름                      | `my-app-bucket`                            |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront Distribution ID (선택) | `E1234EXAMPLE`                             |

### 2. IAM 권한 설정

AWS IAM 사용자에 다음 권한이 필요합니다:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:PutObjectAcl", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::your-bucket-name", "arn:aws:s3:::your-bucket-name/*"]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    }
  ]
}
```

### 3. 배포 방법

#### 자동 배포 (권장)

```bash
git add .
git commit -m "feat: 새 기능 추가"
git push origin main
```

→ main 브랜치에 push하면 자동으로 배포됩니다!

#### 수동 배포

GitHub → Actions → Deploy to S3 and CloudFront → Run workflow

### 4. 배포 프로세스

1. **코드 체크아웃**: 최신 코드를 가져옵니다
2. **Node.js 설정**: Node.js 23 환경 구성
3. **의존성 설치**: `npm ci`로 클린 설치
4. **빌드**: `npm run build`로 프로덕션 빌드
5. **AWS 인증**: GitHub Secrets로 AWS 인증
6. **S3 업로드**:
   - index.html → `no-cache, no-store, must-revalidate`
   - JS/CSS → `s-maxage=31536000, max-age=0, immutable`
7. **CloudFront 무효화**: `/index.html`과 `/*` 경로 무효화

## 배포 확인

### 1. GitHub Actions 로그 확인

GitHub → Actions 탭에서 워크플로우 실행 상태 확인

### 2. 캐시 헤더 확인

```bash
# index.html 확인
curl -I https://your-domain.com/index.html

# 예상 결과:
# Cache-Control: no-cache, no-store, must-revalidate

# JS 파일 확인
curl -I https://your-domain.com/js/main.[hash].js

# 예상 결과:
# Cache-Control: s-maxage=31536000, max-age=0, immutable
```

### 3. 브라우저에서 확인

1. 개발자 도구 열기 (F12)
2. Network 탭으로 이동
3. 페이지 새로고침
4. 각 파일의 Headers 탭에서 Cache-Control 확인

## 워크플로우 파일

`.github/workflows/deploy.yml` 파일에 배포 워크플로우가 정의되어 있습니다.

### 트리거 조건

- `push` to `main` 브랜치: 자동 배포
- `workflow_dispatch`: 수동 실행 가능

### 브랜치 변경

다른 브랜치(예: `production`)에서 배포하려면:

```yaml
on:
  push:
    branches:
      - production # main 대신 production 브랜치
```

## 문제 해결

### GitHub Actions 실패 시

1. **Actions 탭 확인**: 어느 단계에서 실패했는지 확인
2. **Secrets 확인**: 모든 Secret이 올바르게 설정되었는지 확인
3. **IAM 권한 확인**: AWS 권한이 충분한지 확인

### CloudFront 캐시가 업데이트되지 않는 경우

```bash
# 전체 캐시 무효화 (비용 발생 주의)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### S3 업로드 오류

- 버킷 이름 확인
- 버킷 정책 확인 (public read 허용 필요)
- IAM 권한 확인

## 비용 최적화

### CloudFront 무효화 비용

- 매월 처음 1,000개의 무효화 경로는 무료
- 현재 설정: 배포당 2개 경로 (`/index.html`, `/*`)
- 월 500회 배포까지 무료

### S3 비용

- PUT 요청: 1,000개당 $0.005
- GET 요청: CloudFront를 통해 요청하므로 비용 절감
- 저장 공간: GB당 $0.023

## 참고 자료

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [AWS S3 문서](https://docs.aws.amazon.com/s3/)
- [CloudFront 캐싱 정책](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)
- [Cache-Control 헤더](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
