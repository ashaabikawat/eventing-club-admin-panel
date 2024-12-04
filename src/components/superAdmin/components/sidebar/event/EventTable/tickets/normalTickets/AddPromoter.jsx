import React, { useEffect, useState } from "react";
import Select from "react-select";

const AddPromoter = ({
  promoterData,
  allPromoterDatas,
  onpromoter,
  setLoading,
}) => {
  console.log({ promoterData });

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allPromoterData, setAllPromoterData] = useState([]);
  const [allSelectionDataSetModal, setSelectionDataSetModal] = useState(true);
  const [selectedOptionFlage , setSelectedOptionFlage] = useState(false);

  useEffect(() => {
    if (allPromoterDatas.length > 0 ) {
      handlerSelectedPromoter(allPromoterDatas);
      
    }
  }, [allPromoterDatas]);

  const handlerchangetwo = (promoterData) => {
    const allPromoterData = promoterData.map((option) => ({
      value: option._id,
      label: option.FullName,
    }));
    setAllPromoterData(allPromoterData);
    setSelectionDataSetModal(false);
    setLoading(false);
  }

    const handlerSelectedPromoter = (allPromoterDatas) => {
    // Extract the selected IDs
    const selectedIds = promoterData.map((option) => option._id);

    // Check which selected IDs exist in apiAllPromoterData
    const matchedOptions = [];

    promoterData.forEach((options) => {
      const organizer = allPromoterDatas.find(
        (org) => org._id === options.promoter_id
      );
      if (organizer) {
        matchedOptions.push({
          value: organizer._id,
          label: organizer.FullName,
        });
      }
    });

    console.log({ matchedOptions });

    // Update state with matched options
    setSelectedOptions(matchedOptions);
    onpromoter(matchedOptions);

    // Filter out matched options from apiAllPromoterData
    const updatedAllPromoterData = allPromoterDatas
      .filter((organizer) => !selectedIds.includes(organizer._id))
      .map((organizer) => ({
        value: organizer._id,
        label: organizer.FullName,
      }));

    console.log(updatedAllPromoterData);
    setAllPromoterData(updatedAllPromoterData);
    setSelectionDataSetModal(false);
    setLoading(false);
  };

  
  const handleSelectChangePromoter = (selected) => {
    setSelectedOptions(selected);
    console.log({ selected });
    onpromoter(selected);
  };

  return (
    <div>
      {!allSelectionDataSetModal && (
        <div className="mt-3">
          <p className="text-black font-semibold text-lg mb-1">Add Promoter</p>
          <Select
            isMulti
            name="promoters"
            options={allPromoterData}
            className="basic-multi-select bg-Gray40"
            classNamePrefix="select promoter"
            onChange={handleSelectChangePromoter}
            value={selectedOptions}
          />
        </div>
      )}
    </div>
  );
};

export default AddPromoter;
