// ====================================
// transport.opendata.ch-data.tpg.ch
// ====================================

var colors  = require('colors'),
    mysql   = require('mysql'),
    request = require('request'),
    config  = require('./config')

console.log('transport.opendata.ch-data.tpg.ch'.cyan.inverse)

//-------------------------------------
// Connect to the MySQL database
//-------------------------------------

console.log('Connecting to database...')

var connection = mysql.createConnection({
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.password,
  database : config.database.db_name
})

connection.connect((error) => {
  if(error) {
    console.log('ERROR'.red.inverse + " Cannot connect to database. Please make sure that the database information in config.js is correct.")
    process.exit();
  }
})

//-------------------------------------
// Fetch GetPhysicalStops from the
// transports publics genevois API
//-------------------------------------

// @TODO : Fetch GetPhysicalStops
