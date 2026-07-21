import { OAuth2Client } from 'google-auth-library';

if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn('GOOGLE_CLIENT_ID is not set — Google Sign-In will fail until it is configured.');
}

export const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Used if you verify a Google ID token (the <GoogleLogin> One Tap/button flow).
export async function verifyGoogleIdToken(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

// Used for the popup-based useGoogleLogin flow, which returns an OAuth access
// token rather than an ID token. We exchange it for the user's profile via
// Google's userinfo endpoint instead of verifying a JWT locally.
export async function fetchGoogleUserInfo(accessToken) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Google user info');
  }

  const data = await response.json();
  // Normalize to the same shape verifyGoogleIdToken's payload has.
  return {
    sub: data.sub,
    email: data.email,
    name: data.name,
    picture: data.picture,
  };
}