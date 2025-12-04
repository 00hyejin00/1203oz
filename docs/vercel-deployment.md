# Vercel 배포 가이드

이 문서는 프로젝트를 Vercel에 배포하는 방법과 필요한 환경 변수 설정을 설명합니다.

## 배포 상태

프로젝트는 이미 Vercel에 배포되어 있습니다:

- **프로덕션 URL**: https://nextjs-supabase-boilerplate-main-6s5sf8a8q.vercel.app
- **Vercel 프로젝트**: `nextjs-supabase-boilerplate-main`

## 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

### 1. Vercel 대시보드 접속

1. [Vercel Dashboard](https://vercel.com/dashboard)에 접속
2. 프로젝트 선택: `nextjs-supabase-boilerplate-main`
3. **Settings** → **Environment Variables** 메뉴로 이동

### 2. 필요한 환경 변수

다음 환경 변수들을 추가하세요:

#### Clerk 환경 변수

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

#### Supabase 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

### 3. 환경별 환경 변수 설정

Vercel에서는 환경별로 환경 변수를 설정할 수 있습니다:

- **Production**: 프로덕션 환경용
- **Preview**: 프리뷰/스테이징 환경용  
- **Development**: 개발 환경용

각 환경에 맞는 값을 설정하세요.

### 4. 환경 변수 적용

환경 변수를 추가한 후:

1. **Save** 클릭
2. 자동으로 새 배포가 트리거되거나
3. 수동으로 **Deployments** → **Redeploy**를 클릭하여 재배포

## Vercel CLI를 사용한 배포

### 초기 배포

```bash
vercel
```

### 프로덕션 배포

```bash
vercel --prod
```

### 환경 변수 확인

```bash
vercel env ls
```

### 환경 변수 추가 (CLI)

```bash
# 프로덕션 환경 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL production

# 프리뷰 환경 변수 추가
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
```

## 배포 후 확인 사항

### 1. 환경 변수 확인

배포된 사이트에서 환경 변수가 제대로 로드되는지 확인:

- Clerk 로그인 페이지가 정상적으로 표시되는지
- Supabase 연결이 정상적으로 작동하는지

### 2. 주요 페이지 테스트

- `/` - 홈페이지
- `/auth-test` - 인증 테스트
- `/storage-test` - 스토리지 테스트
- `/tasks-test` - Tasks 테스트
- `/instruments` - Instruments 테스트

### 3. 로그 확인

문제가 발생하면 Vercel 대시보드에서 로그를 확인:

```bash
vercel logs https://nextjs-supabase-boilerplate-main-6s5sf8a8q.vercel.app
```

## 자동 배포 설정

GitHub 저장소와 연동되어 있으면:

1. `main` 브랜치에 푸시할 때마다 자동으로 프로덕션 배포
2. Pull Request 생성 시 자동으로 프리뷰 배포

## 문제 해결

### 빌드 실패

1. Vercel 대시보드의 **Deployments** 탭에서 빌드 로그 확인
2. 로컬에서 `pnpm run build` 실행하여 오류 확인
3. 환경 변수가 모두 설정되었는지 확인

### 환경 변수 오류

1. 환경 변수 이름 확인 (대소문자 구분)
2. `NEXT_PUBLIC_` 접두사가 필요한 변수 확인
3. 프로덕션/프리뷰 환경에 맞게 설정되었는지 확인

### 런타임 오류

1. Vercel 대시보드의 **Functions** 탭에서 함수 로그 확인
2. 브라우저 콘솔에서 클라이언트 오류 확인
3. 네트워크 탭에서 API 요청 상태 확인

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [환경 변수 설정](https://vercel.com/docs/projects/environment-variables)

