import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createTreatmentRecord, deleteTreatment, getTreatmentById, getTreatmentsByPatient, updateTreatment } from "../controllers/treatment.Controller.js";

const treatmentRouter = Router();

treatmentRouter.route("/").post(verifyJWT , authorize("Doctor") , createTreatmentRecord);
treatmentRouter.route("/patient/:patientId").get(verifyJWT , authorize("Doctor", "Reception", "Admin") , getTreatmentsByPatient);
treatmentRouter.route("/:id").post(verifyJWT , authorize("Doctor", "Reception", "Admin") , getTreatmentById);
treatmentRouter.route("/:id").put(verifyJWT , authorize("Doctor", "Admin") , updateTreatment);
treatmentRouter.route("/:id").delete(verifyJWT , authorize("Admin") ,deleteTreatment );



export default treatmentRouter;