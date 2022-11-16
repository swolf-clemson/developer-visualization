import { Link } from "react-router-dom";

function Button({ to, onClick1, onClick2, active, enabled, children }) {
  if (!to) {
    return (
      <button
        onClick={enabled ? (active ? onClick2 : onClick1) : null} // idk if this is right
        className={`rounded shadow flex-none flex-grow-0 ${
          active ? "bg-teal-200" : enabled ? "bg-slate-100" : "bg-slate-500"
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
