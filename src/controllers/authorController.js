const authorModel = require("../models/authorModel");

//**************************************VALIDATION FUNCTIONS************************************************* */

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length > 0) return true;
  return false;
};

const isValidEmail = function (value) {
  const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexForEmail.test(value);
};

//*************************************REGISTER NEW AUTHOR************************************************************ */

const registerAuthor = async function (req, res) {
  try {
    let data = req.body;
    // //using destructuring
    const { name, email, password } = data;

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "First name is required" });
    }
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid email address" });
    }

    const isEmailUnique = await authorModel.findOne({ email: email });

    if (isEmailUnique) {
      return res
        .status(400)
        .send({ status: false, message: "Email already exist" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }
    let savedData = await authorModel.create(data);
    return res.status(201).send({ msg: savedData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: error.message });
  }
};

//**************************************EXPORTING BOTH HANDLERS********************************************* */

module.exports = { registerAuthor };
