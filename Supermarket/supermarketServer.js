const http = require("http");
const path = require("path");
const bodyParser = require("body-parser"); /* To handle post parameters */
const express = require("express"); /* Accessing express module */
const app = express(); /* app is a request handler function */
const portNumber = 5000;
/* directory where templates will reside */



class Shopper {
  #items;
  #bought

  constructor(items,bought) {
    this.#items = items;
    this.#bought = bought;
  }

  table() {

    let ordertable = "<table border = \"1\"> <tr> <th> Item </th> <th> Cost </th> </tr>";
    let total = 0;
    
    let trimmedPurchase = this.#bought.map(element => {
      return element.trim();
    });

    
    for (let item of this.#items) {
      let {name,cost} = item;
       
      if (trimmedPurchase.includes(name)) {
      total += cost;
      ordertable += "<tr> <td>" + name + " </td> <td>" + cost.toFixed(2) + " </td> </tr>";
      }

    }
  
  ordertable += "<tr> <td> Total Cost: </td> <td> " + total + "</td> </tr> </table>";




    return ordertable;
  }
}

app.listen(portNumber);




if (process.argv.length != 3) {
  process.stdout.write(`Usage supermarketServer.js jsonFile`);
  process.exit(1);
}

process.stdin.setEncoding("utf8"); /* encoding */


let jsonfile = process.argv[2];

console.log(`Web server started and running at http://localhost:${portNumber}`);
const prompt = "Type itemsList or stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.on('readable', () => {  /* on equivalent to addEventListener */

	let dataInput = process.stdin.read();
	if (dataInput !== null) {


		let command = dataInput.trim();
		if (command === "stop") {
			process.stdout.write("Shutting down the server\n");
            process.exit(0);  /* exiting */
        } else if (command === "itemsList") {


          
const fs = require("fs");
const fileName = jsonfile;

fs.readFile(fileName, 'utf-8',
    function (err, fileContent) {
        if (err) {
            throw err;
        }
      
        console.log((JSON.parse(fileContent)).itemsList);
        process.stdout.write(prompt);
    });

          
        } else {
			/* After invalid command, we cannot type anything else */
			process.stdout.write(`Invalid command: ${command}\n`);
		}


    process.stdout.write(prompt);
    process.stdin.resume();
    }

});


app.set("views", path.resolve(__dirname, "templates"));

/* view/templating engine */
app.set("view engine", "ejs");


app.get("/", (request, response) => {
  /* Generating the HTML using welcome template */
  response.render("index");
});

app.get("/catalog", (request, response) => {

 

  const fs = require("fs");
  const fileName = jsonfile;
   let itemstable = "<table border = \"1\"> <tr> <th> Item </th> <th> Cost </th> </tr>";

fs.readFile(fileName, 'utf-8',
function (err, fileContent) {
    if (err) {
        throw err;
    }
   
  for (let item of JSON.parse(fileContent).itemsList) {
    itemstable += "<tr> <td>" + item.name + " </td> <td>" + item.cost.toFixed(2) + " </td> </tr>";
  }

itemstable += "</table>";
const variables = {
        itemsTable: itemstable
      };
    response.render("displayItems", variables);

});
 });


 app.get("/order", (request, response) => {
  const fs = require("fs");
  const fileName = jsonfile;
  let itemstable;

fs.readFile(fileName, 'utf-8',
function (err, fileContent) {
    if (err) {
        throw err;
    }
  for (let item of JSON.parse(fileContent).itemsList) {
    itemstable += "<option value =\"" + item.name + "\">" + item.name + "</option>";
  }

    const variables = {
        items: itemstable,
      };

    response.render("placeorder",variables);
 });
 });

 app.use(bodyParser.urlencoded({extended:false}));

 app.post("/order", (request, response) => {

   let {name, email, delivery, itemsSelected} = request.body;

  
const fs = require("fs");
const fileName = jsonfile;
 

fs.readFile(fileName, 'utf-8',
function (err, fileContent) {
  if (err) {
      throw err;
  }

let shopper = new Shopper(JSON.parse(fileContent).itemsList, itemsSelected);



   const variables = { 
                       name: name,
                       email : email,
                       delivery: delivery,
                       orderTable: shopper.table()
                     };
                     
 
   response.render("orderConfirmation",variables);
                    });

 });
