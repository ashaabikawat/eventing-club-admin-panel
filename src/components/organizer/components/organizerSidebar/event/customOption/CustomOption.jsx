import React from "react";

const CustomOption = (props) => {
  const { data, innerRef, innerProps, targetValue } = props;
  
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        backgroundColor: data?.value === targetValue ? "#f0f0f0" : "white",
        fontWeight: data?.value === targetValue ? "bold" : "normal",
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        cursor:"pointer"
      }}
    >
      {data?.value === targetValue && (
        <span style={{ marginRight: 8, color: "#ff6347" }}>+</span>
      )}
      {data.label}
    </div>
  );
};

export default CustomOption;
