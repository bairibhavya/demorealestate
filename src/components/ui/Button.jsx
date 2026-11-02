import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`fd-button fd-button--${variant} fd-button--${size} ${
        fullWidth ? "fd-button--full" : ""
      } ${loading ? "fd-button--loading" : ""}`}
    >
      {loading ? (
        <span className="loader"></span>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}