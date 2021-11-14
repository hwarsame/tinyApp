const { assert } = require('chai');

const { getUserByEmail } = require("../helper");
// User database to be tested
const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "User0": {
    id: "User0",
    email: "chicken@gmail.com",
    password: "hello123"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
  });
  it('should return undefined when looking for a non-existent email', () => {
    const user = getUserByEmail('ppp@gmail.com', testUsers);
    assert.equal(user, undefined);
  });
  it('should return a user with valid email', function() {
    const user = getUserByEmail("chicken@gmail.com", testUsers);
    const expectedUserID = "User0";
    // Write your assert statement here
  });
});