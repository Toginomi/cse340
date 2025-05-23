const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  console.log(data)
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the item detail view HTML
 ************************************** */
Util.buildDetailView = async function(data){
  let invBox;

  if(data) {
    let carTitle = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    let mileage = data.inv_miles.toLocaleString('en-US');
    let price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price);

    invBox = '<div class="inv-box">';

    // Vehicle image
    invBox += '<div class="car-image"><img src="' + data.inv_image + '" alt="Image of ' + carTitle + '" />';
    invBox += '</div>';

    invBox += '<div class="info-box">';

    // Quick vehicle info
    invBox += '<div class="quick-info">';
    invBox += '<div class="car-title"><h2>' + carTitle + '</h2></div>';
    invBox += '<h3>' + price + '</h3>';
    invBox += '<p>' + mileage + ' Miles</p>';
    invBox += '</div>'; // closes quick-info

    // Detailed vehicle information
    invBox += '<div class="vehicle-details">';
    invBox += '<ul class="details-list">';
    invBox += '<li>' + data.inv_description + '</li>';
    invBox += '<li>Mileage: ' + mileage + ' miles</li>';
    invBox += '<li>Exterior Color: ' + data.inv_color + '</li>';
    // Optional extras (only if you later add these fields to your table)
    // invBox += '<li>Fuel Type: ' + data.inv_fuel + '</li>';
    // invBox += '<li>Location: ' + data.inv_location + '</li>';
    // invBox += '<li>VIN: ' + data.inv_vin + '</li>';
    // invBox += '<li>Stock #: ' + data.inv_stock + '</li>';
    invBox += '</ul>';
    invBox += '</div>'; // closes vehicle-details

    invBox += '</div>'; // closes info-box
    invBox += '</div>'; // closes inv-box

  } else {
    invBox = '<p class="notice">Sorry, no vehicle details could be found.</p>';
  }

  return invBox;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util