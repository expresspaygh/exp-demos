// **************** PULL IN EXPRESSPAY JS SDK ********************
const expay = require("@expresspaygh/expresspay-js-sdk");

// **************** START OF VARIABLES ********************

let environment = "sandbox";
let merchant_id = "089237783227";
let merchant_key = "JKR91Vs1zEcuAj9LwMXQu-H3LPrDq1XCKItTKpmLY1-XsBgCnNpkDT1GER8ih9f-UTYoNINatMbreNIRavgu-89wPOnY6F7mz1lXP3LZ";

// **************** END OF VARIABLES ********************

// **************** START OF DECLARATIONS ********************

const merchant_api_class = new expay.default(merchant_id, merchant_key, environment);

let _token = "";
let _header = "NO HEADER!";

const responder = (data) => {
  console.log("**********************************\n");
  console.info(_header + " \n");
  console.info(data);
  console.log("\n**********************************\n");
};

// **************** END OF DECLARATIONS ********************

// Note: All methods below run sequentially
// - submit calls checkout after running
// - checkout calls query after running

// **************** START OF METHOD ACCESSORS FOR QUERY ********************

// only calls this method if checkout is successfull
const run_query = () => {
  let merchantApiQuery = merchant_api_class.query(_token);

  _header = "QUERY RESPONSE:";

  merchantApiQuery.then( (response) => {
    responder(response);
  }).catch( (error) => {
    responder(error);
    throw new Error("Something bad happened!");
  });
};

// **************** END OF METHOD ACCESSORS FOR QUERY ********************

// **************** START OF METHOD ACCESSORS FOR CHECKOUT ********************

// only call this method if submit is successfull
const run_checkout = () => {
  if (!_token) {
    throw new Error("Token declaration is empty!");
  }

  let merchantApiCheckout = merchant_api_class.checkout(_token);
  _header = "CHECKOUT RESPONSE:";
  responder(merchantApiCheckout);

  // now call query
  run_query();
};

// **************** END OF METHOD ACCESSORS FOR CHECKOUT ********************

// **************** START OF METHOD ACCESSORS FOR SUBMIT ********************

let merchantApiSubmit = merchant_api_class.submit(
  "GHS", 20.00, "78HJU789UYTR", "Buy Airtime", "https://www.expresspaygh.com",
  "1234567890", "https://expresspaygh.com/images/logo.png", "Jeffery", 
  "Osei", "233545512042", "jefferyosei@expresspaygh.com"
);

_header = "SUBMIT RESPONSE:";

merchantApiSubmit.then( (response) => {
  responder(response);

  if (response.hasOwnProperty('token')) {
    _token = response.token;

    // now call checkout
    run_checkout();
  } else {
    throw new Error("No token found!");
  }
}).catch( (error) => {
  responder(error);

  throw new Error("Something bad happened!");
});

// **************** END OF METHOD ACCESSORS FOR SUBMIT ********************
