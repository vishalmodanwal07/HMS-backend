import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { assignDoctor, createPatient, deletePatient, getPatientById, getPatients, updatePatient } from "../controllers/patient.Controller.js";

const patientRouter = Router();

patientRouter.route("/").post(verifyJWT , authorize("Reception", "Admin") , createPatient);
patientRouter.route("/").get(verifyJWT , authorize("Reception", "Admin" , "Doctor") , getPatients);
patientRouter.route("/:id").get(verifyJWT , authorize("Reception", "Doctor", "Lab", "Admin") , getPatientById);
patientRouter.route("/:id").put(verifyJWT , authorize("Reception", "Admin") , updatePatient);
patientRouter.route("/:id/assign-doctor").post(verifyJWT , authorize("Reception", "Admin") , assignDoctor);
patientRouter.route("/:id").delete(verifyJWT , authorize("Admin") , deletePatient);



export default patientRouter;