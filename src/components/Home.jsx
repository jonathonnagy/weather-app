import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mainLogo from "../images/Weather-PNG.png";

const Home = () => {
  const navigate = useNavigate();
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      cityList.includes(city.charAt(0).toUpperCase() + city.slice(1))
    ) {
      setError("This city already exists in your list! Try another one...");
    }
    if (cityList.length === 10 && event.key === "Enter") {
      setError("Your list can only contain 10 cities!");
      setCity("");
    }
    if (
      event.key === "Enter" &&
      !cityList.includes(city.charAt(0).toUpperCase() + city.slice(1)) &&
      cityList.length < 10 &&
      city.length > 0
    ) {
      setCityList([...cityList, city.charAt(0).toUpperCase() + city.slice(1)]);
      setCity("");
      setError("");
    }
  };

  useEffect(() => {
    const localStorageItems = JSON.parse(localStorage.getItem("Cities"));
    if (localStorageItems) {
      setCityList((current) => [...current, ...localStorageItems]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Cities", JSON.stringify(cityList));
  }, [cityList]);

  console.log(cityList);

  return (
    <div className="w-full h-[100%] sm:h-screen bg-slate-500 flex items-center flex-col">
      <h1 className="text-3xl font-bold">Weather App</h1>
      <img src={mainLogo} alt="" className="w-60" />
      <input
        className="w-auto rounded-full py-3 px-6 mt-10"
        type="text"
        placeholder="Search for a city..."
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
          setError("");
        }}
        onKeyDown={handleKeyDown}
      />

      {error && (
        <div
          className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 mt-5"
          role="alert"
        >
          <svg
            className="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
          </svg>
          <p>{error}.</p>
        </div>
      )}

      <div className="w-[300px] md:w-[600px] mt-8 sm:mt-20 bg-gray-400 rounded-xl p-5 ">
        <p className="text-center font-bold underline text-md">
          Your favorite Cities:
        </p>
        <ol className="flex flex-wrap justify-center items-center">
          {cityList.length === 0 ? (
            <p className="p-5 text-xl">No cities picked yet!</p>
          ) : (
            cityList.map((city) => (
              <div
                key={city}
                className="m-3 px-5 py-3 flex justify-between bg-slate-300 rounded-md"
              >
                <li
                  key={city}
                  className="cursor-pointer mx-5"
                  onClick={() => navigate(`city/${city}`)}
                >
                  {city}
                </li>
                <div className="flex">
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() =>
                      setCityList(cityList.filter((e) => e !== city))
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))
          )}
        </ol>
      </div>
    </div>
  );
};

export default Home;
