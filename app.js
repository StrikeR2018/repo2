/*
    SETUP
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 6957;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')


/*
    ROUTES
*/

app.get('/', function(req, res) {
    res.render('index')
});

app.get('/books', function(req, res) {
    let read_query = "SELECT book_id AS ID, title AS Title, summary AS Summary, price AS Price, page_count AS Pages, num_in_stock AS Stock FROM Books;";
    db.pool.query(read_query, function(error, rows, fields){
        res.render('books', {data: rows});
    })
});

app.get('/customers', function(req, res) {
    let read_query = "SELECT customer_id AS ID, first_name AS First, last_name AS Last, email AS Email, phone AS Phone FROM Customers;";
    db.pool.query(read_query, function(error, rows, fields){
        res.render('customers', {data: rows});
    })
});

app.post('/add-customers', function(req, res) {
    let data = req.body;

    let first_name = data.first_name;
    let last_name = data.last_name;
    let email = data.email;
    let phone = data.phone;

    let create_query = `INSERT INTO Customers (first_name, last_name, email, phone) VALUES ('${first_name}', '${last_name}', '${email}', '${phone}');`;
    db.pool.query(create_query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            test_query = "SELECT customer_id AS ID, first_name AS First, last_name AS Last, email AS Email, phone AS Phone FROM Customers;"
            db.pool.query(test_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

app.get('/purchases', function(req, res) {
    let read_query = "SELECT Purchases.purchase_id AS ID, Customers.first_name AS Customer, Purchases.date_purchase AS Date, Purchases.price AS Price FROM Purchases JOIN Customers ON Purchases.customer_id = Customers.customer_id;";
    let customers_query = "SELECT * FROM Customers";
    db.pool.query(read_query, function(error, rows, fields){
        let read_data = rows;

        db.pool.query(customers_query, function(error, rows, fields) {
            let customers = rows;
            return res.render('purchases', {data: read_data, customers: customers});
        })
    })
});

app.post('/add-purchases', function(req, res) {
    let data = req.body;
    // capture NULL values
    let customer_id = parseInt(data.customer_id);
    if (isNaN(customer_id)) {
        customer_id = 'NULL';
    };

    let date = data.date;
    let price = data.price;

    // Create Query
    create_query = `INSERT INTO Purchases (customer_id, date_purchase, price) VALUES ('${customer_id}', '${date}', '${price}');`;
    db.pool.query(create_query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            test_query = "SELECT Purchases.purchase_id AS ID, Customers.first_name AS Customer, Purchases.date_purchase AS Date, Purchases.price AS Price FROM Purchases JOIN Customers ON Purchases.customer_id = Customers.customer_id;";
            db.pool.query(test_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

app.get('/reviews', function(req, res) {
    let read_query = "SELECT Reviews.review_id AS ID, Customers.first_name AS Customer, Books.title as Book, Reviews.rating AS Rating, Reviews.review AS Review FROM Reviews LEFT JOIN Customers ON Reviews.customer_id = Customers.customer_id JOIN Books ON Reviews.book_id = Books.book_id ORDER BY Reviews.review_id ASC;";
    let customers_query = "SELECT * FROM Customers;";
    let books_query = "SELECT * FROM Books;";
    db.pool.query(read_query, function(error, rows, fields){
        let read_data = rows;
        db.pool.query(customers_query, function(error, rows, fields) {
            let customers = rows;
            db.pool.query(books_query, function(error, rows, fields) {
                let books = rows;
                return res.render('reviews', {data: read_data, customers: customers, books: books});
            })
        })
    })
});

app.post('/add-reviews', function(req, res) {
    let data = req.body;

    let customer_id = parseInt(data.customer_id);
    if (isNaN(customer_id)) {
        customer_id = 'NULL';
    }
    let book_id = parseInt(data.book_id);
    if (isNaN(book_id)) {
        book_id = 'NULL';
    }
    let rating = data.rating;
    let review = data.review;

    let create_query = `INSERT INTO Reviews (customer_id, book_id, rating, review) VALUES (${customer_id}, '${book_id}', '${rating}', '${review}');`;
    db.pool.query(create_query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            test_query = "SELECT Reviews.review_id AS ID, Customers.first_name AS Customer, Books.title as Book, Reviews.rating AS Rating, Reviews.review AS Review FROM Reviews LEFT JOIN Customers ON Reviews.customer_id = Customers.customer_id JOIN Books ON Reviews.book_id = Books.book_id ORDER BY Reviews.review_id ASC;";
            db.pool.query(test_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

app.get('/genres', function(req, res) {
    let read_query = "SELECT genre_id AS ID, name AS Genre, description AS Description FROM Genres;";
    db.pool.query(read_query, function(error, rows, fields){
        res.render('genres', {data: rows});
    })
});

app.post('/add-genres', function(req, res) {
    let data = req.body;

    let genre = data.genre;
    let description = data.description;

    let create_query = `INSERT INTO Genres (name, description) VALUES ('${genre}', '${description}');`;
    db.pool.query(create_query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            test_query = "SELECT genre_id AS ID, name AS Genre, description AS Description FROM Genres;";
            db.pool.query(test_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

// CUSTOMERS-GENRES
app.get('/customers_genres', function(req, res) {
    let read_query = "SELECT Customers_Genres_Details.customers_genres_details_id AS id, Customers.first_name AS Customer, Genres.name AS Genre FROM Customers_Genres_Details JOIN Customers ON Customers_Genres_Details.customer_id = Customers.customer_id JOIN Genres ON Customers_Genres_Details.genre_id = Genres.genre_id;";
    let customers_query = "SELECT * FROM Customers";
    let genres_query = "SELECT * FROM Genres";
    db.pool.query(read_query, function(error, rows, fields){

        let read_data = rows;

        db.pool.query(customers_query, function(error, rows, fields) {

            let customers = rows;

            db.pool.query(genres_query, function(error, rows, fields) {

                let genres = rows;
                return res.render('customers_genres', {data: read_data, customers: customers, genres: genres});
            })
        })
    })
});

app.post('/add-customers-genres', function(req, res) {
    let data = req.body;
    // capture NULL values
    let customer = parseInt(data.customer_id);
    if (isNaN(customer)) {
        customer = 'NULL';
    };

    let genre = parseInt(data.genre_id);
    if (isNaN(genre)) {
        genre = 'NULL';
    };

    // Create Query
    create_query = `INSERT INTO Customers_Genres_Details (customer_id, genre_id) VALUES ('${customer}', '${genre}');`;
    db.pool.query(create_query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            test_query = "SELECT Customers_Genres_Details.customers_genres_details_id AS id, Customers.first_name AS Customer, Genres.name AS Genre FROM Customers_Genres_Details JOIN Customers ON Customers_Genres_Details.customer_id = Customers.customer_id JOIN Genres ON Customers_Genres_Details.genre_id = Genres.genre_id;";
            db.pool.query(test_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

app.delete('/delete_customers_genres/', function(req, res, next) {
    let data = req.body;
    let id = parseInt(data.id)
    let delete_query = `DELETE FROM Customers_Genres_Details WHERE customers_genres_details_id = ${id};`;

    db.pool.query(delete_query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// books-genres
app.get('/books_genres', function(req, res) {
  let query1 = "SELECT * FROM Customers;";               // Define our query

      db.pool.query(query1, function(error, rows, fields){    // Execute the query

          res.render('customers_genres', {data: rows});                  // Render the index.hbs file, and also send the renderer
      })
});

app.post('/add-books-genres', function(req, res) {
    let data = req.body;
    // capture NULL values
    let book = parseInt(data.book_id);
    if (isNaN(book)) {
        book = 'NULL';
    };

    let genre = parseInt(data.genre_id);
    if (isNaN(genre)) {
        genre = 'NULL';
    };

    // Create Query
    create_query = `INSERT INTO Books_Genres_Details (book_id, genre_id) VALUES ('${book}', '${genre}');`;
    db.pool.query(create_query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            test_query = "SELECT Books_Genres_Details.books_genres_details_id AS id, Books.title AS Book, Genres.name AS Genre FROM Books_Genres_Details JOIN Books ON Books_Genres_Details.book_id = Books.book_id JOIN Genres ON Books_Genres_Details.genre_id = Genres.genre_id;";
            db.pool.query(test_query, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

app.get('/books_purchases', function(req, res) {
  let read_query = "SELECT Books_Purchases_Details.books_purchases_details_id AS id, Books.title AS Title, Purchases.price AS Purchase FROM Books_Purchases_Details JOIN Books ON Books_Purchases_Details.book_id = Books.book_id JOIN Purchases ON Books_Purchases_Details.purchase_id = Purchases.purchase_id;";
  let books_query = "SELECT * FROM Books";
  let genres_query = "SELECT * FROM Genres";
  db.pool.query(read_query, function(error, rows, fields){
      let read_data = rows;
      db.pool.query(books_query, function(error, rows, fields) {
          let books = rows;
          db.pool.query(genres_query, function(error, rows, fields) {
              let genres = rows;
              return res.render('books_purchases', {data: read_data, books: books, genres: genres});
          })
      })
  })
});

//--------------------- books-purchases --------------------//
app.post('/add-books-purchases', function(req, res) {
    let data = req.body;

    // Capture NULL values
    let book = parseInt(data.book_id);
    if (isNaN(book)){
        book = 'NULL'
    }

    let purchase = parseInt(data.purchase_id);
    if (isNaN(purchase)){
        purchase = 'NULL'
    }

    // Create the query and run it on the database
    bpquery= `INSERT INTO Books_Purchases_Details (book_id, purchase_id) VALUES ('${book}', '${purchase}');`;
    db.pool.query(bpquery, function(error, rows, fields){
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            test_bp_query = "SELECT Books_Purchases_Details.books_purchases_details_id AS id, Books.title AS Book, Purchase.price AS Purchase FROM Books_Purchases_Details JOIN Books ON Books_Purchases_Details.book_id = Books.book_id JOIN Purchases ON Books_Purchases_Details.purchase_id = Purchases.purchase_id;";
            db.pool.query(test_bp_query, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
        }
    })
});
app.delete('/delete-customer-ajax/:customerID', function(req,res,next){
  let data = req.body;

  let deleteCustomer = `DELETE FROM Customers_Genres_Details WHERE Customer_Genres_customer_id = ?`;

        // Run the 1st query
        db.pool.query(deleteCustomer, [personID], function(error, rows, fields){
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
              }
  })});

  app.put('/put-person-ajax', function(req,res,next){
    let data = req.body;

    let customer = parseInt(data.customer_id);
    let genre = parseInt(data.genre_id);

    let queryUpdateGenre = `UPDATE Customers_Genres_Details SET genre_id = ? WHERE customer_id = ?`;
    let selectGenre = `SELECT * FROM Genres WHERE genre_id = ?`;

          // Run the 1st query
          db.pool.query(queryUpdateGenre, [genre, customer], function(error, rows, fields){
              if (error) {

              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }

              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectGenre, [genre], function(error, rows, fields) {

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
