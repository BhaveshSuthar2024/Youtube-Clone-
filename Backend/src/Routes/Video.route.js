import Router from 'express';
import { uploadVideos, getAllVideoes, getVideoById, deleteVideo, likeHandler, dislikeHandler } from '../Controllers/Video.controller.js';
import upload from '../Middlewares/multer.middleware.js'
import isLogined from '../Middlewares/isLogined.js';

const router = Router();

router.route('/uploadVideo').post(isLogined, upload.fields([
    {
        name: "videoUrl",
        maxCount: 1
    },
    {
        name: "thumbnailUrl",
        maxCount: 1
    }
]), uploadVideos);

router.route('/getAllVideos').get(isLogined, getAllVideoes);
router.route('/:id').get(isLogined, getVideoById).delete(isLogined, deleteVideo);
router.route('/like/:videoId').post(isLogined, likeHandler);
router.route('/dislike/:videoId').post(isLogined, dislikeHandler);


export default router;