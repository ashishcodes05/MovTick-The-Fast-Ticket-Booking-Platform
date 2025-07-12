import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import hero_1 from "../assets/hero_1.png";
import hero_2 from "../assets/hero_2.jpg";
import hero_3 from "../assets/hero_3.jpg";
import hero_4 from "../assets/hero_4.jpg";
import hero_5 from "../assets/hero_5.jpg";
import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router";

const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        loop={true}
        speed={1000}
        allowTouchMove={true}
      >
        <SwiperSlide>
          <div className="relative w-full h-full">
            <div className="absolute top-[30%] left-[10%] z-10 ">
              <img
                className="max-h-11 lg:h-11"
                src={assets.marvelLogo}
                alt=""
              />
              <h1 className="left-[10%] text-white text-6xl font-bold">
                Avengers: <br /> Endgame
              </h1>
              <div className="flex items-center gap-4 text-gray-300 mt-4">
                <span>Action | Adventure | Sci-Fi</span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4.5 h-4.5" /> 2019
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4.5 h-4.5" /> 3h 1m
                </div>
              </div>
              <p className="text-gray-300 mt-4 max-w-md">
                In the aftermath of Thanos' devastating snap, the remaining
                Avengers must find a way to bring back their fallen allies and
                restore balance to the universe.
              </p>
              <button onClick={() => navigate("/movies")} className="flex items-center gap-2 text-white mt-4 cursor-pointer bg-primary px-4 py-2 rounded-md hover:bg-accent hover:text-primary transition-colors">
                Explore <ArrowRight />
              </button>
            </div>
            <img
              className="w-full h-full object-cover opacity-40"
              src={hero_1}
              alt="Image 1"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full">
            <div className="absolute top-[30%] left-[10%] z-10">
              <h1 className="left-[10%] text-white text-6xl font-bold">
                John Wick: <br /> Chapter 4
              </h1>
              <div className="flex items-center gap-4 text-gray-300 mt-4">
                <span>Action | Adventure | Sci-Fi</span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4.5 h-4.5" /> 2023
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4.5 h-4.5" /> 2h 49m
                </div>
              </div>
              <p className="text-gray-300 mt-4 max-w-md">
                In the fourth installment of the John Wick franchise, the
                legendary assassin uncovers a path to defeating the High Table.
                But before he can earn his freedom, Wick must face off against a
                new enemy with powerful alliances across the globe.
              </p>
              <button onClick={() => navigate("/movies")} className="flex items-center gap-2 text-white mt-4 cursor-pointer bg-primary px-4 py-2 rounded-md hover:bg-accent hover:text-primary transition-colors">
                Explore <ArrowRight />
              </button>
            </div>
            <img
              className="w-full h-full object-cover opacity-40"
              src={hero_2}
              alt="Image 2"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full">
            <div className="absolute top-[30%] left-[10%] z-10">
              <h1 className="left-[10%] text-white text-6xl font-bold">
                Demon Slayer: <br /> Infinity Castle
              </h1>
              <div className="flex items-center gap-4 text-gray-300 mt-4 ">
                <span>Action | Adventure | Fantasy</span>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4.5 h-4.5" /> 2025
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4.5 h-4.5" /> 2h 35m
                </div>
              </div>
              <p className="text-gray-300 mt-4 max-w-md">
                In a world where demons threaten humanity, a young boy becomes
                a demon slayer to avenge his family and protect those he loves.
              </p>
              <button onClick={() => navigate("/movies")} className="flex items-center gap-2 text-white mt-4 cursor-pointer bg-primary px-4 py-2 rounded-md hover:bg-accent hover:text-primary transition-colors">
                Explore <ArrowRight />
              </button>
            </div>
            <img
              className="w-full h-full object-cover opacity-40"
              src={hero_4}
              alt="Image 3"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSection;
