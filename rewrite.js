addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  /**
   * Redirect requests from rewrite.flerken.co.nz to auth-uat.nzpost.co.nz
   * @param {Request} request
   */
  async function handleRequest(request) {
    const url = new URL(request.url)
    
    // Check if this is the URL pattern we want to redirect
    if (url.hostname === 'rewrite.flerken.co.nz') {
      // Extract all query parameters
      const params = url.searchParams
      
      // Extract inviteCode specifically
      const inviteCode = params.get('inviteCode')
      
      // Create the new URL
      const newUrl = new URL('https://auth-uat.nzpost.co.nz/authorize')
      
      // If inviteCode exists, add it first
      if (inviteCode) {
        newUrl.searchParams.append('inviteCode', inviteCode)
        params.delete('inviteCode') // Remove so we don't add it twice
      }
      
      // Add all remaining parameters
      params.forEach((value, key) => {
        newUrl.searchParams.append(key, value)
      })
      
      // Return a redirect response
      return Response.redirect(newUrl.toString(), 301)
    }
    
    // Pass through any other requests
    return new Response('No redirect configured for this URL', { status: 404 })
  }