import { Link } from "react-router-dom";

function Button({ to, children }) {
  return (
    <Link to={to} className="rounded shadow flex-none flex-grow-0 bg-slate-100 p-1 m-1">
      {children}
    </Link>
  );
}

export default Button;
