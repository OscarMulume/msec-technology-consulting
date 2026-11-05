// Point d'entrée Supabase Edge Function (Deno). Toute la logique est dans core.ts.
// Secrets attendus (saisis par Oscar, jamais dans le dépôt) :
//   LLM_BASE_URL, LLM_MODEL, LLM_API_KEY, ASSISTANT_SALT
// Fournis automatiquement par Supabase : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

import { handle } from './core.ts';
import { createRestStore } from './store.ts';
import { KNOWLEDGE, KNOWLEDGE_SECTIONS } from './knowledge.generated.ts';

declare const Deno: {
  serve(handler: (request: Request) => Response | Promise<Response>): unknown;
  env: { get(name: string): string | undefined };
};

Deno.serve((request: Request) => {
  const env = {
    LLM_BASE_URL: Deno.env.get('LLM_BASE_URL'),
    LLM_MODEL: Deno.env.get('LLM_MODEL'),
    LLM_API_KEY: Deno.env.get('LLM_API_KEY'),
    ASSISTANT_SALT: Deno.env.get('ASSISTANT_SALT'),
    ASSISTANT_ALLOW_LOCALHOST: Deno.env.get('ASSISTANT_ALLOW_LOCALHOST'),
  };
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  return handle(request, {
    env,
    fetch,
    store: createRestStore(supabaseUrl, serviceKey),
    knowledge: KNOWLEDGE,
    sections: KNOWLEDGE_SECTIONS,
  });
});
