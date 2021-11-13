const { request } = require("express");
const express = require("express");
const app = express();
const PORT = 8000; // default port 8000
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())

app.set('view engine', 'ejs');


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
}
//email checker function
const emailChecker = function(email){
for (keys in users){
  if (users[keys].email === email){
    return users[keys]
  }
}
  return null;
}


//will generate a random string of up to 6 characters for cookies, and shortURL
function generateRandomString() {
  let string = '';
  const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (i = 0; i <= 6; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
}

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies.user_id};
  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>', req.cookies.userID)
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  let longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  //Adds both urls to database, while shortURL being the random generated one
  urlDatabase[shortUrl] = longUrl;
  const templateVars = {shortURL  :shortUrl, longURL :longUrl, user: req.cookies.user_id};
  res.render('urls_show', templateVars); 
  // res.redirect('/url/:shortURL');
});
// Registering a new user
app.post('/register', (req, res) => {
  let userIdentity = generateRandomString();
     const id = userIdentity
     const email = req.body.email
     const password = req.body.password
    
    if (!email || !password){
      res.status(400).send('Please use a valid email or password');
    } else if (emailChecker(email)){
      res.status(400).send('There is already an existing account with that email address.');
    } else {
      const user = {
        id : id,
        email : email,
        password : password
        };
        users[id] = user;
        const cookieUser = user
        res.cookie("user_id", cookieUser);
        //console.log to see output
        console.log(req.cookies.user_id);
        console.log(users);
        res.redirect("/urls");
        
;    
      
    }
  
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", { user: ''}); 
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: req.cookies.user_id};
  res.render('urls_show', templateVars);
});

//Delete button
app.post(`/urls/:shortURL/delete`, (req, res) => {
  // GET short URL 
  // Use the short URL to delete the data from database
  // redirect to urls page
    delete urlDatabase[req.params.shortURL]
    res.redirect("/urls")
  });

  
  //Edit button
  app.post('/urls/:shortURL', (req, res) => {
    //get the short URL
    const shortURL = req.params.shortURL;
    let longURL = req.body.longURL;
    urlDatabase[shortURL] = longURL;
    res.redirect('/urls');
  })

app.get("/u/:shortURL", (req, res) => {
  longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//Login to tinyApp
app.post('/login', (req, res) => {
  
 const cookieUser = req.body.username;
 res.cookie('user_id', cookieUser);   
 res.redirect('/urls');
  // console.log('==========', req)
})
//Log out of TinyApp
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

//Register button
app.post('/register', (req, res) => {
  res.redirect('/urls')
})


//Register an account page should show up
app.get('/register', (req, res) => {
  res.render('urls_registration',{user:''});
  
})

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
})

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