import express from 'express';
import Cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from "./middleware/errorMiddleware";
import { entities } from './entities';
import { connectToDataBase } from './config/db';
import { AuthRouter } from './routes/Auth/Auth';
import { NotificationRouter } from './routes/notification';
import { CompanyRouter } from './routes/company';
import { UserRouter } from './routes/user';
import { StepperRouter } from './routes/stepper';
import { CustomerRouter } from './routes/customer';
import { InventoryRouter } from './routes/inventory';
import { ProjectRouter } from './routes/project';
import { SupplierRouter } from './routes/supplier';
import { InventoryItemRouter } from './routes/inventoryItem';
import { DashboardRouter } from './routes/dashboard';
import { AttendanceRouter } from './routes/attendance';
import { runAtMidnight } from './auto/CheckDayEnd';

// constants
dotenv.config();
const app = express();

// Middleware
app.use(Cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connected to data base
try {
  app.listen(process.env.SERVER_PORT, () =>
    console.log(`Server Running on port : ${process.env.SERVER_PORT}`)
  );

  connectToDataBase(entities);


  // Routes
  app.use('/auth', AuthRouter);
  app.use('/dashboard', DashboardRouter);
  app.use('/attendance', AttendanceRouter);
  // 
  app.use('/company', CompanyRouter);
  app.use('/user', UserRouter);
  app.use('/stepper', StepperRouter);
  // done
  app.use('/supplier', SupplierRouter);
  app.use('/customer', CustomerRouter);
  app.use('/inventory', InventoryRouter);
  app.use('/inventory_item', InventoryItemRouter);

  // exists
  app.use('/project', ProjectRouter);

  app.use('/notification', NotificationRouter);

  // eventListeners 
  // setInterval(runAtMidnight, 1000);


  // Server Running
} catch (error) {
  console.error(error);
  throw new Error('Unable To Connect To Database');
}
// Error Handler
app.use(errorHandler);