import express from 'express';
import { deleteUser, updateUser, getUser, getListing} from '../controllers/user.js';
import { verifyToken } from '../utils/verifyToken.js';
import { upload } from '../utils/uploadByMulter.js';


const router = express.Router();

router.post("/update/:id", verifyToken,upload.single("avatar"), updateUser);
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getListing)
router.get('/:id', verifyToken, getUser)

export default router;