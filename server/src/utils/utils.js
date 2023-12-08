const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function hashPassword(pass) {
  try {
    const salt = Math.round(Math.random());
    const password = await bcrypt.hash(pass, salt);
    return password;
  } catch (error) {
    console.log(error);
  }
}

async function comparePasssword(inputPass, hashedPass) {
  try {
    const isMatch = await bcrypt.compare(inputPass, hashedPass);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
}

async function isAuthenticated(token) {
  const _token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(_token, "shhhhh");
    if (decoded) {
      return decoded;
    }
  } catch (error) {
    // console.log(error);
    console.log("Token Expired");
    return false;
  }
}

module.exports = { comparePasssword, hashPassword, isAuthenticated };
