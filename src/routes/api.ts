import express, { Request, Response } from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.Middleware";
import aclMiddleware from "../middleware/acl.middleware";
import { ROLES } from "../utills/constanst";
import mediaMiddleware from "../middleware/media.middleware";
import mediaController from "../controllers/media.controller";
import categoryController from "../controllers/category.controller";
// import dummyController from "../controllers/dummy.controller";

const router = express.Router();
// Start Api Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
router.post("/auth/activation", authController.activation);
// End Api Auth

// Start Api Media 
router.post("/media/upload-single", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.single('file'),
], mediaController.single);

router.post("/media/upload-multiple", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.multiple('files')
], mediaController.multiple);

router.delete('/media/remove', [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
], mediaController.remove);
// End Api Media

// Start Api Kategory
router.post('/category', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.create);
router.get('/category', categoryController.findAll);
router.get('/category/:id', categoryController.findOne);
router.put('/category/:id', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.update);
router.delete('/category/:id', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.remove);

// End Api Kategory

// router.get('/dummy', dummyController.dummy);

export default router;