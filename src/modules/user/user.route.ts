import express from "express";
import multer from "multer";
import { validateResource } from "../../middleware/validateResource";
import * as userController from "./user.controller";
import * as userSchema from "./user.schema";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router
  .route("/")
  .post(
    upload.single("profile"),
    validateResource(userSchema.createUserSchema),
    userController.createUserHandler
  );

router
  .route("/:id")
  .delete(
    validateResource(userSchema.deleteUserSchema),
    userController.deleteUser
  );

export default router;

/**
 * @openapi
 * '/api/users':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
