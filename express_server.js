const { request } = require("express");
const express = require("express");
const app = express();
const PORT = 8000; // default port 8000
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');



const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
  let string = '';
  const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (i = 0; i <= 6; i++) {
    string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return string;
}

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.post("/urls", (req, res) => {
  let longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  //Adds both urls to database, while shortURL being the random generated one
  urlDatabase[shortUrl] = longUrl;
  const templateVars = {shortURL  :shortUrl, longURL :longUrl};
  res.render('urls_show', templateVars);
  // res.redirect('/url/:shortURL');
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/url/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
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