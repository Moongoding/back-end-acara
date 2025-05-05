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
import ticketController from "../controllers/ticket.controller";
import bannerController from "../controllers/banner.controller";
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
], mediaController.single
    /*
    #swagger.tags = ['Media']
    #swagger.security = [{
        "bearerAuth":{}
    }]
    
    #swagger.requestBody = {
        required :true,
        content: {
            "multipart/form-data" : {
                schema: {
                    type : "object",
                    properties : {
                        file : {
                            type:"string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
    */

);

router.post("/media/upload-multiple", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
    mediaMiddleware.multiple('files')
], mediaController.multiple
    /*
    #swagger.tags = ['Media']
    #swagger.security = [{
        "bearerAuth":{}
    }]

    #swagger.requestBody = {
        required :true,
        content: {
            "multipart/form-data" : {
                schema: {
                    type : "object",
                    properties : {
                        files : {
                            type:"array",
                            items:{
                                type: "string",
                                format: "binary"
                            }
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
    */
);

router.delete('/media/remove', [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
], mediaController.remove
    /*
        #swagger.tags = ['Media']
        #swagger.security = [{
            "bearerAuth":{}
        }]
    
        #swagger.requestBody = {
            required:true,
            schema : {
                $ref: "#/components/schemas/RemoveMediaRequest"
            }
        }
    */
);
// End Api Router Media

// Start Api Router Category
router.post('/category',
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.create
    /*
    #swagger.tags = ['Category']
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    #swagger.requestBody = {
        required:true,
        schema:{
            $ref: "#/components/schemas/CreateCategoryRequest"
        }
    }
    */
);

router.get('/category', authMiddleware, categoryController.findAll
    /*
    #swagger.tags = ['Category']
    */
);
router.get('/category/:id', authMiddleware, categoryController.findOne
    /*
    #swagger.tags = ['Category']
    */
);
router.put('/category/:id',
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.update
    /*
    #swagger.tags = ['Category']
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    #swagger.requestBody = {
        required:true,
        schema:{
            $ref: "#/components/schemas/CreateCategoryRequest"
        }
    }
    */
);
router.delete('/category/:id',
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.remove
    /*
    #swagger.tags = ['Category']
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    */
);
// End Api Router Category

// Start Api Router Region
router.get("/regions", authMiddleware, regionController.getAllProvinces
    /*
    #swagger.tags = ['Regions']
    */
);
router.get("/regions/:id/province", authMiddleware, regionController.getProvince
    /*
    #swagger.tags = ['Regions']
    */
);
router.get("/regions/:id/regency", authMiddleware, regionController.getRegency
    /*
    #swagger.tags = ['Regions']
    */
);
router.get("/regions/:id/district", authMiddleware, regionController.getDistrict
    /*
    #swagger.tags = ['Regions']
    */
);
router.get("/regions/:id/village", authMiddleware, regionController.getVillage
    /*
    #swagger.tags = ['Regions']
    */
);
router.get("/regions-search", authMiddleware, regionController.findByCity
    /*
    #swagger.tags = ['Regions']
    */
);
// End Api Router Region


// Start Api Router Event
router.post("/events",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    eventController.create
    /*
        #swagger.tags = ['Events']
        #swagger.security = [{
            "bearerAuth" : {}
        }]
        #swagger.requestBody = {
            required:true,
            schema:{
                $ref: "#/components/schemas/CreateEventRequest"
            }
        }
        */
);
router.get("/events", authMiddleware, eventController.findAll
    /*
    #swagger.tags = ['Events']
    #swagger.parameters['isOnline'] = {
        in: 'query',
        name: 'isOnline',
        description: 'Filter event online (true/false)',
        required: false,
        schema: { type: 'boolean' }
    }
    #swagger.parameters['isFeatured'] = {
        in: 'query',
        name: 'isFeatured',
        description: 'Filter event unggulan (true/false)',
        required: false,
        schema: { type: 'boolean' }
    }
    #swagger.parameters['isPublish'] = {
        in: 'query',
        name: 'isPublish',
        description: 'Filter event yang sudah publish (true/false)',
        required: false,
        schema: { type: 'boolean' }
    }
*/

);

router.get("/events/:id", authMiddleware, eventController.findOne
    /*
        #swagger.tags = ['Events']
    */
);
router.put("/events/:id",
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    eventController.Update
    /*
        #swagger.tags = ['Events']
        #swagger.security = [{
            "bearerAuth" : {}
        }]
        #swagger.requestBody = {
            required:true,
            schema:{
                $ref: "#/components/schemas/CreateEventsRequest"
            }
        }
    */
);
router.delete("/events/:id", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN])],
    eventController.remove
    /*
        #swagger.tags = ['Events']
        #swagger.security = [{
            "bearerAuth" : {}
        }]
    */
);
router.get("/events/:slug/slug", authMiddleware, eventController.findOneBySlug
    /*
    #swagger.tags = ['Events']
    #swagger.security = [{
        "bearerAuth" : {}
    }]
    */
);
// End Api Router Event


// Start Api Router Ticket
router.post("/tickets", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN])],
    ticketController.create);

router.get("/tickets", authMiddleware, ticketController.findAll);

router.get("/tickets/:id", authMiddleware, ticketController.findOne);

router.put("/tickets/:id", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN])],
    ticketController.update);

router.delete("/tickets/:id", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN])],
    ticketController.remove);

router.get("/tickets/:eventId/events", authMiddleware, ticketController.findAllByEvent);
// End Api Router Ticket


// Start Api Router Banner
router.post("/banners", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN])],
    bannerController.create);

router.get("/banners", authMiddleware, bannerController.findAll);

router.get("/banners/:id", authMiddleware, bannerController.findOne);

router.put("/banners/:id", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN])],
    bannerController.update);

router.delete("/banners/:id", [
    authMiddleware,
    aclMiddleware([ROLES.ADMIN])],
    bannerController.remove);

// End Api Router Banner

// router.get('/dummy', dummyController.dummy);

export default router;