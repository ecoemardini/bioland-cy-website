// Decap CMS GitHub OAuth — step 1 (fresh, non-cacheable endpoint).
// Runs as a Cloudflare Pages Function at /api/login
// Uses a 302 + no-store so browsers never cache the redirect.
// Requires env var: GITHUB_CLIENT_ID
export async function onRequest(context) {
    const { request, env } = context;
    const client_id = env.GITHUB_CLIENT_ID;

    try {
        const url = new URL(request.url);
        const redirectUrl = new URL('https://github.com/login/oauth/authorize');
        redirectUrl.searchParams.set('client_id', client_id);
        redirectUrl.searchParams.set('redirect_uri', url.origin + '/api/callback');
        redirectUrl.searchParams.set('scope', 'repo user');
        redirectUrl.searchParams.set(
            'state',
            crypto.getRandomValues(new Uint8Array(12)).join(''),
        );
        return new Response(null, {
            status: 302,
            headers: {
                Location: redirectUrl.href,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        return new Response(error.message, {
            status: 500,
            headers: { 'Cache-Control': 'no-store' },
        });
    }
}
