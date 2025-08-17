import type { CartItem } from '../data/cart.service';

type WhatsAppEnvCfg = {
  phoneE164?: string;
  currency?: string;
  locale?: string;
  messageTemplate?: string;
  includePageUrl?: boolean;
};

/**
 * Builds a wa.me URL to start a WhatsApp chat with a formatted order summary.
 * - Returns null if phone or items are missing.
 */
export function buildWhatsAppOrderUrl(
  items: CartItem[],
  totalAmount: number,
  cfg: WhatsAppEnvCfg = {},
  currentUrl: string = ''
): string | null {
  const phone = cfg.phoneE164 || '';
  if (!phone || !items?.length) return null;

  const currency = cfg.currency || 'USD';
  const locale = cfg.locale || 'es-CO';
  const money = (v: number) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(v);

  const lines = items.map(it => `- ${it.qty} × ${it.product.name} (${money(it.product.newPrice)} c/u)`);
  const itemsBlock = lines.join('\n');
  const total = money(totalAmount);

  const template = cfg.messageTemplate || 'Pedido:\n{{items}}\nTotal: {{total}}';
  const orderId = `CLD-${Date.now().toString(36).toUpperCase()}`;
  const includeUrl = cfg.includePageUrl === true;
  const pageUrl = includeUrl ? (currentUrl || '') : '';

  const msg = template
    .replace('{{items}}', itemsBlock)
    .replace('{{total}}', total)
    .replace('{{orderId}}', orderId)
    .replace('{{url}}', pageUrl);

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
