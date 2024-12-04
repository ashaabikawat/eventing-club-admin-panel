import React from "react";
import { components } from "react-select";

const CustomMenuList = (props) => {
  const { targetValue } = props;
  const childrenArray = React.Children.toArray(props.children);
  const stickyOption = childrenArray.find(
    (child) => child.props && child.props.data && child.props.data.value === targetValue
  );

  return (
    <components.MenuList {...props}>
      {stickyOption && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
            borderBottom: "1px solid #ddd",
          }}
        >
          {stickyOption}
        </div>
      )}
      <div style={{ maxHeight: "150px", overflowY: "auto" }}>
        {childrenArray.filter(
          (child) => child.props && child.props.data && child.props.data.value !== targetValue
        )}
      </div>
    </components.MenuList>
  );
};

export default CustomMenuList;
