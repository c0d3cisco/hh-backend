'use strict';


// // TODO this might be userData
// const { users } = require('.');
// const encryptAndStoreUserData = require('./userData/encrypt');
// const decryptAndRetrieveUserData = require('./userData/decrypt');

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(userId) {
    if (userId) {
      // Find a single record by ID
      return this.model.findAll({ where: { userId } });
    }
    else {
      // Find all records
      return this.model.findAll({});
    }
  }

  // TODO we aren't hitting here correctly
  // TODO Work on getting encryption to work, currently not making it into the function
  // Want to check if the model is userData and then we would encrypt it.
  create(record) {
    // Create a new record

    return this.model.create(record);
  }

  async update(userId, data) {
    // Find a record by ID
    let result = await this.model.findOne({ where: { userId } });
    // Update the record with new data
    let modifiedData = await result.update(data);
    return modifiedData;
  }

  delete(userId) {
    // Delete a record by ID
    return this.model.destroy({ where: { userId } });
  }

  async readWithAssociations(associatedModel, id = null) {
    try {
      if (id) {
        // Find all records with associated model based on ID
        return await this.model.findAll({
          include: { model: associatedModel },
          where: { id: id },
        });
      } else {
        // Find all records with associated model
        return await this.model.findAll({ include: { model: associatedModel } });
      }
    } catch (error) {
      console.error('ModelInterface isn\'t reading', error);
      return error;
    }
  }

}

module.exports = DataCollection;
