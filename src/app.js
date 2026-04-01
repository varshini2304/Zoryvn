const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const routes = require("./routes");
const healthRoutes = require("./routes/health.routes");
const errorHandler = require("./middleware/error.middleware");
const { apiRateLimiter } = require("./middleware/rate-limit.middleware");
const swaggerSpec = require("./config/swagger");

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiRateLimiter);

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1", routes);
app.use("/api", routes);
app.use(errorHandler);

module.exports = app;
