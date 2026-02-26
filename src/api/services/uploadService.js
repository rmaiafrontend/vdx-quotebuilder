/**
 * Upload de arquivo - POST /api/upload (multipart, campo file).
 * Retorna { file_url } para compatibilidade com integrations.Core.UploadFile.
 */

import { apiClient } from '../apiClient';

export function upload(file) {
  return apiClient.upload('/api/upload', file).then((res) => {
    if (res && typeof res === 'object' && res.file_url) return res;
    if (typeof res === 'string') return { file_url: res };
    return { file_url: res?.url || res?.path || '' };
  });
}

export const uploadService = { upload };
