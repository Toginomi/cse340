const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByDetailId = async function (req, res, next) {
  const detailId = req.params.detailId
  try {
    const data = await invModel.getInventoryById(detailId)
    if (!data) {
      throw new Error("Vehicle not found")
    }
    const grid = await utilities.buildDetailView(data)
    const nav = await utilities.getNav()
    const title = `${data.inv_make} ${data.inv_model}`
    res.render("./inventory/detail", {
      title,
      nav,
      vehicleGrid: grid,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont