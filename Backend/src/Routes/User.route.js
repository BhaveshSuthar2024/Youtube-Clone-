import Router from 'express';
import { getUserProfile, videolistHandler, watchHistoryHandler, getUserWatchHistory, removeVideofromHistory, saveVideoHandler } from '../Controllers/User.controller.js';
import isLogined from '../Middlewares/isLogined.js';

const router = Router();

router.route('/userprofile').get(isLogined, getUserProfile);
router.route('/history').get(isLogined, getUserWatchHistory).delete(isLogined, removeVideofromHistory);
router.route('/saveVideo/:videoId').post(isLogined, saveVideoHandler);
router.route('/:pageId').get(isLogined, videolistHandler);
router.route('/:videoId').post(isLogined, watchHistoryHandler);


export default router;