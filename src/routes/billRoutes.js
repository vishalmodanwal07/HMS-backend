import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createBill, deleteBill,  getBillById, getBillsByPatient, updateBillStatus } from "../controllers/bill.Controller.js";
import { authorize } from "../middlewares/role.middleware.js";

const billRouter = Router();

billRouter.route("/").post(verifyJWT , authorize("Reception", "Admin") , createBill);
billRouter.route("/patient/:patientId").get(verifyJWT , authorize("Reception", "Admin", "Doctor") , getBillsByPatient);
billRouter.route("/:id").get(verifyJWT , authorize("Reception", "Admin", "Doctor") , getBillById);
billRouter.route("/:id/status").put(verifyJWT , authorize("Reception", "Admin") , updateBillStatus);
billRouter.route("/:id").post(verifyJWT , authorize("Admin") , deleteBill);
// billRouter.route("/:id/invoice").get(verifyJWT ,authorize("Reception", "Admin") , downloadInvoice )


export default billRouter;