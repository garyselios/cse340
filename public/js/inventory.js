'use strict'

// Get the classification select element
let classificationList = document.querySelector("#classificationList")

// Add event listener for when the selection changes
classificationList.addEventListener("change", function () {

  // Get selected classification_id
  let classification_id = classificationList.value
  console.log(`classification_id is: ${classification_id}`)

  // Build the URL for the fetch request
  let classIdURL = "/inv/getInventory/" + classification_id

  // Fetch inventory data from the server
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      }
      throw Error("Network response was not OK")
    })
    .then(function (data) {
      console.log(data)
      buildInventoryList(data)
    })
    .catch(function (error) {
      console.log("There was a problem:", error.message)
    })
})

/*
 * Build inventory items into HTML table and inject into the DOM
  */
function buildInventoryList(data) {

  // Get table element
  let inventoryDisplay = document.getElementById("inventoryDisplay")

  // Build table header
  let dataTable = '<thead>'
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'
  dataTable += '</thead>'

  // Build table body
  dataTable += '<tbody>'

  // Loop through inventory data
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model)

    dataTable += `<tr>
      <td>${element.inv_make} ${element.inv_model}</td>
      <td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>
      <td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td>
    </tr>`
  })

  dataTable += '</tbody>'

  // Inject table into HTML
  inventoryDisplay.innerHTML = dataTable
}