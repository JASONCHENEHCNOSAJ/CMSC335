const http = require("http");
const path = require("path");
const bodyParser = require("body-parser"); /* To handle post parameters */
const express = require("express"); /* Accessing express module */
const app = express(); /* app is a request handler function */
/* directory where templates will reside */




require("dotenv").config() 

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const database = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;


if (process.argv.length != 3) {
    process.stdout.write(`Invalid Number of Arguments\n`);
    process.stdout.write(`Please follow the following format:  node summerCampServer.js PORT_NUMBER_HERE`);
    process.exit(1);
  }
  
  process.stdin.setEncoding("utf8"); /* encoding */
  
  
  const portNumber = process.argv[2];

  app.listen(portNumber);
  console.log(`Web server started and running at http://localhost:${portNumber}`);
  const prompt = "Stop to shutdown the server: ";

  process.stdout.write(prompt);
  process.stdin.on('readable', () => {  /* on equivalent to addEventListener */
  
      let dataInput = process.stdin.read();
      if (dataInput !== null) {
  
  
          let command = dataInput.trim();
          if (command === "Stop") {
              process.stdout.write("Shutting down the server\n");
              process.exit(0);  /* exiting */
          } else {
              /* After invalid command, we cannot type anything else */
              process.stdout.write(`Invalid command: ${command}\n`);
          }
  
  
      process.stdout.write(prompt);
      process.stdin.resume();
      }
  
  });
  

  const databaseAndCollection = {db: database, collection:collection};
  const { MongoClient, ServerApiVersion } = require('mongodb');
const { CONNREFUSED } = require("dns");
  
  async function insert(name,email,gpa,background) {
   
    const uri = `mongodb+srv://${userName}:${password}@cluster0.qwck4jb.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
     
        console.log("***** Inserting Applicant*****");
        let applicant = {name: name, email: email, gpa: Number(gpa), background: background};
        await insertApplicant(client, databaseAndCollection, applicant);


    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function insertApplicant(client, databaseAndCollection, newApplicant) {
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newApplicant);
}



async function lookUp(email) {
    
    const uri = `mongodb+srv://${userName}:${password}@cluster0.qwck4jb.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

   
    try {
        await client.connect();
               
                return await lookUpOneEntry(client, databaseAndCollection, email);
                
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function lookUpOneEntry(client, databaseAndCollection, email) {
    
    let filter = {email: email};
    const result = await client.db(databaseAndCollection.db)
                        .collection(databaseAndCollection.collection)
                        .findOne(filter);

   if (result) {

       return result
   } else {
       console.log(`No email found with name ${email}`);
   }
}


async function GPAMain(gpa) {
   
    const uri = `mongodb+srv://${userName}:${password}@cluster0.qwck4jb.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

   
    try {
        await client.connect();
                
                console.log("***** Looking up many *****");
                return await lookUpGPA(client, databaseAndCollection,gpa);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function lookUpGPA(client, databaseAndCollection,gpa) {

    let filter = {gpa: {$gte: gpa}};   

    const cursor = client.db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .find(filter);

    const result = await cursor.toArray();
   return result;
}


async function deleteAll() {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.qwck4jb.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
    try {
        await client.connect();
        const result = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .deleteMany({});
        return result.deletedCount;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}



app.set("views", path.resolve(__dirname, "templates"));

/* view/templating engine */
app.set("view engine", "ejs");


app.get("/", (request, response) => {
    /* Generating the HTML using welcome template */
    response.render("index");
  });

  app.get("/apply", (request, response) => {
    const variables = {
        port: portNumber
      };

      response.render("apply", variables);
  
  });

  app.use(bodyParser.urlencoded({extended:false}));

  app.post("/processApplication", (request, response) => {

    let {name, email, gpa, background} = request.body;

const variables = { 
                       name: name,
                       email : email,
                       gpa: gpa,
                       background: background
                     };

      response.render("processApplication", variables);
      insert(name,email,gpa,background)
  });

  app.get("/reviewApplication", (request, response) => {
    const variables = {
        port: portNumber
      };

      response.render("reviewApplication", variables);
  
  });

  app.post("/processReviewApplication", async (request, response) => {

    let email = request.body.email;

    let info = await lookUp(email);

   
const variables = { 
                       name: info.name,
                       email : email,
                       gpa: info.gpa,
                       background: info.background
                     };

      response.render("processReviewApplication", variables);
  });

  app.get("/adminGPA", (request, response) => {
    const variables = {
        port: portNumber
      };

      response.render("adminGPA", variables);
  
  });
  
  app.post("/processAdminGPA", async (request, response) => {

    let gpa = request.body.gpa;

    let info = await GPAMain(gpa);
 
    let table = "<table border = 1> <tr> <th> Name </th> <th> GPA </th> </tr>"

    for (let applicant of info) {
        table += "<tr> <td>" + applicant.name + "</td> <td>" + applicant.gpa + "</td> </tr>"
      }

      table += "</table>"

const variables = { 
                       table: table
                     };

      response.render("processAdminGPA", variables);
  });

  app.get("/adminRemove", (request, response) => {
    const variables = {
        port: portNumber
      };

      response.render("adminRemove", variables);
  
  });

  app.post("/processAdminRemove", async (request, response) => {

    let num = await deleteAll()

const variables = { 
                       num: num
                     };

      response.render("processAdminRemove", variables);
  });