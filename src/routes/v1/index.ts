import express, { Request, Response } from "express";
import userRoutes from "../../modules/user/user.route";
import sessionRoutes from "../../modules/session/session.route";
import productRoutes from "../../modules/product/product.route";

const router = express.Router();

/**
 * @openapi
 * /healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */

const defaultRoutes = [
  {
    path: "/sessions",
    route: sessionRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/products",
    route: productRoutes,
  },

  {
    path: "/healthcheck",
    route: router.get("/healthcheck", (req: Request, res: Response) =>
      res.sendStatus(200)
    ),
  },
];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: "/docs",
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
