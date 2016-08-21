// ====================================
// transport.opendata.ch-data.tpg.ch
// ====================================

var colors  = require('colors'),
    mysql   = require('mysql'),
    request = require('request')

console.log('transport.opendata.ch-data.tpg.ch'.cyan.inverse)

//-------------------------------------
// Connect to the MySQL database
//-------------------------------------

console.log('Connecting to database...')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'my_db'
})

connection.connect((error) => {
  if(error) {
    console.log('ERROR'.red.inverse + " Cannot connect to database. Please make sure that the database information in main.js is correct.")
    process.exit();
  }
})

//-------------------------------------
// Fetch GetPhysicalStops from the
// transports publics genevois API
//-------------------------------------

// @TODO : Fetch GetPhysicalStops
