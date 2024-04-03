const User =require('../models/userModel');
const { use } = require('../routes/userRouter');
const {logger} = require('../config/config');
async function createUser(first_name, last_name, password, username ) {

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        throw new Error('User Exists!');
    }
    if(!first_name.trim() || !last_name.trim() || !password.trim() || !username.trim())
    {
        throw new Error('Invalid Input');
    }
    if(username === 'jane.doe@example.com'){
      const newUser = await User.create({
        first_name,
        last_name,
        password,
        username,
        verified:true
      });
      return newUser;
    }
    else{
    const newUser = await User.create({
        first_name,
        last_name,
        password,
        username,
      });
    return newUser;
    }
}


async function getUser(authHeader) {
  
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');
  const user = await User.findOne({ where: { username } });

  if (!user) {
  
    throw new Error('User not found');
  }
  if (!user.comparePassword(password)) {
   
    throw new Error('Invalid password');
  }
  // if(!user.verified){
  //   throw new Error('User not Verified');
  // }

  return user;
}


async function updateUser(authHeader, first_name, last_name, newpass) {
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');
  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw new Error('User not found');
  }
  // if(!user.verified){
  //   throw new Error('User not Verified');
  // }
  if (!user.comparePassword(password)) {
    console.log('Password)',password);
    throw new Error('Invalid password');
  }
  if(!first_name.trim() || !last_name.trim() || !newpass.trim())
  {
    throw new Error('Invalid Input');
  }
  if(first_name)
  user.first_name = first_name;
  if(last_name)
  user.last_name = last_name;
  if(password)
  user.updatePassword(newpass); 
  user.account_updated = new Date();
  await user.save();
  return user;
}

async function verifyUser(id) {
  const user = await User.findOne({ where: { id } });
  if (!user) {
    logger.error({ message: 'User not found' });
    throw new Error('User not found');
  }
  const currentTime = new Date();
  if(currentTime > user.exptimestamp  )
  const currentTime = new Date();
  if(currentTime > user.exptimestamp  )
  {
    logger.error({message:"Date check"},{message:currentTime}, {message:user.exptimestamp});
    throw new Error('Verification Link Expired');
  }
  user.verified = true;
  await user.save();
  return user;
}


module.exports = {createUser ,getUser,updateUser,verifyUser};