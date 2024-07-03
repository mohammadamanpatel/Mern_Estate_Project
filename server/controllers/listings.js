import Listing from "../models/listings.js";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Create a new listing
export const createListing = async (req, res) => {
  const {
    name,
    description,
    address,
    regularPrice,
    discountPrice,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer,
    userRef,
  } = req.body;

  try {
    const imageUploadPromises = req.files.map(async (file) => {
      const cloudinaryResponse = await uploadImageToCloudinary(
        file.path,
        "listings"
      );
      // Delete the file from the local filesystem
      fs.rm(file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
      return cloudinaryResponse.secure_url;
    });

    const imageUrls = await Promise.all(imageUploadPromises);

    const newListing = new Listing({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    });

    await newListing.save();

    res.status(201).json({ newListing, message: "Listing created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all listings
export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json({ listings, message: "Data of listings fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single listing by ID
export const getListingById = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a listing
export const updateListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (req.user.id !== listing.userRef) {
      return res.status(403).json({ message: "You can update only your listing" });
    }

    const updateData = req.body;

    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      // Destroy previous images from Cloudinary
      const destroyPromises = listing.imageUrls.map((url) => {
        const publicId = url.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(destroyPromises);

      // Upload new images to Cloudinary
      const imageUploadPromises = req.files.map((file) =>
        uploadImageToCloudinary(file.path, "listings")
      );
      const cloudinaryResponses = await Promise.all(imageUploadPromises);

      // Add new image URLs to the updateData
      updateData.imageUrls = cloudinaryResponses.map(
        (response) => response.secure_url
      );

      // Delete the local files
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a listing
export const deleteListing = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search for listings
export const getListingsforSearch = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Unable to fetch data" });
  }
};
