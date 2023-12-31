'use strict';

// 3rd party resources
const express = require('express');
const dataModules = require('../models');

// Authentication
const basicAuth = require('../auth/middleware/basic');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');
const { checkJwt, checkRequiredPermissions } = require('../auth/middleware/auth0');


const router = express.Router();

// Connects our router to our model
router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  console.log(modelName);
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});


// // Handler for GET all records
// router.get('/:model', checkJwt, checkRequiredPermissions(['read:admin-messages']), handleGetAll);

// // Handler for GET a single record by ID
// router.get('/:model/:id', checkJwt, checkRequiredPermissions(['read:admin-messages']), handleGetOne);

// // Handler for creating a new record
// router.post('/:model', checkJwt, checkRequiredPermissions(['read:admin-messages']), handleCreate);

// // Handler for updating an existing record
// router.put('/:model/:id', checkJwt, checkRequiredPermissions(['read:admin-messages']), handleUpdate);

// // Handler for deleting an existing record

// router.delete('/:model/:id', checkJwt, checkRequiredPermissions(['delete:admin-messages']), handleDelete);

// Handler for GET all records
router.get('/:model', checkJwt, handleGetAll);

// Handler for GET a single record by ID
router.get('/:model/:id', checkJwt, handleGetOne);

// Handler for creating a new record
router.post('/:model', checkJwt, handleCreate);

// Handler for updating an existing record
router.put('/:model/:id', checkJwt, handleUpdate);

// Handler for deleting an existing record

router.delete('/:model/:id', checkJwt, checkRequiredPermissions(['read:admin-messages']), handleDelete);

// FOR TESTING WITHOUT AUTH
// router.get('/:model', handleGetAll);
// router.get('/:model/:id', handleGetOne);
// router.post('/:model', handleCreate);
// router.put('/:model/:id', handleUpdate);
// router.delete('/:model/:id', handleDelete);

// Handler function for GET all records
async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  console.log('********', allRecords);
  res.status(200).json(allRecords);
}

// Handler function for GET a single record by ID
async function handleGetOne(req, res, next) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id);
    res.status(200).json(theRecord);
  } catch (e) {
    next(e.message || e);
  }
}

// Handler function for creating a new record
async function handleCreate(req, res, next) {
  try {
    let obj = req.body;
    // TODO not the same model, string vs obj
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (e) {
    next(e.message || e);
  }
}

// Handler function for updating an existing record
async function handleUpdate(req, res, next) {
  try {
    const id = req.params.id;
    const obj = req.body;
    console.log('********', id, obj);
    let updatedRecord = await req.model.update(id, obj);
    res.status(200).json(updatedRecord);
  } catch (e) {
    next(e.message || e);
  }
}

// Handler function for deleting an existing record
async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

module.exports = router;
