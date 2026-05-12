import type { ApiError } from './api-types';

export type ParsedAuthError = {
  fieldErrors: Record<string, string>;
  message: string;
  errorCode?: string;
};

const ERROR_CODE_MESSAGES: Record<string, string> = {
  'AUTH-1001': 'E-posta veya şifre hatalı.',
  'AUTH-1010': 'Lütfen 2 dakika bekleyip tekrar deneyin.',
  'AUTH-1011': 'Geçersiz kod. Lütfen tekrar deneyin.',
  'AUTH-1012': 'Kodun süresi dolmuş. Yeni bir kod isteyin.',
  'AUTH-1013': 'Deneme hakkınız bitti. Yeni bir kod isteyin.',
};

export function parseAuthError(error: unknown): ParsedAuthError {
  if (!isApiErrorShape(error)) {
    return {
      fieldErrors: {},
      message: 'Bağlantı hatası. Lütfen tekrar deneyin.',
    };
  }

  const fieldErrors: Record<string, string> = {};
  if (error.errors) {
    for (const [key, messages] of Object.entries(error.errors)) {
      const field = key.charAt(0).toLowerCase() + key.slice(1);
      fieldErrors[field] = messages[0];
    }
  }

  const codeMessage = error.errorCode ? ERROR_CODE_MESSAGES[error.errorCode] : undefined;

  return {
    fieldErrors,
    message: codeMessage ?? error.detail ?? error.error ?? error.title ?? 'Bir hata oluştu.',
    errorCode: error.errorCode,
  };
}

function isApiErrorShape(e: unknown): e is ApiError {
  return typeof e === 'object' && e !== null && 'status' in e;
}
