/**
 * WhatsApp Business API Integration
 * 
 * Options de providers:
 * 1. Twilio (recommandé pour MVP)
 * 2. MessageBird
 * 3. Meta WhatsApp Cloud API
 * 4. Evolution API (self-hosted, gratuit)
 */

interface WhatsAppMessage {
  to: string;
  message: string;
  templateName?: string;
  templateParams?: Record<string, string>;
}

/**
 * OPTION 1: TWILIO (Recommandé)
 * - Setup: https://www.twilio.com/whatsapp
 * - Pricing: $0.005/message (environ 3 FCFA/message)
 * - Limite: 1000 messages gratuits pour commencer
 */
export async function sendWhatsAppViaTwilio(data: WhatsAppMessage): Promise<boolean> {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Format: whatsapp:+14155238886

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio credentials missing');
      return false;
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: `whatsapp:${data.to}`,
          Body: data.message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio error:', error);
      return false;
    }

    const result = await response.json();
    console.log('WhatsApp sent via Twilio:', result.sid);
    return true;

  } catch (error) {
    console.error('Send WhatsApp error (Twilio):', error);
    return false;
  }
}

/**
 * OPTION 2: EVOLUTION API (Self-hosted, Gratuit)
 * - Setup: https://github.com/EvolutionAPI/evolution-api
 * - Pricing: Gratuit (VPS requis ~$5/mois)
 * - Limite: Illimité
 */
export async function sendWhatsAppViaEvolution(data: WhatsAppMessage): Promise<boolean> {
  try {
    const apiUrl = process.env.EVOLUTION_API_URL; // Ex: https://evolution.yourdomain.com
    const apiKey = process.env.EVOLUTION_API_KEY;
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'linkpro';

    if (!apiUrl || !apiKey) {
      console.error('Evolution API credentials missing');
      return false;
    }

    const response = await fetch(`${apiUrl}/message/sendText/${instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        number: data.to.replace(/\+/g, ''), // Remove + sign
        textMessage: {
          text: data.message,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Evolution API error:', error);
      return false;
    }

    const result = await response.json();
    console.log('WhatsApp sent via Evolution:', result);
    return true;

  } catch (error) {
    console.error('Send WhatsApp error (Evolution):', error);
    return false;
  }
}

/**
 * OPTION 3: META CLOUD API (Official)
 * - Setup: https://developers.facebook.com/docs/whatsapp/cloud-api
 * - Pricing: $0.0042/message (environ 2.5 FCFA)
 * - Limite: 1000 gratuits/mois, puis payant
 */
export async function sendWhatsAppViaMeta(data: WhatsAppMessage): Promise<boolean> {
  try {
    const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.META_WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      console.error('Meta WhatsApp credentials missing');
      return false;
    }

    // Use template for transactional messages (required by Meta)
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: data.to.replace(/\+/g, ''),
          type: 'template',
          template: {
            name: data.templateName || 'linkpro_otp',
            language: { code: 'fr' },
            components: [
              {
                type: 'body',
                parameters: Object.entries(data.templateParams || {}).map(([key, value]) => ({
                  type: 'text',
                  text: value,
                })),
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Meta WhatsApp error:', error);
      return false;
    }

    const result = await response.json();
    console.log('WhatsApp sent via Meta:', result.messages[0].id);
    return true;

  } catch (error) {
    console.error('Send WhatsApp error (Meta):', error);
    return false;
  }
}

/**
 * Main function - auto-selects provider based on env vars
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
  templateName?: string,
  templateParams?: Record<string, string>
): Promise<boolean> {
  const data: WhatsAppMessage = { to: phoneNumber, message, templateName, templateParams };

  // Try providers in order of preference
  if (process.env.TWILIO_ACCOUNT_SID) {
    return await sendWhatsAppViaTwilio(data);
  }

  if (process.env.EVOLUTION_API_URL) {
    return await sendWhatsAppViaEvolution(data);
  }

  if (process.env.META_WHATSAPP_PHONE_NUMBER_ID) {
    return await sendWhatsAppViaMeta(data);
  }

  // Fallback: Log only (development)
  console.log('📱 WhatsApp (DEV MODE):', { phoneNumber, message });
  return true;
}

/**
 * Send OTP via WhatsApp
 */
export async function sendOTP(phoneNumber: string, code: string): Promise<boolean> {
  const message = `Votre code de vérification LinkPro : ${code}\n\nCe code expire dans 5 minutes.\n\nNe partagez jamais ce code.`;

  return await sendWhatsAppMessage(phoneNumber, message, 'linkpro_otp', { code });
}

/**
 * Send notification WhatsApp click (vendor notification)
 */
export async function notifyVendorWhatsAppClick(
  vendorPhone: string,
  productName: string,
  customerPhone: string
): Promise<boolean> {
  const message = `🔔 Nouveau clic WhatsApp !\n\nProduit : ${productName}\nClient : ${customerPhone}\n\nRépondez rapidement pour conclure la vente !`;

  return await sendWhatsAppMessage(vendorPhone, message);
}

/**
 * Send subscription reminder
 */
export async function sendSubscriptionReminder(
  phoneNumber: string,
  daysRemaining: number,
  plan: string
): Promise<boolean> {
  const message = `⚠️ Rappel LinkPro\n\nVotre abonnement ${plan.toUpperCase()} expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}.\n\nRenouvelez maintenant pour continuer à bénéficier de tous les avantages.`;

  return await sendWhatsAppMessage(phoneNumber, message);
}
