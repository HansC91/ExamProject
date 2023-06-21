## STOCK SALES APPLICATION:
This is a stock sales application that allows users to browse and buy items from an item catalogue.

## HOW TO RUN:
Download the code to your localmachine
Open the code in your IDE (it was made on node v 18.13.0)
install the dependencies with npm install.
copy the .env file details below to a .env file in the root folder.
run the application with npm start.

to run the unittest: npx jest setup.test.js

## IMPORTANT INFO:
DO NOT REGISTER A USER WITH THE NAME Johndoe, as this user is used for creation and testing in my unittests.


## Outside sources:

https://sebhastian.com/sequelize-findorcreate/?utm_content=cmp-true - findorcreate
https://www.tabnine.com/code/javascript/functions/sequelize/like - index search.
https://sequelize.org/docs/v6/other-topics/transactions/ - transaction

Ive also used previous CA's to form my application, forexample models are worked out from dab ca whilst auth is from the api ca.

Me and Lasse Stavland did signup for a mentor group, but only some discussion on interpertation of the details was shared between us. No code changed hands.

   
## .env file:

//START
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "P@ssw0rd"
DATABASE_NAME = "StockSalesDB"
DIALECT = "mysql"
DIALECTMODEL = "mysql2"
PORT = "3000"
HOST = 'localhost'
TOKEN_SECRET = 'dfghj4567kjhg'
//END


## LINK TO POSTMAN DOC:
 https://documenter.getpostman.com/view/25359340/2s93sacETt#cc26d102-870a-4cb1-99b6-51e2bdd771e6 
