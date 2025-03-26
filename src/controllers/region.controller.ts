import { Request, Response } from "express";
import response from "../utills/response";
import RegionModel from "../models/region.model";

export default {
    async findByCity(req: Request, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller findByCity");
        console.log("Query yang diterima:", req.query);
        console.log("--------------------------------------");

        try {
            const { name } = req.query;
            const result = await RegionModel.findByCity(`${name}`);
            console.log("Hasil query findByCity:", result);
            console.log("--------------------------------------");

            response.success(res, result, "success get region by city name");
        } catch (error) {
            console.error("Error di findByCity:", error);
            response.error(res, error, "failed to get region by city name");
        }
    },
    async getAllProvinces(req: Request, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller getAllProvinces");
        console.log("--------------------------------------");

        try {
            const result = await RegionModel.getAllProvinces();
            console.log("Hasil query getAllProvinces:", result);
            console.log("--------------------------------------");

            response.success(res, result, "success get all provinces");
        } catch (error) {
            console.error("Error di getAllProvinces:", error);
            response.error(res, error, "failed to get all provinces");
        }
    },
    async getProvince(req: Request, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller getProvince");
        console.log("Params yang diterima:", req.params);
        console.log("--------------------------------------");

        try {
            const { id } = req.params;
            const result = await RegionModel.getProvince(Number(id));
            console.log("Hasil query getProvince:", result);
            console.log("--------------------------------------");

            response.success(res, result, "success get a province");
        } catch (error) {
            console.error("Error di getProvince:", error);
            response.error(res, error, "failed to get province");
        }
    },
    async getRegency(req: Request, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller getRegency");
        console.log("Params yang diterima:", req.params);
        console.log("--------------------------------------");

        try {
            const { id } = req.params;
            const result = await RegionModel.getRegency(Number(id));
            console.log("Hasil query getRegency:", result);
            console.log("--------------------------------------");

            response.success(res, result, "success get regencies");
        } catch (error) {
            console.error("Error di getRegency:", error);
            response.error(res, error, "failed to get regency");
        }
    },
    async getDistrict(req: Request, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller getDistrict");
        console.log("Params yang diterima:", req.params);
        console.log("--------------------------------------");

        try {
            const { id } = req.params;
            const result = await RegionModel.getDistrict(Number(id));
            console.log("Hasil query getDistrict:", result);
            console.log("--------------------------------------");

            response.success(res, result, "success get districts");
        } catch (error) {
            console.error("Error di getDistrict:", error);
            response.error(res, error, "failed to get district");
        }
    },
    async getVillage(req: Request, res: Response) {
        console.log("--------------------------------------");
        console.log("Masuk di controller getVillage");
        console.log("Params yang diterima:", req.params);
        console.log("--------------------------------------");

        try {
            const { id } = req.params;
            const result = await RegionModel.getVillage(Number(id));
            console.log("Hasil query getVillage:", result);
            console.log("--------------------------------------");

            response.success(res, result, "success get villages");
        } catch (error) {
            console.error("Error di getVillage:", error);
            response.error(res, error, "failed to get village");
        }
    },
};
