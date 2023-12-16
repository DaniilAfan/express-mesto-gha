const userData = (user) => ({
  _id: user._id,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  email: user.email,
});

module.exports = { userData };
