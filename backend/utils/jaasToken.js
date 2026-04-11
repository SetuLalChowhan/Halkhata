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
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: '',
        moderator: 'true'
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
