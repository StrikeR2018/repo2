let addBPForm = document.getElementById('add-books-purchases-form');

addBPForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // retrieve form fields
    let inputBook = document.getElementById("input-book").value;
    let inputPurchase = document.getElementById("input-purchase").value;

    // get the value
    let bookVal = inputBook.value;
    let purchaseVal = inputPurchase.value;

    // Put our data we want to send in a javascript object
    let data = {
      book_id: bookVal,
      purchase_id: purchaseVal,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-books-purchases", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBook = ' ';
            inputPurchase = ' ';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("books-purchases-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let bp_id = document.createElement("TD");
    let book_name = document.createElement("TD");
    let purchase_price = document.createElement("TD");

    // Fill the cells with correct data
    bp_id.innerText = newRow.books_purchases_details_id;
    book_name.innerText = newRow.Title;
    purchase_price.innerText = newRow.Purchase;

    // Add the cells to the row
    row.appendChild(bp_id);
    row.appendChild(book_name);
    row.appendChild(purchase_price);

    // Add the row to the table
    currentTable.appendChild(row);
}
