import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router-dom";
import { FaBed, FaBath, FaCar, FaCouch } from "react-icons/fa";
const Listing = () => {
  const [listing, setListing] = useState("");
  console.log("listing",listing);
  const [loading, setLoading] = useState(true);
  const listingId = useParams();
  console.log("listingId",listingId);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(
          `/api/listing/listings/${listingId.listingId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }
        const data = await response.json();
        setListing(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId.listingId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
    {loading ? (
      <p className="text-center mt-8">Loading...</p>
    ) : (
      <div className="flex-grow relative">
        <Slider {...settings} className="mb-4 h-full">
          {listing.imageUrls.map((imageUrl, index) => (
            <div key={index}>
              <img
                src={imageUrl}
                alt={`Image ${index}`}
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          ))}
        </Slider>
        <h1 className="absolute top-0 left-0 text-white font-bold text-2xl bg-black bg-opacity-50 p-4">
          {listing.name}
        </h1>
      </div>
    )}
    <div className="bg-white p-4 flex-grow flex flex-col">
      <div className="mb-4 bg-gray-200 p-4 rounded-md">
        <p className="text-gray-700 mb-2">Description: {listing.description}</p>
        <p className="text-gray-700 mb-2">Address: {listing.address}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-gray-200 p-4 rounded-md flex items-center">
          <FaBed className="mr-2" />
          <p className="text-gray-700">Bedrooms: {listing.bedrooms}</p>
        </div>
        <div className="bg-gray-200 p-4 rounded-md flex items-center">
          <FaBath className="mr-2" />
          <p className="text-gray-700">Bathrooms: {listing.bathrooms}</p>
        </div>
        <div className="bg-gray-200 p-4 rounded-md flex items-center">
          <FaCar className="mr-2" />
          <p className="text-gray-700">Parking: {listing.parking ? "Yes" : "No"}</p>
        </div>
        <div className="bg-gray-200 p-4 rounded-md flex items-center">
          <FaCouch className="mr-2" />
          <p className="text-gray-700">Furnished: {listing.furnished ? "Yes" : "No"}</p>
        </div>
        <div className="bg-gray-200 p-4 rounded-md flex items-center">
          <p className="text-gray-700">Type: {listing.type}</p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Listing;
