const userService = require('../services/userService');
const healthzService = require('../services/healthzService');
const e = require('express');
const {logger} = require('../config/config');
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();
async function getUser(req, res) {
  try {
    const isDatabaseConnected = await healthzService.checkDatabaseConnection();
          } catch (error) {
            logger.error({message: 'Error checking database connection:', additionalData: { subsystem: error } });
            //console.error('Error checking database connection:',error);
            return res.status(503).header('Cache-Control', 'no-cache').send();
          }
  try{    

    if (Object.keys(req.body).length > 0 ) {
      logger.warn({ message: 'Invalid request body detected in getUser' });
      res.status(400).header('Cache-Control', 'no-cache').send();
      return;
    }
  const authHeader = req.headers.authorization;
  const User = await userService.getUser(authHeader);
  if(!User.verified){
    logger.warn({ message: 'User not verified' });
    res.status(403).send();
   return;
  }
  const responseObject = {
    id: User.id,
    first_name: User.first_name,
    last_name: User.last_name,
    username: User.username,
    account_created: User.account_created.toISOString(),
    account_updated: User.account_updated.toISOString(),
  };
  res.set({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Origin',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache'
  });
  
  res.status(200).json(responseObject);
  } catch (error) {
    logger.error({ message: 'Error getting user:', error });
    res.status(401).send();
  }
  }

  async function createUser(req, res) {
    try {
      const isDatabaseConnected = await healthzService.checkDatabaseConnection();
            } catch (error) {
              logger.error({ message: 'Error checking database connection:', error });
              return res.status(503).header('Cache-Control', 'no-cache').send();
            }
    try {
      if (Object.keys(req.body).length !== 4) {
        logger.warn({ message: 'Invalid request body length detected in createUser' });
        res.status(400).header('Cache-Control', 'no-cache').send();
        return;
      }
      const seenKeys = new Set();

      for (const key in req.body) {
        if (seenKeys.has(key)) {
          logger.error({ message: 'Duplicate key detected in createUser', key });
          return res.status(400).send();
        }
        
        seenKeys.add(key);
      }
    
      const updatedFields = Object.keys(req.body);
      const allowedFields = ['first_name', 'last_name', 'password','username'];
  
      if (!updatedFields.every(field => allowedFields.includes(field))) {
        logger.error({ message: 'Invalid field detected in createUser' });
        return res.status(400).send();
      }
        const { first_name, last_name, password, username } = req.body;
        const newUser = await userService.createUser(first_name, last_name, password, username);
   
        // if(newUser.username==='jane.doe@example.com') {newUser.verified = true; await newUser.save();}
      
        if(newUser.verified===false){
        const messageObject = {
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          username: newUser.username,
          id: newUser.id
      };

      // Publishing message to Pub/Sub topic
    
      const topicName = 'verify_email'; 
      const dataBuffer = Buffer.from(JSON.stringify(messageObject));
      await pubsub.topic(topicName).publish(dataBuffer);
      }
        const responseObject = {
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            username: newUser.username,
            account_created: newUser.account_created.toISOString(), 
            account_updated: newUser.account_updated.toISOString(), 
          };
          res.set({
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Origin',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
          });
          logger.info({ message: 'New User Created' });
          res.status(201).json(responseObject);
   
              } catch (error) {
                logger.error({ message: 'Error creating user:', error });
             //   console.error(error);
                res.status(400).send();
                      }
  }

  async function updateUser(req, res) {
    try {
      const isDatabaseConnected = await healthzService.checkDatabaseConnection();
            } catch (error) {
              logger.error({ message: 'Error checking database connection:', error });
              return res.status(503).header('Cache-Control', 'no-cache').send();
            }
    try {
      
      if (Object.keys(req.body).length !== 3) {
        logger.warn({ message: 'Invalid request body length detected in updateUser' });
        res.status(400).header('Cache-Control', 'no-cache').send();
        return;
      }
      const updatedFields = Object.keys(req.body);
      const allowedFields = ['first_name', 'last_name', 'password'];
  
      if (!updatedFields.every(field => allowedFields.includes(field))) {
        logger.error({ message: 'Invalid field detected in updateUser' });
        return res.status(400).send();
      }
      const authHeader = req.headers.authorization;
      const User = await userService.getUser(authHeader);
      if(!User.verified){
        logger.warn({ message: 'User not verified' });
        res.status(403).send();
       return;
      }
      const { first_name, last_name, password } = req.body;
      const updatedUser = await userService.updateUser(authHeader,first_name, last_name, password);
      res.status(204).send();
      logger.info({message: 'User updated'});

              } catch (error) {
                logger.error({ message: 'Error updating user:', error });
                res.status(401).send();
              }
  }

  async function verifyUser(req, res) {
    try {
      const isDatabaseConnected = await healthzService.checkDatabaseConnection();
            } catch (error) {
              logger.error({ message: 'Error checking database connection:', error });
              return res.status(503).header('Cache-Control', 'no-cache').send();
            }
      
      try{
        console.log(req.query);
        const {id} = req.query;
        const verifiedUser = await userService.verifyUser(id);
        res.status(200).send("Email Verified");
        logger.info({message: 'User Verified'});
      }
      catch(error){
        logger.error({ message: 'Link Expired', error });
        res.status(410).send("Link Expired");
      }
  }


  module.exports = {getUser,updateUser,createUser ,verifyUser};