
import logo from "../assets/logo.png";

type LogoProps = {
  size?: number; // optional size
};

export default function Logo({ size = 200 }: LogoProps) {
  return (
    <div style={styles.logoContainer}>
      <img
        src={logo}
        alt="Todo Logo"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          cursor: "pointer"
        }}
      />
    </div>
  );
}

const styles = {
  logoContainer: {
    position: "fixed" as const,
    top: "15px",
    right: "15px",
    zIndex: 1000
  }
};