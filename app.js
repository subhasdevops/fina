const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
const dbPath = path.join(__dirname, "Finance.sqlite3");

app.use(express.static("files"));
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(process.env.PORT || 3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/books/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      data
    ;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

app.post("/books/", async (request, response) => {
  try {
    const bookDetails = request.body;

    const update = async (each) => {
      const { userId, id, title, body } = each;
      const addBookQuery = `
    INSERT INTO
      data (id,userId,title,body)
    VALUES
      ( '${id}',
        '${userId}',
        '${title}',
        '${body}'    
      );`;

      const dbResponse = await db.run(addBookQuery);
    };
    bookDetails.map((each) => update(each));
    response.send({
      status: true,
      message: "File Uploaded!",
    });
  } catch (err) {
    response.send({ message: "Error Failed to upload" });
  }
});

module.exports = app