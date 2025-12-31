var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// functions/worker.js
var SYSTEM_PROMPT = `You are the WhitTech.AI virtual assistant - a friendly, knowledgeable AI that helps potential clients learn about WhitTech.AI's custom software development services.

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
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (url.pathname === "/api/chat") {
      return handleChatRequest(request, env);
    }
    if (url.pathname.startsWith("/api/files")) {
      return handleFileRequest(request, env, url);
    }
    return env.ASSETS.fetch(request);
  }
};
async function handleFileRequest(request, env, url) {
  const path = url.pathname.replace("/api/files", "");
  try {
    if (path === "/upload" && request.method === "POST") {
      return handleFileUpload(request, env);
    }
    if (path.startsWith("/list/") && request.method === "GET") {
      const clientId = path.replace("/list/", "");
      return handleFileList(env, clientId);
    }
    if (path.startsWith("/download/") && request.method === "GET") {
      const key = decodeURIComponent(path.replace("/download/", ""));
      return handleFileDownload(env, key);
    }
    if (request.method === "DELETE" && path.length > 1) {
      const key = decodeURIComponent(path.slice(1));
      return handleFileDelete(env, key);
    }
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    console.error("File API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(handleFileRequest, "handleFileRequest");
async function handleFileUpload(request, env) {
  const formData = await request.formData();
  const file = formData.get("file");
  const clientId = formData.get("clientId");
  const filename = formData.get("filename") || file.name;
  if (!file || !clientId) {
    return new Response(JSON.stringify({ error: "Missing file or clientId" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
  const key = `clients/${clientId}/${Date.now()}_${filename}`;
  const arrayBuffer = await file.arrayBuffer();
  await env.FILES.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type || "application/octet-stream"
    },
    customMetadata: {
      originalName: filename,
      uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
      clientId
    }
  });
  return new Response(JSON.stringify({
    success: true,
    key,
    filename,
    size: arrayBuffer.byteLength,
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
}
__name(handleFileUpload, "handleFileUpload");
async function handleFileList(env, clientId) {
  const prefix = `clients/${clientId}/`;
  const listed = await env.FILES.list({ prefix });
  const files = await Promise.all(
    listed.objects.map(async (obj) => {
      const head = await env.FILES.head(obj.key);
      return {
        key: obj.key,
        filename: head?.customMetadata?.originalName || obj.key.split("/").pop(),
        size: obj.size,
        uploadedAt: head?.customMetadata?.uploadedAt || obj.uploaded.toISOString()
      };
    })
  );
  return new Response(JSON.stringify({ files }), {
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
}
__name(handleFileList, "handleFileList");
async function handleFileDownload(env, key) {
  const object = await env.FILES.get(key);
  if (!object) {
    return new Response(JSON.stringify({ error: "File not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Disposition", `attachment; filename="${object.customMetadata?.originalName || key.split("/").pop()}"`);
  Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
  return new Response(object.body, { headers });
}
__name(handleFileDownload, "handleFileDownload");
async function handleFileDelete(env, key) {
  await env.FILES.delete(key);
  return new Response(JSON.stringify({ success: true, deleted: key }), {
    headers: { "Content-Type": "application/json", ...corsHeaders }
  });
}
__name(handleFileDelete, "handleFileDelete");
async function handleChatRequest(request, env) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.content
      }))
    ];
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: formattedMessages,
      max_tokens: 500,
      temperature: 0.7
    });
    return new Response(JSON.stringify({
      response: response.response || response.result?.response || "I apologize, I had trouble processing that. Could you try again?"
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return new Response(JSON.stringify({
      error: "AI service temporarily unavailable",
      fallback: true
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
}
__name(handleChatRequest, "handleChatRequest");

// ../../Users/justi/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../Users/justi/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-Vn8dWU/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../Users/justi/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-Vn8dWU/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
