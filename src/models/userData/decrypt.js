// Import the necessary libraries/modules
const crypto = require('crypto');
const { userData } = require('../../models/index.js');

// Function to decrypt and retrieve user data
async function decryptAndRetrieveUserData() {
  // Retrieve the encrypted data from the userData table
  const encryptedData = await retrieveEncryptedData();

  // Decrypt the encrypted data
  const decryptedData = decryptData(encryptedData.data, encryptedData.key);

  // Parse the decrypted data as JSON
  const userData = JSON.parse(decryptedData);

  // Return the decrypted user data
  return userData;
}

// Function to retrieve encrypted data from the userData table
async function retrieveEncryptedData() {
  try {
    // Retrieve the encrypted data from the userData table using the userData.get() method
    const encryptedData = await userData.get();
    console.log('Encrypted data retrieved from the userData table successfully.');

    // Return the encrypted data
    return encryptedData;
  } catch (error) {
    console.error('Error occurred while retrieving encrypted data:', error);
  }
}

// Function to decrypt data
function decryptData(encryptedData, encryptionKey) {
  // Create a decipher with the encryption key
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'));

  // Decrypt the data
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  // Return the decrypted data
  return decryptedData;
}

// Export the function as a module
module.exports = decryptAndRetrieveUserData;


// TODO How to use this as an export
// const decryptAndRetrieveUserData = require('./decrypt.js');

// // Example usage
// async function getUserData() {
//   const userData = await decryptAndRetrieveUserData();
//   console.log(userData);
// }

// getUserData();

