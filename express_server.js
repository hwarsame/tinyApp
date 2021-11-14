const { request } = require("express");
const express = require("express");
const app = express();
const PORT = 8000; // default port 8000
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
// app.use(cookieSession());

app.set('view engine', 'ejs');

// Our database for URLS
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};
//Accounts which are registered
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "helloworld"
  }
};
//email checker function (returns a user object for the given email)
const emailChecker = function(email) {
  for (keys in users) {
    if (users[keys].email === email) {
      return users[keys];
    }
  }
  return null;
};

const urlsForUser = function(id, urlDatabase) {
  let userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID=== id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
};

//will generate a random string of up to 6 characters for cookies, and shortURL
function generateRandomString() {
  let string = '';
  const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i <= 6; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
}

app.get('/urls', (req, res) => {
  const user_id = req.cookies.user_id
  if (!user_id){
    res.status(401).send('You must be logged in to view the urls')
  }
  // const user = users[user_id];;
  const templateVars = { urls: urlDatabase, user: req.cookies.user_id};
  // const templateVars = { urls: urlsForUser(user_id.id, urlDatabase), user: req.cookies.user_id};
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortUrl = generateRandomString();
  //Adds both urls to database, while shortURL being the random generated one
  urlDatabase[shortUrl] = {longURL, userID: req.cookies.user_id.id};
  const templateVars = {shortURL: shortUrl, longURL: urlDatabase[shortUrl].longURL, user: req.cookies.user_id};
  res.render('urls_show', templateVars);
  // res.redirect('/url/:shortURL');
});
// Registering a new user
app.post('/register', (req, res) => {
  let userIdentity = generateRandomString();
  const id = userIdentity;
  const email = req.body.email;
  const password = req.body.password;
    
  if (!email || !password) {
    res.status(400).send('Please use a valid email or password');
  } else if (emailChecker(email)) {
    res.status(400).send('There is already an existing account with that email address.');
  } else {
    const user = {
      id : id,
      email : email,
      password : bcrypt.hashSync(password, 10)
    };
    // hashedPass = bcrypt.hashSync(req.body.password, 10);
    users[id] = user;
    res.cookie("user_id", {id: id, email: email});
    res.redirect("/urls");
      
  }
  
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user: null}
  let user = req.cookies.user_id
  if (!user){
    return res.redirect('/login')
  } 
    templateVars.user = user
    res.render("urls_new", templateVars);
    return;
});
//Get shortURL
app.get('/urls/:shortURL', (req, res) => {
  const user = req.cookies.user_id 
  if (!user){
    res.status(401).send('You must be logged in to access this page.')
  }
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: req.cookies.user_id};
  res.render('urls_show', templateVars);
});

//Delete button
app.post(`/urls/:shortURL/delete`, (req, res) => {
  const user = req.cookies.user_id
  if (!user){
    return res.status(401).send('You must be logged in to access this feature');
  }
  const userUrls = urlsForUser(user.id, urlDatabase)
  let shortURL = req.params.shortURL;
  if (!Object.keys(userUrls).includes(shortURL)){
    return res.status(401).send('You are not permitted to delete this URL')
  };
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

  
//Edit button
app.post('/urls/:shortURL', (req, res) => {
  const user_id = req.cookies.user_id
  if (!user_id) {
    return res.status(401).send('You must be logged in to access this feature')
  }
  const userUrls = urlsForUser(user_id.id, urlDatabase)
  let shortURL = req.params.shortURL;
  if (!Object.keys(userUrls).includes(shortURL)){
    return res.status(401).send('You are not permitted to edit this URL')
  };
  let longURL = req.body.longURL;
  urlDatabase[req.params.shortURL].longURL = longURL
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//Log out of TinyApp
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});


//Login page should show
app.get('/login', (req, res) => {
  const templateVars = {user: null};
  res.render('urls_login', templateVars);
});

//Log user into tinyApp
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  const user = emailChecker(email);
  if (user) {
    console.log('USER DATA#####', user);
    if (bcrypt.compareSync (password , user.password)) {
      res.cookie('user_id', user)
      res.redirect('/urls')
      console.log('LOG IN PASSWORD >>>>>', user.password)
    } else {
      res.send('Invalid password')
    }
  } else {
    res.send('Invalid login credentials');
  }
});

//Logout button
app.get('/logout', (req, res)=> {
  res.clearCookie('user_id');
  res.redirect('/urls');
});



//Register button
app.post('/register', (req, res) => {
  res.redirect('/urls');
});


//Register an account page should show up
app.get('/register', (req, res) => {
  res.render('urls_registration',{user: null});
  
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});