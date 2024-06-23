import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditListing = () => {
  const { listingId } = useParams();
  console.log("listingId", listingId);
  const navigate = useNavigate();
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
    userRef: "",
  });
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listing/listings/${listingId}`);
        const data = await response.json();
        console.log("data after fetching by listingId", data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      console.log("key, formData[key]", key, formData[key]);
      form.append(key, formData[key]);
    }
    for (const file of files) {
      console.log("file during appending in new Data()", file);
      form.append("imageUrls", file);
    }
    console.log("form data before dbCall", form);
    try {
      const response = await fetch(`/api/listing/listings/${listingId}`, {
        method: "PUT",
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("data after updating", data);
        navigate(`/listing/${listingId}`); // Navigate to the updated listing page
      } else {
        const errorData = await response.json();
        console.error("Error updating listing:", errorData);
      }
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-5 text-center sm:text-left">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address:
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Regular Price:
          </label>
          <input
            type="number"
            name="regularPrice"
            value={formData.regularPrice}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount Price:
          </label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bathrooms:
          </label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bedrooms:
          </label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="furnished"
            checked={formData.furnished}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">
            Furnished
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="parking"
            checked={formData.parking}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">
            Parking
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type:
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="offer"
            checked={formData.offer}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">
            Offer
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images:
          </label>
          <input
            type="file"
            name="files"
            onChange={handleFileChange}
            multiple
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Listing
        </button>
      </form>
    </div>
  );
};

export default EditListing;
