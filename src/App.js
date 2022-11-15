import { Outlet } from "react-router-dom";
import Button from "./components/controls/button";
import { ProvideUIContext } from "./contexts/buttonContext";

function App() {
  return (
    <ProvideUIContext>
      <div className="App">
        <div className="w-screen h-screen flex flex-col">
          <div className="h-16 bg-slate-400 justify-center content-center flex flex-row">
            <div className="w-full h-full flex items-center justify-start">
              <p className="text-center bg-slate-100 rounded shadow p-2 m-2">
                Stephen and Danny's Really Cool Graphs
              </p>
            </div>
            <div className="w-full h-full flex items-center justify-end p-2">
              <Button to={`/`}>Home</Button>
              <Button to={`/vis`}>D3 Visualization</Button>
              <Button to={`/info`}>About</Button>
            </div>
          </div>
          <div className="h-full w-full bg-slate-500 flex justify-center content-center">
            <div className="bg-slate-100 h-6/7 w-full m-12 p-4 rounded shadow flex">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </ProvideUIContext>
  );
}

export default App;
