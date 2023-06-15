'use strict';

// // TODO this might be userData
// const { users } = require('.');
// const encryptAndStoreUserData = require('./userData/encrypt');
// const decryptAndRetrieveUserData = require('./userData/decrypt');
class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(id) {
    if (id) {
      return this.model.findOne({ where: { id } });
    }
    else {
      return this.model.findAll({});
    }
  }

  // TODO we aren't hittin here correctly
  // TODO Work on getting encrpytion to work, currently not making it into the function
  // Want to check if the model is  userData and then we would encrypt it.
  create(record) {

    return this.model.create(record);
  }

  async update(id, data) {
    let result = await this.model.findOne({ where: { id } });
    let modifiedData = await result.update(data);
    return modifiedData;
  }

  delete(id) {
    return this.model.destroy({ where: { id } });
  }

  async readWithAssociations(associatedModel, id = null) {
    try {
      if (id) {
        return await this.model.findAll({
          include: { model: associatedModel },
          where: { id: id },
        });
      } else {
        return await this.model.findAll({ include: { model: associatedModel } });
      }
    } catch (error) {
      console.error('ModelInterface isn\'t reading', error);
      return error;
    }
  }

}

module.exports = DataCollection;
