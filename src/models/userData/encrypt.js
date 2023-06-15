// Import the necessary libraries/modules
const crypto = require('crypto');

// Function to encrypt and store user data
async function encryptAndStoreUserData(userData) {
  console.log('We are inside encryption with userdata', userData);

  // Convert user data to string
  const userDataString = JSON.stringify(userData);
  console.log('userDataString', userDataString);

  // Encrypt the user data
  const encryptedData = encryptData(userDataString);
  console.log('encryptedData', encryptedData);

  // Store the encrypted data in the userData table
  await storeEncryptedData(encryptedData);

  console.log('User data encrypted and stored successfully.');
}

// Function to encrypt data
function encryptData(data) {
  // Generate a random encryption key
  const encryptionKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  // console.log('Encryption Key:', encryptionKey);
  // console.log('IV:', iv);

  // Create a cipher with the encryption key
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  // console.log('Cipher:', cipher);

  // Encrypt the data
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  console.log('Encrypted Data:', encryptedData);
  encryptedData += cipher.final('hex');
  // console.log('Final Encrypted Data:', encryptedData);

  // Return the encrypted data along with the encryption key
  return { data: encryptedData, key: encryptionKey.toString('hex') };
}

// Function to store encrypted data in the userData table
async function storeEncryptedData(encryptedData) {
  const { users } = require('../../models/index');
  console.log('This is our users in storeencrypted', users);
  try {
    console.log(encryptData);
    // Store the encrypted data in the userData table using the userData.create() method
    await users.create(encryptedData);
    console.log('Encrypted data stored in the userData table successfully.');
  } catch (error) {
    console.error('Error occurred while storing encrypted data:', error);
  }
}

// Export the function as a module
module.exports = encryptAndStoreUserData;

// TODO How to use this as an export
// const encryptAndStoreUserData = require('./encrypt.js');

// // Example usage
// const userInfo = {
//   name: 'John Doe',
//   email: 'johndoe@example.com',
//   // Add other properties as needed
// };

// encryptAndStoreUserData(userInfo);


// This is our encryption inside of data-collections to be added later
// TODO we aren't hittin here correctly
// TODO Work on getting encrpytion to work, currently not making it into the function
// Want to check if the model is  userData and then we would encrypt it.
// create(record) {
//   const { users } = require('.');
//   // If the model is userData, encrypt and store the record in the database, else create the record
//   if (this.model === users) {
//     return encryptAndStoreUserData(record);
//   } else {
//     return this.model.encryptAndStoreUserData(record);
//   }// }