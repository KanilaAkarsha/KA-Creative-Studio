import { OAuth2Client } from 'google-auth-library';

if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn('GOOGLE_CLIENT_ID is not set — Google Sign-In will fail until it is configured.');
}

export const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleIdToken(idToken) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}
