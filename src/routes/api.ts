import express, { Request, Response } from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.Middleware";
import aclMiddleware from "../middleware/acl.middleware";
import { ROLES } from "../utills/constanst";
import mediaMiddleware from "../middleware/media.middleware";
import mediaController from "../controllers/media.controller";
import categoryController from "../controllers/category.controller";
import regionController from "../controllers/region.controller";
import eventController from "../controllers/event.controller";
// import dummyController from "../controllers/dummy.controller";

const router = express.Router();
// Start Api Router Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);
router.post("/auth/activation", authController.activation);
// End Api Router Auth

// Start Api Router Media 
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
// End Api Router Media

// Start Api Router Category
router.post('/category', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.create);
router.get('/category', categoryController.findAll);
router.get('/category/:id', categoryController.findOne);
router.put('/category/:id', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.update);
router.delete('/category/:id', [authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.remove);
// End Api Router Category

// Start Api Router Region
router.get("/regions", regionController.getAllProvinces);
router.get("/regions/:id/province", regionController.getProvince);
router.get("/regions/:id/regency", regionController.getRegency);
router.get("/regions/:id/district", regionController.getDistrict);
router.get("/regions/:id/village", regionController.getVillage);
router.get("/regions-search", regionController.findByCity);
// End Api Router Region


// Start Api Router Event
router.post("/events", [authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.create);
router.get("/events", eventController.findAll);
router.get("/events/:id", eventController.findOne);
router.put("/events/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.Update);
router.delete("/events/:id", [authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.remove);
router.get("/events/:slug/slug", eventController.findOneBySlug);
// End Api Router Event

// router.get('/dummy', dummyController.dummy);

export default router;