import Router from 'express';
import { createComment, loadComments, deleteComment, editComment, likeHandler, dislikeHandler, replyComment,loadRepliedComments } from '../Controllers/Comment.controller.js';
import isLogined from '../Middlewares/isLogined.js';

const router = Router();

router.route('/:videoId').post(isLogined, createComment).get(isLogined, loadComments)
router.route('/:commentId').delete(isLogined, deleteComment).put(isLogined, editComment);
router.route('/reply/:commentId').post(isLogined, replyComment).get(isLogined, loadRepliedComments)
router.route('/like/:commentId').post(isLogined, likeHandler);
router.route('/dislike/:commentId').post(isLogined, dislikeHandler);

export default router;