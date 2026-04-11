const jwt = require('jsonwebtoken');

/**
 * Generates a JWT for Jitsi as a Service (8x8)
 */
const generateJaaSJWT = (roomName, user, appId, kid, privateKey) => {
  const now = new Date();
  
  const payload = {
    aud: 'jitsi',
    iss: 'chat',
    sub: appId,
    room: roomName,
    iat: Math.floor(now.getTime() / 1000),
    exp: Math.floor(now.getTime() / 1000) + (3 * 60 * 60), // Valid for 3 hours
    nbf: Math.floor(now.getTime() / 1000) - 10,
    context: {
      user: {
        id: user?._id || 'guest-' + Math.random().toString(36).substring(7),
        name: user?.name || 'Guest User',
        email: user?.email || '',
        avatar: '',
        moderator: user?.role === 'admin' ? 'true' : 'false'
      },
      features: {
        livestreaming: 'true',
        recording: 'true',
        transcription: 'true',
        'outbound-call': 'false'
      }
    }
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256', header: { kid } });
};

module.exports = { generateJaaSJWT };
