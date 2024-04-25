const model = require("mongoose").model;

const PasswordsSchema = require("./passwords.schema.cjs");

const PasswordsModel = model("Passwords", PasswordsSchema);

function insertPassword(password) {
  return PasswordsModel.create(password);
}

function getAllPasswords() {
  return PasswordsModel.find().exec();
}

function getPasswordsById(id) {
  return PasswordsModel.findById(id).exec();
}

// function getPasswordsById() {
//   return PasswordsModel.find().exec();
// }

function deletePassword(id) {
  return PasswordsModel.deleteOne({ _id: id });
}

function updatePassword(id, password) {
  return PasswordsModel.findOneAndUpdate({ _id: id }, password);
}

function getPasswordsByUser(user) {
  return PasswordsModel.find({
    user: user,
  }).exec();
}
function getPasswordsBySite(user, site) {
  return PasswordsModel.find({
    user: user,
    site: site,
  }).exec();
}

module.exports = {
  insertPassword,
  getAllPasswords,
  getPasswordsById,
  getPasswordsByUser,
  getPasswordsBySite,
  updatePassword,
  deletePassword,
  // getPokemonById,
  // deletePokemon,
  // updatePokemon,
  // insertPokemon,
  // getAllPokemon,
  // getPokemonByOwner
};
