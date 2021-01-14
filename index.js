const express = require('express');
const solver = require('./solver');
const fileUpload = require('express-fileupload');
var Struct = require('struct');
var cors = require("cors");

const app = express();
const port = process.env.PORT || "8080";

app.use(fileUpload());
app.use(cors());

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.status(200).send("Sat Solver Node Endpoint..");
});

app.post("/solver/", solver.solve);