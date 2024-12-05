import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";

const EditAddress = ({
  StateIsoCode,
  CityIsoCode,
  setStateIsoCode,
  setStateName,
  setCityIsoCode,
  setCityName,
}) => {
  const [State, setState] = useState([]);
  const [citydata, setCitydata] = useState([]);

  const API_KEY = "Mk5hNW5Tb1lZSEhITDg2eTVhMUxhbm5mYjBEbGRER3U4ZHFENXdRQQ==";

  useEffect(() => {
    const getAllStateDataByCountry = async () => {
      try {
        const config = {
          headers: {
            "X-CSCAPI-KEY": API_KEY,
          },
        };

        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states`,
          config
        );

        setState(response.data);

        await getallcityByStateAndCountry();
      } catch (error) {
        console.error("Error:", error);

        if (error.response) {
          const { status, data } = error.response;
          console.error(`Response error - Status: ${status}, Data:`, data);
        }
      }
    };

    const getallcityByStateAndCountry = async () => {
      try {
        const config = {
          headers: {
            "X-CSCAPI-KEY": API_KEY,
          },
        };

        const response = await axios.get(
          `https://api.countrystatecity.in/v1/countries/IN/states/${StateIsoCode}/cities`,
          config
        );

        setCitydata(response.data);
      } catch (error) {
        console.error("Error:", error);

        if (error.response) {
          const { status, data } = error.response;
          console.error(`Response error - Status: ${status}, Data:`, data);
        }
      }
    };
    getAllStateDataByCountry();
  }, [StateIsoCode]);

  let stateiso2 = "";
  const handlerChangeCity = async (event) => {
    // console.log("Selected _id:", event);

    stateiso2 = event.target.value;
    // console.log("iso2", stateiso2);
    setStateIsoCode(stateiso2);

    try {
      const config = {
        headers: {
          "X-CSCAPI-KEY": API_KEY,
        },
      };

      const response = await axios.get(
        `https://api.countrystatecity.in/v1/countries/IN/states/${stateiso2}/cities`,
        config
      );

      setCitydata(response.data);
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        const { status, data } = error.response;
        console.error(`Response error - Status: ${status}, Data:`, data);
      }
    }
  };

  const handlerSelectCityAfterChange = (event) => {
    const selectedCityId = event.target.value;
    const selectedCity = citydata.find((city) => city.id == selectedCityId);
    setCityIsoCode(selectedCity.id);
    setCityName(selectedCity.name);

    // console.log( "selectedCity " , selectedCity)
  };

  const initialValues = {};

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
    // validationSchema: addAddressObject,
    onSubmit: async (values) => {
      console.log("Payload ==> ", palyload);
    },
  });

  return (
    <div className="w-[100%] flex">
      <form className="w-[100%] flex">
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
            value={values.state}
            onChange={async (event) => {
              handlerChangeCity(event);

              const selectedIso2 = event.target.value;

              const selectedCountry = State.find(
                (country) => country.iso2 === selectedIso2
              );
              setStateName(selectedCountry ? selectedCountry.name : "");
            }}
            className="bg-gray-50 border border-gray-300 w-[97%] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
          >
            <option value="" disabled>
              Select State
            </option>
            {StateIsoCode && (
              <option key={StateIsoCode} value={StateIsoCode}>
                {State.find((state) => state.iso2 === StateIsoCode)?.name}
              </option>
            )}
            {State?.filter((state) => state.iso2 !== StateIsoCode).map(
              (state) => (
                <option key={state.id} value={state.iso2}>
                  {state.name}
                </option>
              )
            )}
          </select>
        </div>
        {/* City Selection */}
        <div className="w-[48%]">
          <label
            htmlFor="name"
            className="block mb-2  ml-[5%] text-start text-sm font-medium text-gray-900 "
          >
            City
          </label>
          <select
            id="city"
            name="city"
            onChange={(event) => handlerSelectCityAfterChange(event)}
            value={values.city}
            className="bg-gray-50 border ml-4 border-gray-300 flex justify-end items-end w-[100%] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 "
          >
            <option value="" disabled>
              Select City
            </option>
            {CityIsoCode && citydata.find((city) => city.id == CityIsoCode) && (
              <option key={CityIsoCode} value={CityIsoCode}>
                {citydata.find((city) => city.id == CityIsoCode)?.name}
              </option>
            )}
            {citydata
              ?.filter((city) => city.id != CityIsoCode)
              .map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
          </select>
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
