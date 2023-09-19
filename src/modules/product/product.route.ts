import express from "express";
import requireUser from "../../middleware/requireUser";
import { validateResource } from "../../middleware/validateResource";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./product.schema";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from "./product.controller";

const router = express.Router();

router
  .route("/")
  .post(
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );

router
  .route("/:productId")
  .put(
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  )
  .get(validateResource(getProductSchema), getProductHandler)
  .delete(
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );

export default router;

/**
 * @openapi
 * '/api/products':
 *  post:
 *     tags:
 *     - Products
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schema/Product'
 *     responses:
 *       200:
 *         description: Product created
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/productResponse'
 *           example:
 *             "user": "642a0de05f16e6dad68efdad"
 *             "title": "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
 *             "description": "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go."
 *             "price": 879.99
 *             "image": "https://i.imgur.com/QlRphfQ.jpg"
 *             "_id": "642a1cfcc1bec76d8a2e7ac2"
 *             "productId": "product_xxqm8z3eho"
 *             "createdAt": "2023-04-03T00:25:32.189Z"
 *             "updatedAt": "2023-04-03T00:25:32.189Z"
 *             "__v": 0
 */

/**
 * @openapi
 * '/api/products/{productId}':
 *  get:
 *     tags:
 *     - Products
 *     summary: Get a single product by the productId
 *     parameters:
 *      - name: productId
 *        in: path
 *        description: The id of the product
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/productResponse'
 *       404:
 *         description: Product not found
 *  put:
 *     tags:
 *     - Products
 *     summary: Update a single product
 *     parameters:
 *      - name: productId
 *        in: path
 *        description: The id of the product
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schema/Product'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/productResponse'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *  delete:
 *     tags:
 *     - Products
 *     summary: Delete a single product
 *     parameters:
 *      - name: productId
 *        in: path
 *        description: The id of the product
 *        required: true
 *     responses:
 *       200:
 *         description: Product deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
