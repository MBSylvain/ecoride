import React from "react";
import { FaStarHalfAlt, FaRegStar } from "react-icons/fa";
const ReviewCard = ({ photo, text, rating }) => {
  // Fonction pour afficher les étoiles en fonction de la note
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center w-full md:w-1/3">
      <img
        src={"https://via.placeholder.com/150"}
        alt="Reviewer"
        className="w-20 h-20 rounded-full border-black border-2 mx-auto mb-4"
      />
      <p className="text-base mb-4">{text}</p>
      <div className="flex justify-center space-x-1">{renderStars()}</div>
    </div>
  );
};

export default ReviewCard;
