import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Spinner from '../../component/Loader/Spinner';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState(null);
  const axiosPublic = useAxiosPublic();
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      setErrorReviews(null);
      try {
        const res = await axiosPublic.get('/reviews');
        const limitedReviews = res.data.slice(0, 5);
        setReviews(limitedReviews);
      } catch (err) {
        console.error("Error fetching reviews for homepage:", err);
        setErrorReviews("Failed to load customer reviews. Please try again later.");
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [axiosPublic]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  if (loadingReviews) {
    return (
      <section className="my-16 text-center">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Customers Love Us!</h2>
        <Spinner />
      </section>
    );
  }

  if (errorReviews) {
    return (
      <section className="my-16 text-center">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Customers Love Us!</h2>
        <p className="text-red-600 text-lg">{errorReviews}</p>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="my-16 text-center">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Customers Love Us!</h2>
        <p className="text-gray-600 text-lg">No reviews available yet. Be the first to leave one!</p>
      </section>
    );
  }

  return (
    <section className="my-16 px-4 md:px-0"> {/* padding যোগ করা হয়েছে */}
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Customers Love Us!</h2>
      <div className="max-w-7xl mx-auto"> {/* ক্যারোসেলের প্রস্থ নিয়ন্ত্রণ */}
        <Slider {...settings}>
          {reviews.map((review) => (
            <div key={review._id} className="p-4"> {/* প্রতিটি স্লাইডের জন্য প্যাডিং */}
              <div className="card bg-base-100 shadow-xl border border-gray-200 h-full flex flex-col justify-between">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="avatar mr-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img src={review.reviewerImage
                          || 'https://i.ibb.co/VtWn3mS/user.png'} alt={review.reviewerName} className="object-cover w-full h-full" />
                      </div>
                    </div>
                    <div>
                      <h3 className="card-title text-lg font-semibold">{review.reviewerName || 'Anonymous'}</h3>
                      <div className="rating rating-sm"> {/* DaisyUI Rating ডিসপ্লে */}
                        {Array.from({ length: 5 }, (_, i) => (
                          <input
                            key={i}
                            type="radio"
                            name={`rating-${review._id}`} // প্রতিটি রিভিউর জন্য ইউনিক নাম
                            className="mask mask-star-2 bg-orange-400"
                            readOnly // ইউজার শুধু দেখতে পারবে, পরিবর্তন করতে পারবে না
                            checked={i + 1 === review.rating} // রিভিউর রেটিং অনুযায়ী স্টার হাইলাইট হবে
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-base flex-grow">"{review.feedback}"</p>
                </div>
                <div className="card-actions justify-end p-4 pt-0">
                  <span className="text-sm text-gray-500">
                    {new Date(review.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default CustomerReviews;