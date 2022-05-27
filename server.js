const express = require("express");
const http = require("http");

const app = express();
const bodyParser = require("body-parser");
const dotConfig = require("dotenv").config();
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const authRouter = require("./routers/userAuth");
const materialRouter = require("./routers/material");
const processRouter = require("./routers/process");
const unitRouter = require("./routers/unit");
const systemRouter = require("./routers/system");
const employeeRouter = require("./routers/employee");
const TSCDRouter = require('./routers/TSCD');
const reqProductRouter = require('./routers/requestProduct');

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB();

// function throwObjWithStacktrace() {
//   const someError = {statusCode: 500}
//   Error.captureStackTrace(someError)
//   throw someError;
// }

// try {
//   throwObjWithStacktrace();
// } catch (err) {
//   console.log(err);
//   console.log(err.stack);
// }

app.use("/auth", authRouter);
app.use("/material", materialRouter);
app.use("/process", processRouter);
app.use("/unit", unitRouter);
app.use("/system", systemRouter);
app.use("/employee", employeeRouter);
app.use('/TSCD',TSCDRouter);
app.use('/req-product',reqProductRouter);

app.use(errorHandler);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
