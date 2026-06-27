'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Star } from 'lucide-react';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';

export default function Testimonial() {
  return (
    <>
    <div className="testimonials space">
            <div className="container">
                <div className="text-center title">
                    <h2>Testimonials</h2>
                    <p>What people say about us</p>
                </div>
                <Swiper modules={[Pagination, Autoplay]} autoplay={{delay: 5000, disableOnInteraction: false }} slidesPerView={1}
                        spaceBetween={10}
                        pagination={{
                        clickable: true,
                        }}
                        breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 50,
                        },
                        }} className="mySwiper">
                    <SwiperSlide>
                        <div className="box">
                            <div className="rating">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>
                            <div className="copy">
                                <p>The hotel is well located. Rooms are very clean. Great services. Very kind people from front desk and delicious breakfast. Plenty of options to relax on the property too. And the staff are very willing to help you plan your day. </p>
                            </div>
                            <div className="name"><h4>Luna Wayne</h4></div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="box">
                            <div className="rating">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>
                            <div className="copy">
                                <p>The hotel is well located. Rooms are very clean. Great services. Very kind people from front desk and delicious breakfast. Plenty of options to relax on the property too. And the staff are very willing to help you plan your day. </p>
                            </div>
                            <div className="name"><h4>Luna Wayne</h4></div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="box">
                            <div className="rating">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>
                            <div className="copy">
                                <p>The hotel is well located. Rooms are very clean. Great services. Very kind people from front desk and delicious breakfast. Plenty of options to relax on the property too. And the staff are very willing to help you plan your day. </p>
                            </div>
                            <div className="name"><h4>Luna Wayne</h4></div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="box">
                            <div className="rating">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>
                            <div className="copy">
                                <p>The hotel is well located. Rooms are very clean. Great services. Very kind people from front desk and delicious breakfast. Plenty of options to relax on the property too. And the staff are very willing to help you plan your day. </p>
                            </div>
                            <div className="name"><h4>Luna Wayne</h4></div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="box">
                            <div className="rating">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>
                            <div className="copy">
                                <p>The hotel is well located. Rooms are very clean. Great services. Very kind people from front desk and delicious breakfast. Plenty of options to relax on the property too. And the staff are very willing to help you plan your day. </p>
                            </div>
                            <div className="name"><h4>Luna Wayne</h4></div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="box">
                            <div className="rating">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>
                            <div className="copy">
                                <p>The hotel is well located. Rooms are very clean. Great services. Very kind people from front desk and delicious breakfast. Plenty of options to relax on the property too. And the staff are very willing to help you plan your day. </p>
                            </div>
                            <div className="name"><h4>Luna Wayne</h4></div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
      
    </>
  );
}
