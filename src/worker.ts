/// <reference types="@cloudflare/workers-types" />

import { ExecutionContext } from '@cloudflare/workers-types';

export interface Env {
  // Add any environment variables you need
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    
    // Check if this is the URL pattern we want to redirect
    if (url.hostname === 'rewrite.flerken.co.nz') {
      // Extract all query parameters
      const params = url.searchParams;
      
      // Extract inviteCode specifically
      const inviteCode = params.get('inviteCode');
      
      // Create the new URL
      const newUrl = new URL('https://auth-uat.nzpost.co.nz/authorize');
      
      // If inviteCode exists, add it first
      if (inviteCode) {
        newUrl.searchParams.append('inviteCode', inviteCode);
        params.delete('inviteCode'); // Remove so we don't add it twice
      }
      
      // Add all remaining parameters
      params.forEach((value: string, key: string) => {
        newUrl.searchParams.append(key, value);
      });
      
      // Return a redirect response
      return Response.redirect(newUrl.toString(), 301);
    }
    
    // Pass through any other requests
    return new Response('No redirect configured for this URL', { status: 404 });
  },
}; 