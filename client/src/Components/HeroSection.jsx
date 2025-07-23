import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router";
import hero_1 from "../assets/hero_1.png";
import hero_2 from "../assets/hero_2.jpg";
import hero_4 from "../assets/hero_4.jpg";
import { assets } from "../assets/assets";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useAppContext } from "../Context/AppContext";

const slides = [
  { 
    img: hero_1,
    backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    poster_path: "/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    title: "Avengers:<br /> Endgame",
    year: 2019,
    duration: "3h 1m",
    genres: "Action | Adventure | Sci-Fi",
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
    logo: assets.marvelLogo,
  },
  {
    img: hero_2,
    poster_path: "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    title: "John Wick:<br /> Chapter 4",
    year: 2023,
    duration: "2h 49m",
    genres: "Action | Adventure | Thriller",
    description: "With the price on his head ever increasing, John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
  },
  {
    img: hero_4,
    poster_path: "/aFRDH3P7TX61FVGpaLhKr6QiOC1.jpg",
    title: "Demon Slayer:<br /> Infinity Castle",
    year: 2025,
    duration: "2h 35m",
    genres: "Action | Adventure | Fantasy",
    description: "As the Demon Slayer Corps members and Hashira engaged in a group strength training program, the Hashira Training, in preparation for the forthcoming battle against the demons, Muzan Kibutsuji appears at the Ubuyashiki Mansion. With the head of the Demon Corps in danger, Tanjiro and the Hashira rush to the headquarters but are plunged into a deep descent to a mysterious space by the hands of Muzan Kibutsuji. The destination of where Tanjiro and Demon Slayer Corps have fallen is the demons' stronghold – the Infinity Castle. And so, the battleground is set as the final battle between the Demon Slayer Corps and the demons ignites.",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const { imageurl } = useAppContext();
  return (
    <div className="relative w-full h-screen min-h-[100svh] overflow-hidden">
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
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-screen min-h-[100svh]">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                src={window.innerWidth < 768 ? `${imageurl}${slide.poster_path}` : slide.img}
                alt={slide.title}
              />
              <div className="absolute top-1/3 left-6 md:left-[10%] z-10 max-w-xl text-white px-4">
                {slide.logo && (
                  <img className="h-10 mb-4" src={slide.logo} alt="logo" />
                )}
                <h1 className="text-5xl md:text-6xl font-bold leading-none" dangerouslySetInnerHTML={{ __html: slide.title }} />
                <div className="flex flex-wrap items-center gap-4 text-gray-300 mt-4 max-sm:text-lg text-sm md:text-base">
                  <span>{slide.genres}</span>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {slide.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {slide.duration}
                  </div>
                </div>
                <p className="text-gray-300 mt-4 max-sm:text-lg text-sm md:text-base">
                  {slide.description.slice(0,400) + "..."}
                </p>
                <button
                  onClick={() => navigate("/movies")}
                  className="flex items-center gap-2 text-white mt-4 bg-primary px-4 py-2 rounded-md hover:bg-accent hover:text-primary transition-colors"
                >
                  Explore <ArrowRight />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSection;
