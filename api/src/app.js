import express from "express";
import axios from "axios";
import cors from "cors";

const port = 3000;
const dbPort = 3000;
const dbHost = "db";

const app = express();
app.use(express.json());
app.use(cors());

const swaggerJsdoc = require("swagger-jsdoc"), 
      swaggerUi = require("swagger-ui-express");

// Swagger options 
const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Celina Yousief",
          url: "https://github.com/yousiefc",
          email: "yousiefc@pm.me",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./app.js"],
  };

// Initialize swagger
  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );

// Function to create response object
const responseObject = (resp) => {
    var obj = {
        data: resp.data,
        statusCode: resp.status,
        statusMessage: resp.statusText
    };
    return obj;
};

/**
* GET endpoint that returns all products in database
* @returns the request body, status code and status message
*/
app.get("/api/product", async (req, res) => {
    try {
        const resp = await axios.get(`http://${dbHost}:${dbPort}/products?_sort=productId&_order=asc`);
        res.json(responseObject(resp));
    } catch (error) {
        console.error(`Error: ${error} response ${res.statusCode}`);
    }
});

/**
* GET endpoint that returns product with specific productId
* @param {productId}
* @returns the request body, status code and status message
*/
app.get("/api/product/productid/:productId", async (req, res) => {
    try {
        const resp = await axios.get(`http://${dbHost}:${dbPort}/products?productId=${req.params.productId}`);
        res.json(responseObject(resp));
    } catch (error) {
        console.error(`Error: ${error} response ${res.statusCode}`);
    }
});

/**
* GET endpoint that returns all products with a specific scrum master
* @param {scrumMaster}
* @returns the request body, status code and status message
*/
app.get("/api/product/scrummaster/:scrumMaster", async (req, res) => {
    try {
        const resp = await axios.get(`http://${dbHost}:${dbPort}/products?scrumMasterName_like=${req.params.scrumMaster}`);
        res.json(responseObject(resp));
    } catch (error) {
        console.error(`Error: ${error} response ${res.statusCode}`);
    }
});

/**
* POST endpoint that creates a new product and adds it to the database
* @returns the request body, status code and status message
*/
app.post("/api/product", async (req, res) => {
    try {
        const resp = await axios.post(`http://${dbHost}:${dbPort}/products`, req.body);
        res.json(responseObject(resp));
    } catch (error) {
        console.error(`Error: ${error} response ${res.statusCode}`);
    }
});

/**
* PUT endpoint that updates existing products in the database
* @param {productId}
* @returns the request body, status code and status message
*/
app.put("/api/product/:productId", async (req, res) => {
    try {
        const resp = await axios.put(`http://${dbHost}:${dbPort}/products/${req.params.productId}`, req.body);
        res.json(responseObject(resp));
    } catch (error) {
        console.error(`Error: ${error} response ${res.statusCode}`);
    }
});

/**
* GET endpoint to check API health
* @returns 200 Status
*/
app.get("/api/health", async (req, res) => {
    res.status(200).send('Ok');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});