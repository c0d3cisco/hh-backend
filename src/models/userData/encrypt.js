// Import the necessary libraries/modules
const crypto = require('crypto');
const { userData } = require('../../models/index.js');

// Function to encrypt and store user data
async function encryptAndStoreUserData(userData) {
  console.log('We are inside encryption with userdata', userData);

  // Convert user data to string
  const userDataString = JSON.stringify(userData);
  // console.log('userDataString', userDataString);

  // Encrypt the user data
  const encryptedData = encryptData(userDataString);
  // console.log('encryptedData', encryptedData);

  // Store the encrypted data in the userData table
  await storeEncryptedData(encryptedData);

  console.log('User data encrypted and stored successfully.');
}

// Function to encrypt data
function encryptData(data) {
  // Generate a random encryption key
  const encryptionKey = crypto.randomBytes(32);

  // Create a cipher with the encryption key
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey);

  // Encrypt the data
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  // Return the encrypted data along with the encryption key
  return { data: encryptedData, key: encryptionKey.toString('hex') };
}

// Function to store encrypted data in the userData table
async function storeEncryptedData(encryptedData) {
  try {
    // Store the encrypted data in the userData table using the userData.create() method
    await userData.create(encryptedData);
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
