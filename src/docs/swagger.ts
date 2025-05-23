import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API Acara",
        description: "Dokumentasi API Acara",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Local Server",
        }, {
            url: "https://back-end-acara-khaki.vercel.app/api",
            description: "Deploy Server",
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                "indentifier": "Bee",
                "password": "password123"
            },
            RegisterRequest: {
                fullName: "Joni Joni",
                username: "joni2024",
                email: "kunanta@yopmail.com",
                password: "password123",
                confirmPassword: "password123"
            },
            ActivationRequest: {
                code: "AudioBufferSourceNode",
            },
            RemoveMediaRequest: {
                fileUrl: "",
            },
            CreateCategoryRequest: {
                name: "",
                description: "",
                icon: ""
            },
            CreateEventRequest: {
                "name": "",
                "banner": "FileUrl banner",
                "category": "category objectId",
                "description": "",
                "startDate": "yyyy-mm-dd hh:mm:ss",
                "endDate": "yyyy-mm-dd hh:mm:ss",
                "location": {
                    "region": "region id",
                    "coordinates": [-0, 0],
                    "address": "",
                },
                "isOnline": "false",
                "isFeatured": "true",
                "isPublish": "false"
            },
            CreateBannerRequest:
            {
                "title": "This title 3",
                "image": "https://res.cloudinary.com/dbsxp7yaw/image/upload/v1744788707/lq6lsgyhtc5tg5zcr1cn.jpg",
                "isShow": 1
            },
            CreateTicketsRequest:
            {
                "price": "2500",
                "name": "Ticket VVIP",
                "events": "6811a1b799ec508e79fcf09d",
                "description": "Ticket VVIP description",
                "quantity": "100"
            }
        },
    },
    security: [{ bearerAuth: [] }]
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);