import { Link } from "react-router-dom";

function Button({ to, onClick, active, children }) {
  if (!to) {
    return (
      <button
        onClick={onClick}
        className={`rounded shadow flex-none flex-grow-0 ${
          active ? "bg-slate-500" : "bg-slate-100"
        } p-1 m-1`}
      >
        {children}
      </button>
    );
  } else {
    return (
      <Link
        to={to}
        className="rounded shadow flex-none flex-grow-0 bg-slate-100 p-1 m-1"
      >
        {children}
      </Link>
    );
  }
}

export default Button;
