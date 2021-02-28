import { Request, Response } from "express";
import fs from 'fs';
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { AppError } from '../errors/AppError';


class AnswerController {


    async execute(request: Request, response: Response) {
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if (!surveyUser) {
            throw new AppError("Survey User does not exists");
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        const successPath = resolve(__dirname, "..", "views", "pages", "confirmationMail.hbs")

        const html = fs.readFileSync(successPath).toString("utf-8");

        return response.send(html);

    }
}

export { AnswerController };