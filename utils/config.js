const { SALT_ROUND = 10, JWT_SECRET = 'some-secret-key' } = process.env;
const urlRegex = /^https?:\/\/(w{3}\.)?[0-9a-z.-]{1,256}(\/([0-9a-z\-._~:/?#[\]@!$&'()*+,;=])*)?/i;

module.exports = {
  SALT_ROUND: Number(SALT_ROUND),
  JWT_SECRET,
  urlRegex,
};
