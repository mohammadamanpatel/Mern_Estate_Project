import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddListings = () => {
  const { currentUser } = useSelector((state) => state.user); // assuming user data is in user state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: "",
    discountPrice: "",
    bathrooms: "",
    bedrooms: "",
    furnished: false,
    parking: false,
    type: "",
    offer: false,
    imageUrls: [],
    userRef: "", // initialize as empty string
  });

  const [imageError, setImageError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFormData((prevData) => ({
        ...prevData,
        userRef: currentUser.user._id,
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      setImageError("You can only upload a maximum of 6 images");
      return;
    }
    setImageError("");
    setFormData({
      ...formData,
      imageUrls: files,
    });
  };

  const removeImage = (index) => {
    const updatedImages = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      imageUrls: updatedImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "imageUrls") {
        formData[key].forEach((file) => formDataObj.append(key, file));
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    console.log("Form Data before submitting:", formData); // Log the formData object
    try {
      const res = await fetch("/api/listing/listings", {
        method: "POST",
        body: formDataObj,
      });

      const data = await res.json();
      console.log("data after submitting", data);
      navigate('/profile')
      if (data.error) {
        console.error(data.error);
        return;
      }
      // Navigate to another page after successful submission, e.g., listing details page
      
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6 bg-gray-800 shadow-lg flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center lg:text-left text-white">
          Add New Listing
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="p-3 border border-gray-600 rounded bg-gray-700 text-white"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <textarea
            className="p-3 border border-gray-600 rounded bg-gray-700 text-white"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            className="p-3 border border-gray-600 rounded bg-gray-700 text-white"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          />
          <input
            className="p-3 border border-gray-600 rounded bg-gray-700 text-white"
            type="number"
            name="regularPrice"
            value={formData.regularPrice}
            onChange={handleChange}
            placeholder="Regular Price"
            required
          />
          <input
            className="p-3 border border-gray-600 rounded bg-gray-700 text-white"
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="Discount Price"
            required
          />
          <input
            className="p-3 border border-gray-600 rounded bg-gray-700 text-white"
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="Bathrooms"
            required
          />
          <input
            className="p-3 border border-gray-600 rounded bg-gray-700 text-white"
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Bedrooms"
            required
          />
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              name="furnished"
              checked={formData.furnished}
              onChange={handleChange}
            />
            Furnished
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              name="parking"
              checked={formData.parking}
              onChange={handleChange}
            />
            Parking
          </label>
          <input
            className="p-3 border border-gray-600 rounded bg-gray-700 text-white"
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Type"
            required
          />
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              name="offer"
              checked={formData.offer}
              onChange={handleChange}
            />
            Offer
          </label>
        </form>
      </div>
      <div className="flex-1">
        <div className="max-w-sm mx-auto">
          <input
            className="hidden"
            type="file"
            name="imageUrls"
            id="imageUpload"
            onChange={handleImageChange}
            multiple
            accept=".jpg, .png, .jpeg"
          />
          <label
            htmlFor="imageUpload"
            className="block w-full bg-blue-500 text-white rounded-lg p-3 text-center cursor-pointer hover:bg-blue-600 mt-4"
          >
            Upload Images
          </label>
          {imageError && (
            <p className="text-red-500 text-sm mt-2">{imageError}</p>
          )}
          <div className="flex flex-col gap-2 mt-4">
            {formData.imageUrls.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  className="absolute top-0 right-0 text-red-500 p-1"
                  onClick={() => removeImage(index)}
                >
                  delete
                </button>
              </div>
            ))}
          </div>
          <button
            className="w-full mt-6 bg-green-500 text-white rounded-lg p-3 font-semibold hover:bg-green-600"
            type="submit"
            onClick={handleSubmit}
          >
            Add Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddListings;
