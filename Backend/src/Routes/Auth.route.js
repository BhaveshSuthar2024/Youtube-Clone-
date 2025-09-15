import { Router } from "express";
import { addUser, login, logout, currentlyLoggedUser, generateOTP } from "../Controllers/Auth.controller.js";
import upload from '../Middlewares/multer.middleware.js'
import isLogined from "../Middlewares/isLogined.js"
import validateOTP from "../Utils/validateEmail.js";

const router = Router()

router.route('/signup').post(upload.fields([
    {
        name: "profileImage",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), addUser);
router.route('/validateOTP').post(validateOTP);
router.route('/generateOTP').post(generateOTP)
router.route('/login').post(login);
router.route('/logout').post(isLogined, logout);
router.route('/currentUser').get(isLogined, currentlyLoggedUser);

export default router;