import express from "express";
import requireUser from "../../middleware/requireUser";
import { validateResource } from "../../middleware/validateResource";
import { createSessionSchema } from "./session.schema";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./session.controller";

const router = express.Router();

router
  .route("/")
  .get(requireUser, getUserSessionsHandler)
  .post(validateResource(createSessionSchema), createUserSessionHandler)
  .delete(requireUser, deleteSessionHandler);

export default router;

/**
 * @openapi
 * '/api/sessions':
 *  get:
 *    tags:
 *    - Session
 *    summary: Get all sessions
 *    responses:
 *      200:
 *        description: Get all sessions for current user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GetSessionResponse'
 *      403:
 *        description: Forbidden
 *  post:
 *    tags:
 *    - Session
 *    summary: Create a session
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateSessionInput'
 *    responses:
 *      200:
 *        description: Session created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateSessionResponse'
 *      401:
 *        description: Unauthorized
 *  delete:
 *    tags:
 *    - Session
 *    summary: Delete a session
 *    responses:
 *      200:
 *        description: Session deleted
 *      403:
 *        description: Forbidden
 */
