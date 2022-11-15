import { useUIState } from "../contexts/buttonContext";

import Button from "./controls/button";

function StaticDemo() {
  const {
    activeVisualization,
    xButtonState,
    selectNewX,
    setActiveVisualization,
  } = useUIState();

  return (
    <div>
      <div className="h-4/5 w-4/5 aspect-square">
        <img
          src={activeVisualization}
          className="object-scale-down h-3/5 w-3/5"
          alt="no"
        />
      </div>

      <Button onClick={() => setActiveVisualization("age_vs_median_comp.png")}>
        AvMC
      </Button>
      <Button onClick={() => setActiveVisualization("ethnicity_vs_comp.png")}>
        EvC
      </Button>

      <div>
        <Button
          onClick={() => selectNewX("ethnicity")}
          active={xButtonState.ethnicity.selected}
        >
          Ethnicity
        </Button>
        <Button
          onClick={() => selectNewX("compensation")}
          active={xButtonState.compensation.selected}
        >
          Compensation
        </Button>
        <Button
          onClick={() => selectNewX("median")}
          active={xButtonState.median.selected}
        >
          Median
        </Button>
        <Button
          onClick={() => selectNewX("icpm")}
          active={xButtonState.icpm.selected}
        >
          IC/PM
        </Button>
      </div>
      <div>
        <Button>Age</Button>
        <Button>Ethnicity</Button>
        <Button>Experience</Button>
        <Button>Gender</Button>
        <Button>IC/PM</Button>
        <Button>Remote Work</Button>
      </div>
    </div>
  );
}

export default StaticDemo;
