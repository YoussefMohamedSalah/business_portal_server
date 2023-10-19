// import 'reflect-metadata';
import express from 'express';
import Cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
// ************************************************
import { entities } from './entities';
import { subscribers } from './subscribers';
// ************************************************
import { errorHandler } from "./middleware/errorMiddleware";
import { connectToDataBase } from './config/db';
import { AuthRouter } from './routes/Auth/Auth';
import { NotificationRouter } from './routes/notification';
import { CompanyRouter } from './routes/company';
import { StepperRouter } from './routes/stepper';
import { CustomerRouter } from './routes/customer';
import { InventoryRouter } from './routes/inventory';
import { ProjectRouter } from './routes/project';
import { SupplierRouter } from './routes/supplier';
import { InventoryItemRouter } from './routes/inventoryItem';
import { DashboardRouter } from './routes/dashboard';
import { AttendanceRouter } from './routes/attendance';
import { runAtMidnight } from './auto/CheckDayEnd';
import { DepartmentRouter } from './routes/department';
import { RequestRouter } from './routes/request';
import { EmployeeRouter } from './routes/employee';
import { TaskRouter } from './routes/task';
import { TenderRouter } from './routes/tender';
import { GroupRouter } from './routes/group';
import { WorkFlowRouter } from './routes/workFlow';
import { SubcontractorRouter } from './routes/subcontractor';
import { ContractRouter } from './routes/contract';
import { InvoiceRouter } from './routes/invoice';
import { ChatAppRouter } from './routes/chatApp';
import { initSocketServer } from './sockets/InitialSocket';

// constants
dotenv.config();
const app = express();
const server = createServer(app);

// Middleware
app.use(Cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


try {
  app.listen(process.env.SERVER_PORT, () =>
    console.log(`Server Running on port : ${process.env.SERVER_PORT}`)
  );
  const io = new Server({
    cors: {
      origin: "http://localhost:3000"
    }
  });
  io.listen(8081)
  initSocketServer(io);
  connectToDataBase(entities, subscribers);

  // ROUTES
  app.use('/auth', AuthRouter);
  app.use('/dashboard', DashboardRouter);
  app.use('/attendance', AttendanceRouter);
  app.use('/request', RequestRouter);
  app.use('/company', CompanyRouter);
  app.use('/invoice', InvoiceRouter);
  app.use('/employee', EmployeeRouter)
  app.use('/stepper', StepperRouter);
  app.use('/department', DepartmentRouter);
  app.use('/task', TaskRouter);
  app.use('/tender', TenderRouter);
  app.use('/group', GroupRouter);
  app.use('/supplier', SupplierRouter);
  app.use('/customer', CustomerRouter);
  app.use('/subcontractor', SubcontractorRouter);
  app.use('/contract', ContractRouter);
  app.use('/inventory', InventoryRouter);
  app.use('/inventory_item', InventoryItemRouter);
  app.use('/project', ProjectRouter);
  app.use('/workflow', WorkFlowRouter);
  app.use('/notifications', NotificationRouter);
  // ************************************************
  app.use(express.static('uploads'));
  app.use('/uploads', express.static('uploads'));
  // ************************************************
  app.use('/chat', ChatAppRouter);


  // ************************************************
  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const handleRunAtMidnight = async () => {
    // getting the time and determine the exact time to wait
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0); // Set to next midnight
    let nowInTime = now.getTime();
    let midnightInTime = midnight.getTime();
    const timeToMidnightInMS = midnightInTime - nowInTime; // Calculate time remaining until midnight
    await sleep(timeToMidnightInMS);
    runAtMidnight();
  };
  handleRunAtMidnight();
  // ************************************************

} catch (error) {
  console.error(error);
  throw new Error('Unable To Connect To Database');
}
app.use(errorHandler);