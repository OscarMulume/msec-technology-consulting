import assert from 'node:assert/strict';
import test from 'node:test';
import { supabaseAuthHeaders } from '../src/lib/supabaseAuth.mjs';

test('clé publishable : apikey uniquement, sans Authorization', () => {
  const key = 'sb_publishable_exemple_123';

  assert.deepEqual(supabaseAuthHeaders(key), { apikey: key });
  assert.equal('Authorization' in supabaseAuthHeaders(key), false);
});

test('ancienne clé anon JWT : apikey et Authorization Bearer', () => {
  const key = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.signature';

  assert.deepEqual(supabaseAuthHeaders(key), {
    apikey: key,
    Authorization: `Bearer ${key}`,
  });
});
