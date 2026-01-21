exports.isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/.test(password);

exports.isValidName = (name) =>
  name.length >= 20 && name.length <= 60;

exports.isValidAddress = (address) =>
  address.length <= 400;
