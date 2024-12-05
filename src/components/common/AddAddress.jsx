import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

const AddAddress = ({
  stateIsoCode,
  setStateIsoCode,
  stateName,
  setStateName,
  cityIsoCode,
  setCityIsoCode,
  cityName,
  setCityName,
}) => {
  const [stateData, setStateData] = useState([]);
  const [citydata, setCitydata] = useState([]);
  const [city, setCity] = useState("");

  const API_KEY = "TUo5UThvYmNjckE0U294WmdzeFBtZmV4RzZlMUxhUHhTaG05TURVdQ==";

  useEffect(() => {
    getallStateData();
  }, []);

  const getallStateData = async () => {
    try {
      const config = {
        headers: {
          "X-CSCAPI-KEY": API_KEY,
        },
      };

      const response = await axios.get(
        "https://api.countrystatecity.in/v1/countries/IN/states",
        config
      );

      // console.log("Countries Data:", response.data);
      setStateData(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  let stateiso2 = "";
  useEffect(() => {
    handlerChangeCity();
  }, [stateiso2]);

  let countryIso2 = "IN";
  const handlerChangeCity = async (event) => {
    // console.log("Selected _id:", event);

    stateiso2 = event.target.value;
    setStateIsoCode(stateiso2);
    console.log("iso2", stateiso2);

    try {
      const config = {
        headers: {
          "X-CSCAPI-KEY": API_KEY,
        },
      };

      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryIso2}/states/${stateiso2}/cities`,
        config
      );

      console.log(response.data);
      setCitydata(response.data);
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        const { status, data } = error.response;
        console.error(`Response error - Status: ${status}, Data:`, data);
      }
    }
  };

  const initialValues = {
    state: stateName,
    city: cityName,
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
    resetForm,
  } = useFormik({
    initialValues,
  });

  useEffect(() => {
    handlerchangecity();
  }, [citydata]);

  const handlerchangecity = async (event) => {
    const selectedIso2 = event.target.value;
    const selectedCountry = citydata.find((city) => city.id == selectedIso2);

    setCityIsoCode(selectedIso2);

    setCityName(selectedCountry ? selectedCountry.name : "", () => {});
  };

  return (
    <div className="w-[100%] flex justify-between">
      {/* <select
        id="state"
        name="state"
        //   onChange={handleChange}
        //   value={values.state}
        onChange={async (event) => {
          handlerChangeCity(event);

          const selectedIso2 = event.target.value;

          const selectedCountry = State.find(
            (country) => country.iso2 === selectedIso2
          );
          setStateName(selectedCountry ? selectedCountry.name : "");
        }}
        className="bg-gray-50 border border-gray-300 w-[32%] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="" disabled>
          India
        </option>

        <option>India</option>
      </select> */}

      <div className="w-[50%]">
        <label
          htmlFor="name"
          className="block mb-2 text-start text-sm font-medium text-gray-900 "
        >
          State
        </label>
        <select
          id="state"
          name="state"
          value={stateIsoCode}
          onChange={async (event) => {
            handlerChangeCity(event);
            const selectedIso2 = event.target.value;
            const selectedCountry = stateData.find(
              (country) => country.iso2 === selectedIso2
            );
            setStateName(selectedCountry ? selectedCountry.name : "");
          }}
          className="bg-gray-50 border border-gray-300 w-[97%] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
        >
          <option value="" disabled>
            Select State
          </option>
          {stateData?.map((state) => (
            <option key={state.id} value={state.iso2}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-[48%] ">
        <label
          htmlFor="name"
          className="block mb-2 text-start text-sm font-medium text-gray-900 
          "
        >
          City
        </label>
        <select
          id="city"
          name="city"
          onChange={async (event) => {
            handlerchangecity(event);
          }}
          // value={values.city}
          className="bg-gray-50 flex justify-end items-end border w-[100%] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500   p-2.5 "
        >
          <option value="" disabled>
            Select City
          </option>
          {citydata?.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddAddress;
