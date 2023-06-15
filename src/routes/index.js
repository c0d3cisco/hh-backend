'use strict';

const express = require('express');
const dataModules = require('../models');

const basicAuth = require('../auth/middleware/basic');
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');

const router = express.Router();

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

// router.get('/:model', basicAuth, handleGetAll);
// router.get('/:model/:id', basicAuth, handleGetOne);
// router.post('/:model', bearerAuth, acl('create'), handleCreate);
// router.put('/:model/:id', bearerAuth, acl('update'), handleUpdate);
// router.delete('/:model/:id', bearerAuth, acl('delete'), handleDelete);

// FOR TESTING WITHOUT AUTH
router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  console.log('********', allRecords);
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res, next) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id);
    res.status(200).json(theRecord);
  } catch(e){
    next(e.message || e);
  }
}

async function handleCreate(req, res, next) {
  try {
    let obj = req.body;
    // TODO not the same model, string vs obj
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch(e){
    next(e.message || e);
  }

}

async function handleUpdate(req, res, next) {
  try {
    const id = req.params.id;
    const obj = req.body;
    console.log('********', id, obj);
    let updatedRecord = await req.model.update(id, obj);
    res.status(200).json(updatedRecord);
  } catch(e){
    next(e.message || e);
  }
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}


module.exports = router;
