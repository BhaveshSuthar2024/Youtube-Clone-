import { Router } from 'express';
import { createChannel, getChannelById, subscribeHandler, unSubscribeHandler } from '../Controllers/Channel.controller.js';
import isLogined from '../Middlewares/isLogined.js'
import upload from '../Middlewares/multer.middleware.js'

const router = Router()

router.route("/createChannel").post(isLogined, upload.fields([
    {
        name: "coverImage",
        maxCount: 1
    }
]), createChannel);

router.route("/:id/:page?").get(isLogined, getChannelById);
router.route("/subscribe/:channelId").post(isLogined, subscribeHandler);
router.route("/unsubscribe/:channelId").post(isLogined, unSubscribeHandler);

export default router;