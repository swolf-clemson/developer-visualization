import React, { useState, useEffect, useContext, createContext } from "react";

const UIContext = createContext();

// Wrap your app with <ProvideRemoteContext />
export function ProvideUIContext({ children }) {
  const UIState = useRemoteContext();
  return <UIContext.Provider value={UIState}>{children}</UIContext.Provider>;
}

export const useUIState = () => useContext(UIContext);

// Here's the actual context object (shared across all views)
function useRemoteContext() {
  const imgList = {
    default: "mrrock.gif",
    age_median: "age_vs_median_comp.png",
    compensation_ethnicity: "ethnicity_vs_comp.png",
    median_ethnicity: "ethnicity_vs_median_comp.png",
    experience_median: "exp_vs_comp.png",
    gender_compensation: "gender_vs_comp_items.png",
    gender_median: "gender_vs_comp.png",
    gender_icpm: "gender_vs_icpm.png",
    icpm_median: "icpm_vs_comp.png",
    remote_median: "remote_vs_comp.png",
  };

  const validY2XCombos = {
    ethnicity: ["median", "compensation"],
    compensation: ["gender"],
    median: ["age", "experience", "gender", "remote", "icpm"],
    icpm: ["gender"],
  };

  const validX2YCombos = {
    age: ["median"],
    compensation: ["ethnicity"],
    experience: ["median"],
    gender: ["compensation", "median", "icpm"],
    icpm: ["median"],
    median: ["ethnicity"],
    remote: ["median"],
  };

  const [yButtonState, setYButtonState] = useState({
    ethnicity: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    compensation: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    median: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    icpm: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
  });

  const [xButtonState, setXButtonState] = useState({
    age: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    compensation: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    experience: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    gender: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    icpm: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    median: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
    remote: {
      label: "lmao",
      enabled: true,
      selected: false,
    },
  });

  const [activeVisualization, setActiveVisualization] = useState(
    imgList.default
  );

  function clearSelectionX() {
    var tempState = JSON.parse(JSON.stringify(xButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((xKey) => {
      tempState[xKey].selected = false;
    });
    setXButtonState(tempState);
    var tempState = JSON.parse(JSON.stringify(yButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((yKey) => {
      tempState[yKey].enabled = true;
    });
    setYButtonState(tempState);
    setActiveVisualization(imgList.default);
  }

  function selectNewX(newX) {
    var tempState = JSON.parse(JSON.stringify(xButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((xKey) => {
      tempState[xKey].selected = false;
    });

    tempState[newX].selected = true;

    setXButtonState(tempState);

    var tempState = JSON.parse(JSON.stringify(yButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((yKey) => {
      if (validX2YCombos[newX].includes(yKey)) {
        tempState[yKey].enabled = true;
      } else {
        tempState[yKey].enabled = false;
      }
      if (tempState[yKey].selected) {
        setActiveVisualization(imgList[newX + "_" + yKey]);
      }
    });

    setYButtonState(tempState);
  }

  function clearSelectionY() {
    var tempState = JSON.parse(JSON.stringify(yButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((yKey) => {
      tempState[yKey].selected = false;
    });
    setYButtonState(tempState);
    var tempState = JSON.parse(JSON.stringify(xButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((xKey) => {
      tempState[xKey].enabled = true;
    });
    setXButtonState(tempState);
    setActiveVisualization(imgList.default);
  }

  function selectNewY(newY) {
    var tempState = JSON.parse(JSON.stringify(yButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((yKey) => {
      tempState[yKey].selected = false;
    });

    tempState[newY].selected = true;

    setYButtonState(tempState);

    // if there is an X already set to selected == true, show the image

    var tempState = JSON.parse(JSON.stringify(xButtonState)); // This is a hack to quickly copy an item lol

    Object.keys(tempState).forEach((xKey) => {
      if (validY2XCombos[newY].includes(xKey)) {
        tempState[xKey].enabled = true;
      } else {
        tempState[xKey].enabled = false;
      }
      if (tempState[xKey].selected) {
        setActiveVisualization(imgList[xKey + "_" + newY]);
      }
    });

    setXButtonState(tempState);
  }

  useEffect(() => {}, []);
  return {
    activeVisualization,
    xButtonState,
    yButtonState,

    setActiveVisualization,
    setXButtonState,
    setYButtonState,

    selectNewX,
    selectNewY,

    clearSelectionX,
    clearSelectionY,
  };
}
