import { koKR } from "@clerk/localizations";

/**
 * Clerk 한국어 커스텀 로컬라이제이션
 * 
 * 기본 koKR 로컬라이제이션을 확장하여 브랜드에 맞게 커스터마이징할 수 있습니다.
 * 
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 */
export const customKoKR = {
  ...koKR,
  
  // 원하는 문자열만 커스터마이징할 수 있습니다
  // 예: signIn, signUp, userButton 등의 키를 통해 특정 문자열만 변경 가능
  
  // 커스텀 에러 메시지 (선택사항)
  unstable__errors: {
    ...koKR.unstable__errors,
    // 특정 에러 메시지만 커스터마이징
    // not_allowed_access: "접근이 허용되지 않습니다. 관리자에게 문의하세요.",
  },
} as typeof koKR;

/**
 * 기본 한국어 로컬라이제이션 (커스터마이징 없이)
 * 
 * 기본 koKR을 그대로 사용하고 싶을 때 사용
 */
export { koKR as defaultKoKR } from "@clerk/localizations";

