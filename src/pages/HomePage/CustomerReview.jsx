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
    arrows: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
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
        breakpoint: 768,
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Customer <span className="text-sky-600">Testimonials</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-600 mx-auto mb-8 rounded-full"></div>
          <Spinner className="h-16 w-16 mx-auto" />
        </div>
      </section>
    );
  }

  if (errorReviews) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Customer <span className="text-sky-600">Testimonials</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-600 mx-auto mb-8 rounded-full"></div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-2xl mx-auto">
            <p className="text-red-700 font-medium">{errorReviews}</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Customer <span className="text-sky-600">Testimonials</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-blue-600 mx-auto mb-8 rounded-full"></div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 max-w-2xl mx-auto">
            <p className="text-blue-700">No reviews available yet. Be the first to leave one!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
   <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Customer <span className="text-sky-600">Testimonials</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear what our valued customers say about their experience with us
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <Slider {...settings}>
            {reviews.map((review) => (
              <div key={review._id} className="px-4 py-2 h-full">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img 
                            src={review.reviewerImage || 'https://i.ibb.co/VtWn3mS/user.png'} 
                            alt={review.reviewerName} 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.target.src = 'https://i.ibb.co/VtWn3mS/user.png';
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-sky-500 rounded-full p-1">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-gray-800">{review.reviewerName || 'Anonymous'}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{review.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative mb-6 flex-grow">
                      <svg
                        className="absolute -top-1 -left-1 w-8 h-8 text-gray-200 opacity-75"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-gray-700 text-lg italic pl-8">"{review.feedback}"</p>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {new Date(review.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;