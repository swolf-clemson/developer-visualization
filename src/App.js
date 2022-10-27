import { Outlet } from "react-router-dom";
import Button from "./components/controls/button";

function App() {
  return (
    <div className="App">
      <div className="w-screen h-screen flex flex-col">
        <div className="h-16 bg-slate-400 justify-center content-center flex flex-row">
          <div className="w-full h-full content-center justify-center">
            <p className="text-start">Header</p>
          </div>
          <div className="w-full h-full content-end justify-center">
            <Button to={`/`}>Home</Button>
            <Button to={`/vis`}>Vis Link</Button>
            <Button to={`/info`}>COOL</Button>
          </div>
        </div>
        <div className="h-full bg-slate-500">
          <div className="bg-slate-100 h-4/5 m-4 p-4 rounded shadow">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
