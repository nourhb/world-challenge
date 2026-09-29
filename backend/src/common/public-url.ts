export function publicSiteUrl(): string {
  const explicit = process.env.FRONTEND_URL?.replace(/\/$/, '');
  if (explicit) {
    return explicit;
  }

  const render = process.env.RENDER_EXTERNAL_URL?.replace(/\/$/, '');
  if (render) {
    return render.startsWith('http') ? render : `https://${render}`;
  }

  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.replace(/\/$/, '');
  if (railway) {
    return railway.startsWith('http') ? railway : `https://${railway}`;
  }

  return 'http://127.0.0.1:5180';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}
