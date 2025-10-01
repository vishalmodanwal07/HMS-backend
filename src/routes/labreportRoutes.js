import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteReport, getReportById, getReportsByPatient, uploadReport } from "../controllers/lab.Controller.js";

const labRouter = Router();

labRouter.route("/upload").post(verifyJWT , authorize("Lab", "Admin") ,  upload.single("file"),  uploadReport);
labRouter.route("/patient/:patientId").get(verifyJWT , authorize("Doctor", "Reception", "Lab", "Admin" ),  getReportsByPatient);
labRouter.route( "/:id").get(verifyJWT , authorize("Doctor", "Reception", "Lab", "Admin") , getReportById);
labRouter.route("/:id").delete(verifyJWT , authorize("Lab", "Admin") , deleteReport)


export default labRouter;