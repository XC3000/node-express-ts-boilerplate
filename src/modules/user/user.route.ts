import express from "express";
import { validateResource } from "../../middleware/validateResource";
import { createUserSchema } from "./user.schema";
import { createUserHandler } from "./user.controller";

const router = express.Router();

router.route("/").post(validateResource(createUserSchema), createUserHandler);

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
