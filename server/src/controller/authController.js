const { comparePasssword } = require("../utils/utils");
const Auth = require("../models/auth");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Auth.getUser(username);

    if (!user.length) {
      return res.status(400).send({
        message: "Can't find username: " + username,
      });
    }

    const { password: userPassword, ...rest } = user[0];
    const isPasswordMatched = await comparePasssword(password, userPassword);

    if (isPasswordMatched) {
      const token = jwt.sign({ ...rest }, "shhhhh", { expiresIn: "10h" });
      res.status(200).send({
        message: "Login Success",
        data: {
          ...rest,
          authToken: token,
        },
      });
    } else {
      res.status(400).send({
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    console.log(error);
    console.error({ message: "Failed to authorize, please try again later" });
    res.status(500).send({
      message: "Something wrong with the server please try again later",
    });
  }
};
