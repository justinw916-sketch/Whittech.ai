// Main Worker - handles API routes and static assets

const SYSTEM_PROMPT = `You are the WhitTech.AI virtual assistant - a friendly, knowledgeable AI that helps potential clients learn about WhitTech.AI's custom software development services.

## About WhitTech.AI
WhitTech.AI builds custom software solutions for businesses, with a focus on the construction industry, startups, and small businesses. Founded by Justin Whitton, who has 18+ years of hands-on experience in the construction field.

## Our Services
1. **Estimation & Bidding Tools** - Custom calculators, material takeoffs, automated bid generation
2. **Project Management Apps** - Dashboards, scheduling, budget tracking, client portals
3. **Field & Mobile Tools** - GPS time tracking, daily logs, photo documentation, offline-first apps
4. **AI-Powered Automation** - Document parsing, smart data entry, predictive alerts
5. **System Integrations** - QuickBooks, Google Sheets, CRMs, custom APIs
6. **Custom Solutions** - Unique business logic, customer portals, anything you can describe

## Pricing
- **No monthly fees** - You own the code outright
- **Fixed-price quotes** - No surprise bills or scope creep
- **Typical range**: $2,000 - $15,000 depending on complexity
- **FREE consultation** to discuss needs and get an accurate quote

## Timeline
- Simple tools: 1-2 weeks
- Standard apps: 2-4 weeks
- Complex systems: 4-8 weeks
- Most projects delivered in 2-4 weeks

## Our Process
1. **Discovery Call** (Free, 30 min) - Map out the solution together
2. **Blueprint & Quote** - Detailed spec and fixed price within 48 hours
3. **Rapid Build** - Daily progress, staging access, launch when satisfied

## Contact
- Email: jwhitton@zoho.com
- Website: whittech.ai/contact

## Your Personality
- Be enthusiastic about what we do, but not pushy
- Be concise but informative
- Use conversational language, not corporate speak
- If you don't know something specific, offer to connect them with the team
- Always try to guide them toward booking a consultation
- Use occasional emojis for warmth (but don't overdo it)
- Highlight our unique value: fast delivery, fixed pricing, industry expertise

Remember: You are a helpful assistant promoting WhitTech.AI. Always be honest and never make up services or pricing we don't offer.`;

// CORS headers helper
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle CORS preflight for all API routes
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // API Routes
        if (url.pathname === '/api/chat') {
            return handleChatRequest(request, env);
        }

        // File API Routes
        if (url.pathname.startsWith('/api/files')) {
            return handleFileRequest(request, env, url);
        }

        // Serve static assets for all other routes
        return env.ASSETS.fetch(request);
    }
};

// ==================== FILE HANDLING ====================

async function handleFileRequest(request, env, url) {
    const path = url.pathname.replace('/api/files', '');

    try {
        // POST /api/files/upload - Upload a file
        if (path === '/upload' && request.method === 'POST') {
            return handleFileUpload(request, env);
        }

        // GET /api/files/list/:clientId - List files for a client
        if (path.startsWith('/list/') && request.method === 'GET') {
            const clientId = path.replace('/list/', '');
            return handleFileList(env, clientId);
        }

        // GET /api/files/download/:key - Download a file
        if (path.startsWith('/download/') && request.method === 'GET') {
            const key = decodeURIComponent(path.replace('/download/', ''));
            return handleFileDownload(env, key);
        }

        // DELETE /api/files/:key - Delete a file
        if (request.method === 'DELETE' && path.length > 1) {
            const key = decodeURIComponent(path.slice(1));
            return handleFileDelete(env, key);
        }

        return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

    } catch (error) {
        console.error('File API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}

async function handleFileUpload(request, env) {
    const formData = await request.formData();
    const file = formData.get('file');
    const clientId = formData.get('clientId');
    const filename = formData.get('filename') || file.name;

    if (!file || !clientId) {
        return new Response(JSON.stringify({ error: 'Missing file or clientId' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    const key = `clients/${clientId}/${Date.now()}_${filename}`;
    const arrayBuffer = await file.arrayBuffer();

    await env.FILES.put(key, arrayBuffer, {
        httpMetadata: {
            contentType: file.type || 'application/octet-stream',
        },
        customMetadata: {
            originalName: filename,
            uploadedAt: new Date().toISOString(),
            clientId: clientId,
        }
    });

    return new Response(JSON.stringify({
        success: true,
        key: key,
        filename: filename,
        size: arrayBuffer.byteLength,
        uploadedAt: new Date().toISOString()
    }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
}

async function handleFileList(env, clientId) {
    const prefix = `clients/${clientId}/`;
    const listed = await env.FILES.list({ prefix });

    const files = await Promise.all(
        listed.objects.map(async (obj) => {
            const head = await env.FILES.head(obj.key);
            return {
                key: obj.key,
                filename: head?.customMetadata?.originalName || obj.key.split('/').pop(),
                size: obj.size,
                uploadedAt: head?.customMetadata?.uploadedAt || obj.uploaded.toISOString(),
            };
        })
    );

    return new Response(JSON.stringify({ files }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
}

async function handleFileDownload(env, key) {
    const object = await env.FILES.get(key);

    if (!object) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Content-Disposition', `attachment; filename="${object.customMetadata?.originalName || key.split('/').pop()}"`);
    Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));

    return new Response(object.body, { headers });
}

async function handleFileDelete(env, key) {
    await env.FILES.delete(key);

    return new Response(JSON.stringify({ success: true, deleted: key }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
}

// ==================== CHAT HANDLING ====================

async function handleChatRequest(request, env) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }

    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        // Format messages for the AI model
        const formattedMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.content,
            })),
        ];

        // Call Cloudflare Workers AI
        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: formattedMessages,
            max_tokens: 500,
            temperature: 0.7,
        });

        return new Response(JSON.stringify({
            response: response.response || response.result?.response || 'I apologize, I had trouble processing that. Could you try again?'
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        return new Response(JSON.stringify({
            error: 'AI service temporarily unavailable',
            fallback: true
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
}
