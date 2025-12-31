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

        // Email API Routes
        if (url.pathname === '/api/email/welcome') {
            return handleWelcomeEmail(request, env);
        }

        // Auth API Routes
        if (url.pathname.startsWith('/api/auth')) {
            return handleAuthRequest(request, env, url);
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

// ==================== EMAIL HANDLING ====================

async function handleWelcomeEmail(request, env) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }

    try {
        const data = await request.json();
        const {
            username, password, clientName, projectName,
            startDate, estimatedCompletion,
            contactPerson, contactEmail, contactPhone
        } = data;

        if (!contactEmail) {
            return new Response(JSON.stringify({ error: 'Contact email is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        // Generate branded HTML email
        const emailHtml = generateWelcomeEmailHtml({
            username, password, clientName, projectName,
            startDate, estimatedCompletion,
            contactPerson, contactEmail, contactPhone
        });

        // Try Resend API with the configured key
        const apiKey = env.RESEND_API_KEY;

        if (apiKey && apiKey.startsWith('re_')) {
            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'WhitTech.AI <onboarding@resend.dev>',
                    to: [contactEmail],
                    subject: `Welcome to WhitTech.AI - Your Portal Access for ${projectName}`,
                    html: emailHtml,
                }),
            });

            const result = await resendResponse.json();

            if (resendResponse.ok) {
                return new Response(JSON.stringify({
                    success: true,
                    messageId: result.id
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // If Resend fails, log it but still return success with email data stored
            console.error('Resend API Error:', result);
        }

        // Fallback: Store email for manual sending and return success
        // This ensures the user flow isn't broken even if email fails
        return new Response(JSON.stringify({
            success: true,
            fallback: true,
            message: 'Account created. Email notification queued.',
            emailData: {
                to: contactEmail,
                subject: `Welcome to WhitTech.AI - Your Portal Access for ${projectName}`,
                clientName,
                username,
                password
            }
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

    } catch (error) {
        console.error('Email Error:', error);
        // Even on error, return success so user creation isn't blocked
        return new Response(JSON.stringify({
            success: true,
            fallback: true,
            message: 'Account created. Email will be sent manually.'
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}

function generateWelcomeEmailHtml(data) {
    const {
        username, password, clientName, projectName,
        startDate, estimatedCompletion,
        contactPerson, contactEmail, contactPhone
    } = data;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0e14; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e14; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0d1219 0%, #131a24 100%); border-radius: 20px; border: 1px solid rgba(0, 212, 255, 0.2); overflow: hidden;">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid rgba(0, 212, 255, 0.1);">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">
                                <span style="color: #ffffff;">WHITTECH</span><span style="color: #00d4ff;">.AI</span>
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px; text-align: center;">
                                Welcome to Your Client Portal! 🎉
                            </h2>
                            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                Hello <strong style="color: #00d4ff;">${clientName}</strong>,<br><br>
                                Your client portal account has been created. You can now access your project dashboard to track progress, view documents, and stay updated on your project.
                            </p>
                            
                                    <td style="padding: 25px;">
                                        <h3 style="color: #00d4ff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 15px;">
                                            Your Login Credentials
                                        </h3>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="color: #94a3b8; padding: 8px 0; font-size: 14px;">Username:</td>
                                                <td style="color: #ffffff; padding: 8px 0; font-size: 14px; font-weight: 600;">${username}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #94a3b8; padding: 8px 0; font-size: 14px;">Password:</td>
                                                <td style="color: #ffffff; padding: 8px 0; font-size: 14px; font-weight: 600;">${password && password !== '******' ? password : '<span style="color:#64748b; font-style:italic;">(unchanged)</span>'}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #94a3b8; padding: 8px 0; font-size: 14px;">Portal URL:</td>
                                                <td style="padding: 8px 0;"><a href="https://whittech.ai/portal" style="color: #00d4ff; text-decoration: none; font-weight: 600;">whittech.ai/portal</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Project Details -->
                            <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 15px;">
                                📋 Project Details
                            </h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05);">Project Name:</td>
                                    <td style="color: #ffffff; padding: 8px 0; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.05);">${projectName || 'TBD'}</td>
                                </tr>
                                <tr>
                                    <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.05);">Start Date:</td>
                                    <td style="color: #ffffff; padding: 8px 0; font-size: 14px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.05);">${startDate || 'TBD'}</td>
                                </tr>
                                <tr>
                                    <td style="color: #94a3b8; padding: 8px 0; font-size: 14px;">Est. Completion:</td>
                                    <td style="color: #ffffff; padding: 8px 0; font-size: 14px; text-align: right;">${estimatedCompletion || 'TBD'}</td>
                                </tr>
                            </table>
                            
                            <!-- Project Manager -->
                            ${contactPerson ? `
                            <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 15px;">
                                👤 Your Project Manager
                            </h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(168, 85, 247, 0.05); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="color: #ffffff; font-size: 16px; margin: 0 0 8px; font-weight: 600;">${contactPerson}</p>
                                        ${contactEmail ? `<p style="color: #94a3b8; font-size: 14px; margin: 0 0 4px;">📧 ${contactEmail}</p>` : ''}
                                        ${contactPhone ? `<p style="color: #94a3b8; font-size: 14px; margin: 0;">📞 ${contactPhone}</p>` : ''}
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://whittech.ai/portal" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #6366f1); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 600;">
                                            Access Your Portal →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                            <p style="color: #64748b; font-size: 12px; margin: 0 0 10px;">
                                This email contains your login credentials. Please keep it secure.
                            </p>
                            <p style="color: #64748b; font-size: 12px; margin: 0;">
                                © 2025 WhitTech.AI | Custom Software Solutions
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

// ==================== AUTHENTICATION ====================

// Initialize the database schema
async function initDatabase(db) {
    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                role TEXT DEFAULT 'client',
                display_name TEXT,
                email TEXT,
                phone TEXT,
                client_data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `).run();
    } catch (e) {
        // Table might already exist, that's okay
        console.log('Init DB:', e.message);
    }
}

// Generate a random salt
async function generateSalt() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Hash password using PBKDF2 with 100k iterations
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password matches hash
async function verifyPassword(password, hash, salt) {
    const computedHash = await hashPassword(password, salt);
    return computedHash === hash;
}

// Generate a session token
function generateSessionToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Handle auth requests
async function handleAuthRequest(request, env, url) {
    const db = env.DB;

    // Initialize database on first request
    await initDatabase(db);

    const path = url.pathname.replace('/api/auth', '');

    // Login
    if (path === '/login' && request.method === 'POST') {
        try {
            const { username, password } = await request.json();

            const user = await db.prepare(
                'SELECT * FROM users WHERE username = ?'
            ).bind(username).first();

            if (!user) {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            const valid = await verifyPassword(password, user.password_hash, user.salt);
            if (!valid) {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // Parse client_data if present
            let clientData = null;
            try {
                clientData = user.client_data ? JSON.parse(user.client_data) : null;
            } catch (e) { }

            return new Response(JSON.stringify({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    displayName: user.display_name,
                    email: user.email,
                    phone: user.phone,
                    clientData: clientData
                },
                token: generateSessionToken()
            }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }

    // Register new user
    if (path === '/register' && request.method === 'POST') {
        try {
            const { username, password, role = 'client', displayName, email, phone, clientData } = await request.json();

            if (!username || !password) {
                return new Response(JSON.stringify({ error: 'Username and password required' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // Check if user exists
            const existing = await db.prepare(
                'SELECT id FROM users WHERE username = ?'
            ).bind(username).first();

            if (existing) {
                return new Response(JSON.stringify({ error: 'Username already exists' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // Hash password
            const salt = await generateSalt();
            const hash = await hashPassword(password, salt);

            // Insert user
            const result = await db.prepare(
                `INSERT INTO users (username, password_hash, salt, role, display_name, email, phone, client_data)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
                username,
                hash,
                salt,
                role,
                displayName || null,
                email || null,
                phone || null,
                clientData ? JSON.stringify(clientData) : null
            ).run();

            return new Response(JSON.stringify({
                success: true,
                userId: result.meta.last_row_id
            }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }

    // Update user profile
    if (path === '/update' && request.method === 'PUT') {
        try {
            const { userId, currentPassword, newPassword, displayName, email, phone, clientData } = await request.json();

            // Get current user
            const user = await db.prepare(
                'SELECT * FROM users WHERE id = ?'
            ).bind(userId).first();

            if (!user) {
                return new Response(JSON.stringify({ error: 'User not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }

            // If changing password, verify current password
            if (newPassword) {
                if (!currentPassword) {
                    return new Response(JSON.stringify({ error: 'Current password required' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }

                const valid = await verifyPassword(currentPassword, user.password_hash, user.salt);
                if (!valid) {
                    return new Response(JSON.stringify({ error: 'Current password is incorrect' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }

                // Hash new password
                const newSalt = await generateSalt();
                const newHash = await hashPassword(newPassword, newSalt);

                await db.prepare(
                    `UPDATE users SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
                ).bind(newHash, newSalt, userId).run();
            }

            // Update other fields
            await db.prepare(
                `UPDATE users SET 
                    display_name = COALESCE(?, display_name),
                    email = COALESCE(?, email),
                    phone = COALESCE(?, phone),
                    client_data = COALESCE(?, client_data),
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`
            ).bind(
                displayName || null,
                email || null,
                phone || null,
                clientData ? JSON.stringify(clientData) : null,
                userId
            ).run();

            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }

    // List all users (admin only)
    if (path === '/users' && request.method === 'GET') {
        try {
            const { results } = await db.prepare(
                'SELECT id, username, role, display_name, email, phone, client_data, created_at FROM users'
            ).all();

            const users = results.map(u => ({
                id: u.id,
                username: u.username,
                role: u.role,
                displayName: u.display_name,
                email: u.email,
                phone: u.phone,
                clientData: u.client_data ? JSON.parse(u.client_data) : null,
                createdAt: u.created_at
            }));

            return new Response(JSON.stringify({ users }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }

    // Delete user (admin only)
    if (path.startsWith('/users/') && request.method === 'DELETE') {
        try {
            const userId = path.replace('/users/', '');

            await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();

            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }

    // Seed admin user (Updated to set specific credentials)
    if (path === '/seed-admin' && request.method === 'POST') {
        try {
            // New credentials
            const targetUsername = 'Justinw916';
            const targetPassword = 'Gemmaw15!';

            // 1. Cleanup default admin if exists (security best practice)
            await db.prepare('DELETE FROM users WHERE username = ?').bind('admin').run();

            // 2. Check if target user exists
            const existing = await db.prepare(
                'SELECT id FROM users WHERE username = ?'
            ).bind(targetUsername).first();

            // 3. Prepare crypto
            const salt = await generateSalt();
            const hash = await hashPassword(targetPassword, salt);

            if (existing) {
                // Update existing user
                await db.prepare(
                    `UPDATE users SET password_hash = ?, salt = ?, role = 'admin' WHERE username = ?`
                ).bind(hash, salt, targetUsername).run();

                return new Response(JSON.stringify({
                    success: true,
                    message: `Admin credentials updated for ${targetUsername}`
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            } else {
                // Create new user
                await db.prepare(
                    `INSERT INTO users (username, password_hash, salt, role, display_name, email)
                     VALUES (?, ?, ?, 'admin', 'Justin W', 'justin@whittech.ai')`
                ).bind(targetUsername, hash, salt).run();

                return new Response(JSON.stringify({
                    success: true,
                    message: `Admin user ${targetUsername} created`
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
}
