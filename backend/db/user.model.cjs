const model = require("mongoose").model;
const UserSchema = require("./user.schema.cjs");

const UserModel = model("user", UserSchema);

function insertUser(user) {
  return UserModel.create(user);
}

function getUserByUsername(username) {
  return UserModel.findOne({ username: username }).exec();
}

// function getPokemonById(id) {
//     return PokemonModel.findById(id).exec();
// }

// function deletePokemon(id) {
//     return PokemonModel.deleteOne({_id: id})
// }

// function updateUserPsw(id, psw) {
//   return UserModel.findOneAndUpdate({ _id: id }, psw);
// }

// function getPokemonByOwner(owner) {
//     return PokemonModel.find({
//         owner: owner,
//     }).exec();
// }

module.exports = {
  insertUser,
  getUserByUsername,
  // updatePokemon,
  // insertPokemon,
  // getAllPokemon,
  // getPokemonByOwner
};
