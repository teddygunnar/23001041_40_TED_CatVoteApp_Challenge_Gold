const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");

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
  if (token) {
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
  return false;
}

function socketBroadcast(ws, data) {
  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = socketBroadcast;

module.exports = {
  comparePasssword,
  hashPassword,
  isAuthenticated,
  socketBroadcast,
};
