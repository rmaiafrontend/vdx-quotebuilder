/**
 * Integrações - Documentacao_API §4.5.1.
 * POST /integrations/Core/SendEmail
 * Upload: POST /api/upload (api.js usa uploadService).
 */

import { apiClient } from '../apiClient';

const SEND_EMAIL_PATH = '/integrations/Core/SendEmail';

/**
 * @param {{ to: string, subject: string, body: string }} payload
 */
export function sendEmail(payload) {
  return apiClient.post(SEND_EMAIL_PATH, payload);
}

export const integracoesService = {
  sendEmail
};
