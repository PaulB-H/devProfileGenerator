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

 let myHTML = (`<!DOCTYPE html>
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
      <h1 id="userName">${response.data.name}</h1>
      <div id="profileImg">
        <img src="${response.data.avatar_url}">
      </div>
      <h3>${response.data.bio}</h3>
      <table>
          <tr>
              <td style="text-align: center;">Location: ${response.data.location}</td>
          </tr>
          <tr>
              <td><li><a href="${response.data.url}">Link to Profile</a></li></td>
              <td><li><a href="${response.data.blog}">Link to Blog</a></li></td>
          </tr>
          <tr>
              <td>Followers: ${response.data.followers}</td>
              <td>Following: ${response.data.following}</td>
          </tr>
          <tr>
            <td>Public Repos: ${response.data.public_repos}</td>
          </tr>
      </table> 
    </div>
  </body>
  </html>
    `);
    generateStuff(myHTML);
    console.log(myHTML);
};

async function generateStuff(html){
  var newHTML = await fs.writeFile('newfile.html', html, function (err) {
  if (err) throw err;
  console.log('File is created successfully.');
  });
  readAndGenerate();
  console.log(`File read success`);
}

async function readAndGenerate(){
  var newHTML = await fs.readFileSync('./newfile.html', 'utf8');
  createPDF(newHTML);
}

async function createPDF(html){
  console.log(`we are passing this: ${html}`)
  var newPdf = await pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res);
  });

  return newPdf;
};

myInquirer();


// var myHTML = async function generateStuff(){

  // var html = await fs.writeFile('newfile.html', myHTML, function (err) {
  //   if (err) throw err;
  //   console.log('File is created successfully.');
  // });

//   var newHTML = fs.readFileSync('./newfile.html', 'utf8');
//   console.log(`File read success, ${newHTML}`);

//   return newHTML;

// };
  
// async function createPDF(html){
//   console.log(`we are passing this: ${html}`)
//   var newPdf = await pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
//     if (err) return console.log(err);
//     console.log(res);
//   });

//   return newPdf;
// };

//   // createPDF(myHTML);

// });