import Router from 'express';
import isLogined from '../Middlewares/isLogined.js';
import { createPlaylist, loadPlaylists, addVideoToPlaylist, loadVideosInPlaylist, saveAPlaylist, deletePlaylist, uploadVideoInPlaylist, saveVideoToNewPlaylist, removeVideoFromPlaylist } from '../Controllers/Playlist.controller.js';
import upload from '../Middlewares/multer.middleware.js'

const router = Router();

router.route('/').post(isLogined, createPlaylist).get(isLogined, loadPlaylists);
router.route('/upload/:playlistId').post(isLogined, upload.fields([
    {
        name: "videoUrl",
        maxCount: 1
    },
    {
        name: "thumbnailUrl",
        maxCount: 1
    }
]), uploadVideoInPlaylist);
router.route('/addVideo/:videoId').post(isLogined, saveVideoToNewPlaylist);
router.route('/:playlistId').get(isLogined, loadVideosInPlaylist).post(isLogined, saveAPlaylist).delete(isLogined, deletePlaylist);
router.route('/:playlistId/:videoId').post(isLogined, addVideoToPlaylist).delete(isLogined, removeVideoFromPlaylist);



export default router;