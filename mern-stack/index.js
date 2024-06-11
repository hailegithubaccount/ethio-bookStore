const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string
const uri = "mongodb+srv://newbooks:bookstore@cluster0.plhuypo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let bookCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    bookCollection = client.db("bookstore").collection("books");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

connectToDatabase();

// Basic route to test server
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route to upload a new book
app.post("/uploadfile", async (req, res) => {
  const data = req.body;
  try {
    const result = await bookCollection.insertOne(data);
    res.send(result);
    
    

  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Route to get all books
// //app.get("/allfile", async (req, res) => {
//   try {
//     const books = await bookCollection.find().toArray();
//     res.send(books);
//   } catch (error) {
//     console.error("Error fetching files:", error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// });

// Update route
app.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const updateBookData = req.body;

  try {
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        ...updateBookData
      }
    };
    const options = { upsert: false }; // Set to false if you don't want to create a new document if the filter does not match

    const result = await bookCollection.updateOne(filter, updateDoc, options);

    if (result.matchedCount === 0) {
      res.status(404).send({ message: "Book not found" });
    } else {
      res.send(result);
    }
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.delete("/delete/:id",async(req,res)=>{
  const id=req.params.id;
  const filter={_id:new ObjectId(id)};
  const result=await bookCollection.deleteOne(filter);
  res.send(result);
});
 app.get("/allfile", async (req, res) => {
  try {
    let query={};
    if(req.query?.category){
      query={category:req.query.category}
    }
    const result=await bookCollection.find(query).toArray();
    res.send(result);
   
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON');
    return res.status(400).send({ message: 'Bad JSON' });
  }
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
