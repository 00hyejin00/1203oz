# Clerk + Supabase 통합 가이드

이 문서는 Clerk와 Supabase의 네이티브 통합을 설정하고 사용하는 방법을 설명합니다.

> **중요**: 2025년 4월부터 Clerk의 네이티브 Supabase 통합을 사용합니다. JWT Template은 더 이상 필요하지 않습니다.

## 통합 설정

### 1. Clerk Dashboard에서 Supabase 통합 활성화

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 접속
2. **Integrations** → **Supabase** 메뉴로 이동
3. **"Activate Supabase integration"** 클릭
4. 표시된 **Clerk domain** 복사 (예: `your-app-12.clerk.accounts.dev`)

### 2. Supabase에서 Clerk를 Third-Party Auth Provider로 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속
2. 프로젝트 선택 → **Settings** → **Authentication** → **Providers**
3. 페이지 하단의 **"Third-Party Auth"** 섹션으로 이동
4. **"Add provider"** 클릭하고 **Clerk** 선택
5. 앞서 복사한 **Clerk domain** 입력
6. **"Save"** 클릭

> **참고**: 이 통합은 Clerk 세션 토큰에 `"role": "authenticated"` 클레임을 자동으로 추가하여 Supabase가 인증된 사용자로 인식할 수 있게 합니다.

## RLS 정책 설정

Supabase에서 Clerk 토큰을 사용하여 RLS(Row Level Security) 정책을 설정할 수 있습니다.

### 기본 예제: Tasks 테이블

```sql
-- tasks 테이블 생성
CREATE TABLE public.tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub')
);

-- RLS 활성화
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 tasks만 조회 가능
CREATE POLICY "User can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = (user_id)::TEXT)
);

-- INSERT 정책: 사용자는 자신의 tasks만 생성 가능
CREATE POLICY "Users must insert their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
  ((SELECT auth.jwt()->>'sub') = (user_id)::TEXT)
);
```

### RLS 정책 설명

- `auth.jwt()->>'sub'`: Clerk 사용자 ID를 반환합니다
- `user_id`: 테이블의 사용자 ID 컬럼과 비교합니다
- `TO authenticated`: 인증된 사용자에게만 정책을 적용합니다

## 코드에서 사용하기

### Client Component에서 사용

```tsx
'use client'

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const supabase = useClerkSupabaseClient()

  useEffect(() => {
    if (!user) return

    async function loadTasks() {
      setLoading(true)
      const { data, error } = await supabase.from('tasks').select()
      if (!error && data) setTasks(data)
      setLoading(false)
    }

    loadTasks()
  }, [user, supabase])

  async function createTask(name: string) {
    await supabase.from('tasks').insert({ name })
    // 페이지 새로고침 또는 상태 업데이트
  }

  return (
    <div>
      <h1>My Tasks</h1>
      {loading && <p>Loading...</p>}
      {tasks.map((task) => (
        <p key={task.id}>{task.name}</p>
      ))}
    </div>
  )
}
```

### Server Component에서 사용

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server'

export default async function TasksPage() {
  const supabase = createClerkSupabaseClient()
  const { data: tasks, error } = await supabase.from('tasks').select()

  if (error) {
    throw error
  }

  return (
    <div>
      <h1>My Tasks</h1>
      {tasks?.map((task) => (
        <p key={task.id}>{task.name}</p>
      ))}
    </div>
  )
}
```

### Server Action에서 사용

```ts
'use server'

import { createClerkSupabaseClient } from '@/lib/supabase/server'

export async function addTask(name: string) {
  const supabase = createClerkSupabaseClient()

  try {
    const { data, error } = await supabase.from('tasks').insert({ name })
    
    if (error) {
      console.error('Error adding task:', error.message)
      throw new Error('Failed to add task')
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Error adding task:', error.message)
    throw new Error('Failed to add task')
  }
}
```

## 주요 특징

### 네이티브 통합의 장점

1. **JWT 템플릿 불필요**: Clerk 네이티브 통합으로 자동 처리
2. **토큰 자동 갱신**: 각 요청마다 새로운 토큰을 가져올 필요 없음
3. **보안 향상**: Supabase JWT secret key를 Clerk와 공유할 필요 없음

### 환경 변수

`.env` 파일에 다음 환경 변수가 필요합니다:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 문제 해결

### RLS 정책이 작동하지 않는 경우

1. Supabase에서 Clerk 통합이 올바르게 설정되었는지 확인
2. RLS가 테이블에 활성화되어 있는지 확인
3. 정책에서 `auth.jwt()->>'sub'`를 올바르게 사용하는지 확인
4. Supabase 클라이언트가 올바른 토큰을 전달하는지 확인

### 토큰 관련 오류

1. Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인
2. Supabase Dashboard에서 Clerk domain이 올바르게 설정되었는지 확인
3. 브라우저 콘솔에서 토큰 관련 오류 메시지 확인

## 참고 자료

- [Clerk 공식 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth 문서](https://supabase.com/docs/guides/auth/third-party/overview)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)

