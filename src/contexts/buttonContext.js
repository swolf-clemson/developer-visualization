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
    age_vs_median_comp: "age_vs_median_comp.png",
    ethnicity_vs_comp: "ethnicity_vs_comp.png",
    ethnicity_vs_median_comp: "ethnicity_vs_median_comp.png",
    exp_vs_comp: "exp_vs_comp.png",
    gender_vs_comp_items: "gender_vs_comp_items.png",
    gender_vs_icpm: "gender_vs_icpm.png",
    icpm_vs_comp: "icpm_vs_comp.png",
    remote_vs_comp: "remote_vs_comp.png",
  };

  const [xButtonState, setXButtonState] = useState({
    ethnicity: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
    compensation: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
    median: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
    icpm: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
  });
  const [yButtonState, setYButtonState] = useState({
    age: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
    ethnicity: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
    experience: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
    gender: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
    icpm: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
    remote: {
      label: "lmao",
      enabled: false,
      selected: false,
    },
  });
  const [activeVisualization, setActiveVisualization] = useState(imgList.age_vs_median_comp);

  function clearSelectionX() {
    var tempState = JSON.parse(JSON.stringify(xButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((xKey) => {
      tempState[xKey].selected = false;
    });
    setXButtonState(tempState);
  }

  function selectNewX(newX) {
    var tempState = JSON.parse(JSON.stringify(xButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((xKey) => {
      tempState[xKey].selected = false;
    });

    tempState[newX].selected = true;

    setXButtonState(tempState);
  }

  function clearSelectionY() {
    var tempState = JSON.parse(JSON.stringify(yButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((yKey) => {
      tempState[yKey].selected = false;
    });
    setXButtonState(tempState);
  }

  function selectNewY(newY) {
    var tempState = JSON.parse(JSON.stringify(yButtonState)); // This is a hack to quickly copy an item lol
    Object.keys(tempState).forEach((yKey) => {
      tempState[yKey].selected = false;
    });

    tempState[newY].selected = true;

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
    clearSelectionY
  };
}
