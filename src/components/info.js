import { useUIState } from "../contexts/buttonContext";

import Button from "./controls/button";

function StaticDemo() {
  const {
    activeVisualization,
    xButtonState,
    selectNewX,
    yButtonState,
    selectNewY,
    clearSelectionY,
    clearSelectionX,
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

      <div>
        <div>Y-Axis</div>
        <Button
          onClick1={() => selectNewY("ethnicity")}
          onClick2={() => clearSelectionY()}
          active={yButtonState.ethnicity.selected}
          enabled={yButtonState.ethnicity.enabled}
        >
          Ethnicity
        </Button>
        <Button
          onClick1={() => selectNewY("compensation")}
          onClick2={() => clearSelectionY()}
          active={yButtonState.compensation.selected}
          enabled={yButtonState.compensation.enabled}
        >
          Compensation
        </Button>
        <Button
          onClick1={() => selectNewY("median")}
          onClick2={() => clearSelectionY()}
          active={yButtonState.median.selected}
          enabled={yButtonState.median.enabled}
        >
          Median Compensation
        </Button>
        <Button
          onClick1={() => selectNewY("icpm")}
          onClick2={() => clearSelectionY()}
          active={yButtonState.icpm.selected}
          enabled={yButtonState.icpm.enabled}
        >
          IC/PM
        </Button>
      </div>
      <div>
        <div>X-Axis</div>
        <Button
          onClick1={() => selectNewX("age")}
          onClick2={() => clearSelectionX()}
          active={xButtonState.age.selected}
          enabled={xButtonState.age.enabled}
        >
          Age
        </Button>
        <Button
          onClick1={() => selectNewX("compensation")}
          onClick2={() => clearSelectionX()}
          active={xButtonState.compensation.selected}
          enabled={xButtonState.compensation.enabled}
        >
          Compensation
        </Button>
        <Button
          onClick1={() => selectNewX("experience")}
          onClick2={() => clearSelectionX()}
          active={xButtonState.experience.selected}
          enabled={xButtonState.experience.enabled}
        >
          Experience
        </Button>
        <Button
          onClick1={() => selectNewX("gender")}
          onClick2={() => clearSelectionX()}
          active={xButtonState.gender.selected}
          enabled={xButtonState.gender.enabled}
        >
          Gender
        </Button>
        <Button
          onClick1={() => selectNewX("icpm")}
          onClick2={() => clearSelectionX()}
          active={xButtonState.icpm.selected}
          enabled={xButtonState.icpm.enabled}
        >
          IC/PM
        </Button>
        <Button
          onClick1={() => selectNewX("median")}
          onClick2={() => clearSelectionX()}
          active={xButtonState.median.selected}
          enabled={xButtonState.median.enabled}
        >
          Median Compensation
        </Button>
        <Button
          onClick1={() => selectNewX("remote")}
          onClick2={() => clearSelectionX()}
          active={xButtonState.remote.selected}
          enabled={xButtonState.remote.enabled}
        >
          Remote Work
        </Button>
      </div>
    </div>
  );
}

export default StaticDemo;
