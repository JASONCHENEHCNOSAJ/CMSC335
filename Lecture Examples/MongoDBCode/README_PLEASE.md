# Before running the examples

1. run npm i

2. First, make sure you have a cloud.mongodb.com account and can access 
  “Atlas” section

3. Update the file credentialsDontPost/.env in the DatabaseExamples folder 
   with the username and password corresponding to a database user. In 
   Atlas, you can add a new database user by selecting under the 
   “Security” title, “Database Access.”,  There is a 
   “+ ADD NEW DATABASE USER” option on that page. 

4. To see databases, select “Database” under the “DEPLOYMENT” title 
   and then click on the “Browse Collections” buttons

5. You can create a database by selecting the “+Create Database” button.  
   For the examples below, you don’t need to create a database as a 
   database called “CMSC335DB” and a collection called “moviesCollection” 
   will be created when you run the example node .\insertMovies.js.  
   ** Run this example, before you run any other example **

6. After running the examples, you can drop (remove) the CMSC335DB 
   database by selecting the trash bin icon you see when you hover 
   over CMSC335DB

7. The following examples illustrate CRUD operations.  They are recipes 
   that you can use for your project(s) Examples: insertMovies.js, 
   listDatabase.js, listAllMovies.js, lookUpMovies.js, updateMovie.js 
   deleteMovies.js, clearCollection.js

