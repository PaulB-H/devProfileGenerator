var fs = require('fs');
var pdf = require('html-pdf');
// var html = fs.readFileSync('./newfile.html', 'utf8');
var options = { format: 'Letter' };
var axios = require('axios');
var inquirer = require('inquirer');

let userQuery = "";

var questions = [
  {
    type: 'input',
    name: 'userQuery',
    message: 'Enter a GitHub Username',
  },
];

async function myInquirer(){
  var answers = await inquirer.prompt(questions);
  var response = await axios.get(`https://api.github.com/users/${answers.userQuery}`);
  var myHTML = createHTML(response);
  createPDF(myHTML);
};

function createPDF(html){
  console.log(`we are passing this: ${html}`)
  var newPdf = pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res);
  });
  return newPdf;
};

myInquirer();

function createHTML (res){
 let myHTML =  (`<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  </head>
  <body>
  <style>
  * {
      margin: 0;
      padding: 0;
  }

  img {
    width: 150px;
    height: 150px;
    border-radius: 30px;
  }

  #content {
      display: flex;
      align-items: center;
      flex-direction: column;
  }

  li {
      text-decoration: none;
      list-style: none;
  }
  </style>
    <div id="content">
      <h1 id="userName">${res.data.name}</h1>
      <div id="profileImg">
        <img src="${res.data.avatar_url}">
      </div>
      <h3>${res.data.bio}</h3>
      <table>
          <tr>
              <td style="text-align: center;">Location: ${res.data.location}</td>
          </tr>
          <tr>
              <td><li><a href="${res.data.url}">Link to Profile</a></li></td>
              <td><li><a href="${res.data.blog}">Link to Blog</a></li></td>
          </tr>
          <tr>
              <td>Followers: ${res.data.followers}</td>
              <td>Following: ${res.data.following}</td>
          </tr>
          <tr>
            <td>Public Repos: ${res.data.public_repos}</td>
          </tr>
      </table> 
    </div>
  </body>
  </html>
    `);

    return myHTML;
    
  };