const { SALT_ROUND = 10, JWT_SECRET = 'some-secret-key' } = process.env;

module.exports = {
  SALT_ROUND: Number(SALT_ROUND),
  JWT_SECRET,
};
