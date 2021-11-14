const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return undefined;
};


const urlsForUser = function(id, urlDatabase) {
  let userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

//will generate a random string of up to 6 characters for cookies, and shortURL
const generateRandomString = function() {
  let string = '';
  const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i <= 6; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
};

module.exports = {getUserByEmail, urlsForUser, generateRandomString};