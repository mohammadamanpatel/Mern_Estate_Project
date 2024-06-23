import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import {
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  console.log("currentUser in profile", currentUser);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    previewImage: "",
    avatar: "",
    userId: currentUser.user._id,
  });

  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setData({
          ...data,
          previewImage: this.result,
          avatar: uploadedImage,
        });
      });
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!data.username || !data.email) {
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("avatar", data.avatar);

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.user._id}`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("result in profile.jsx", result);
      if (result.error) {
        dispatch(updateUserFailure(result.error));
        return;
      }

      dispatch(updateUserSuccess(result)); // Assuming the updated user data is in result
      navigate("/profile"); // Navigate to the profile page or any other page after success
    } catch (error) {
      console.log("Error in profile submission:", error);
      dispatch(updateUserFailure(error.message));
    }
    console.log("data.previewImage", data.previewImage);
  }

  async function handleSignOut() {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate("/login");
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  function handleAddListings() {
    console.log("handleAddListings");
    navigate("/create-listing");
  }

  async function handleShowListings() {
    console.log("handleShowListings");
    try {
      const res = await fetch(`/api/user/listings/${currentUser.user._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      console.log("data in handleShowListings", data);
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
      console.log("error in show listing", error);
    }
  }

  async function handleDeleteUser() {
    try {
      const res = await fetch(`/api/user/delete/${currentUser.user._id}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (result.error) {
        console.log("Error deleting user:", result.error);
        return;
      }

      handleSignOut(); // Sign out the user after deletion
    } catch (error) {
      console.log("Error in user deletion:", error);
    }
  }
  const handleListingDelete = async (listingId) => {
    console.log("handleListingDelete me listingId", listingId);
    try {
      const res = await fetch(`/api/listing/listings/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  function handleUpdateListing(listingId) {
    navigate(`/update-listing/${listingId}`);
    console.log("handleUpdateListing listingId", listingId);
  }
  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen bg-gray-900 p-4">
      <div className="flex flex-col w-full lg:w-1/3 bg-gray-800 p-6 rounded-lg shadow-lg text-white mb-4 lg:mb-0 lg:mr-4">
        <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-semibold">Edit Profile</h1>
          <label className="cursor-pointer" htmlFor="image_uploads">
            {data.previewImage ? (
              <img
                src={data.previewImage}
                className="w-28 h-28 rounded-full m-auto"
                alt="Profile"
              />
            ) : (
              <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
            )}
          </label>
          <input
            type="file"
            onChange={handleImageUpload}
            id="image_uploads"
            name="image_uploads"
            accept=".jpg, .png, .jpeg, .svg"
            className="hidden"
          />
          <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="username">
              Username
            </label>
            <input
              required
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={data.username}
              className="bg-gray-700 px-2 py-1 border border-gray-600 rounded text-white"
              onChange={handleInputChange}
            />
            <label className="font-semibold" htmlFor="email">
              Email
            </label>
            <input
              required
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              className="bg-gray-700 px-2 py-1 border border-gray-600 rounded text-white"
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition-all ease-in-out duration-300 rounded py-2 cursor-pointer text-lg"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all ease-in-out duration-300 rounded py-2 cursor-pointer text-lg"
          >
            Sign Out
          </button>
          <button
            type="button"
            onClick={handleAddListings}
            className="w-full bg-green-600 hover:bg-green-700 transition-all ease-in-out duration-300 rounded py-2 cursor-pointer text-lg mt-2"
          >
            Add Listings
          </button>
          <button
            type="button"
            onClick={handleShowListings}
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all ease-in-out duration-300 rounded py-2 cursor-pointer text-lg mt-2"
          >
            Show Listings
          </button>
          <button
            type="button"
            onClick={handleDeleteUser}
            className="w-full bg-red-700 hover:bg-red-800 transition-all ease-in-out duration-300 rounded py-2 cursor-pointer text-lg mt-2"
          >
            Delete User
          </button>
        </form>
      </div>
      <div className="flex flex-col w-full lg:w-2/3 bg-gray-800 p-6 rounded-lg shadow-lg text-white">
        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-2xl font-semibold">Your Listings</h1>
            {userListings.map((listing) => {
              console.log("Listing:", listing); // Debug log
              return (
                <div
                  key={listing._id}
                  className="border border-gray-700 rounded-lg p-3 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-700"
                >
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageUrls[0]}
                      alt="listing cover"
                      className="h-16 w-16 object-contain"
                    />
                  </Link>
                  <Link
                    className="text-white font-semibold hover:underline truncate flex-1"
                    to={`/listing/${listing._id}`}
                  >
                    {listing.name}
                  </Link>
                  <div className="flex flex-col item-center">
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="text-red-400 uppercase"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleUpdateListing(listing._id)}
                      className="text-green-400 uppercase"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
