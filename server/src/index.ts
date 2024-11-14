import express from "express";
import logger from "./utils/logger";
import { entityRouter } from "./routes/entity.routes";
import cors from "cors";
import { userRouter } from "./routes/user.routes";
import { roleAccessRouter } from "./routes/role.routes";
import { authMiddleware } from "./middlewares/auth.middlewares";
import { pageRouter } from "./routes/page.routes";
import { branchRouter } from "./routes/branch.routes";
import { designationRouter } from "./routes/designation.routes";
import {countryRouter} from './routes/country.routes'
import {stateRouter} from './routes/state.routes'
import {cityRouter} from './routes/cities.routes'
import {bankRouter} from './routes/bank.routes'
import pdfRouter from "./routes/pdf.routes";
import {pincodeRouter} from './routes/pincode.routes';
import {CurrencyRouter} from './routes/currency.routes'

import fs from 'fs'
import dotenv from 'dotenv';
import {errorHandler} from './middlewares/error.middlewares'

const environment = process.env.NODE_ENV || 'development';
if (environment === 'production') {
    dotenv.config({ path: '/root/.global_env' });
} else {
    if (fs.existsSync('.env')) {
        dotenv.config();
    } else {
        console.error('Local .env file not found');
    }
}

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: '*',
    })
);

app.use((req, _res, next) => {
  logger.info(
    `${req.method} ${req.path}\n ${JSON.stringify(
      req.query
    )}\n ${JSON.stringify(req.body)}`
  );
  next();
});

app.get("/", async (_req, res) => {
  res.send('Welcome to CBM server 😀');
});

app.use("/user", userRouter);
app.use("/pdf", pdfRouter);
app.use(express.static('public'))
app.use(authMiddleware); 

app.use("/entity", entityRouter);
app.use("/role", roleAccessRouter);
app.use("/page", pageRouter);
app.use("/branch", branchRouter);
app.use("/designation", designationRouter);
app.use('/country',countryRouter);
app.use('/state',stateRouter);
app.use('/city',cityRouter);
app.use('/bank',bankRouter);
app.use('/pincode', pincodeRouter);
app.use('/currency',CurrencyRouter)

app.use(errorHandler);

app.listen(5005, () => {
  logger.info(`Server Started on port 5005`);
});

export default app;