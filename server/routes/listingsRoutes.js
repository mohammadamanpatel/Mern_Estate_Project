import express from "express";
import {
  createListing,
  getListings,
  getListingById,
  deleteListing,
  updateListingById,
  getListingsforSearch,
} from "../controllers/listings.js";
import { verifyToken } from "../utils/verifyToken.js";
import { upload } from "../utils/uploadByMulter.js";

const router = express.Router();

router.post("/listings", verifyToken, upload.array('imageUrls', 6) ,createListing);
router.get("/listings", verifyToken, getListings);
router.get("/listings/:id", verifyToken, getListingById);
router.get("/get", getListingsforSearch);
router.put("/listings/:id", verifyToken, upload.array('imageUrls', 6),updateListingById);
router.delete("/listings/:id", verifyToken, deleteListing);

export default router;
