const User = require("../models/users");
const { comparePasssword, hashPassword } = require("../utils/utils");

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.getAllUser();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req?.params;
  const num = Number(id);
  if (!Number.isFinite(num))
    return res.json({ message: "ID harus angka", status: 400 });
  try {
    const user = await User.getUserById(id);
    if (!user)
      return res
        .status(404)
        .json({ message: "ID tidak dapat ditemukan", status: 404 });
    const { password, ...rest } = user;
    res.json(rest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

exports.createUser = async (req, res) => {
  const hashedPass = await hashPassword(req.body.password);
  const body = {
    ...req.body,
    password: hashedPass,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    const response = await User.createUser(body);
    if (response?.message) {
      return res.send(response);
    }
    res.send({
      message: "User Added",
      status: 200,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Interval Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await User.deleteUser(id);
    if (response)
      res.send({
        message: "User Deleted",
        status: 204,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Interval Server Error" });
  }
};
