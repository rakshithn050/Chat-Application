import React from "react";

const Loader = () => {
  const loaderStyle = {
    width: "60px",
    height: "40px",
    position: "relative",
    display: "inline-block",
  };

  const circleStyle = {
    position: "absolute",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#FFF",
    background: `
      radial-gradient(circle 8px at 18px 18px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 18px 0px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 0px 18px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 36px 18px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 18px 36px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 30px 5px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 30px 5px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 30px 30px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 5px 30px, #263238 100%, transparent 0),
      radial-gradient(circle 4px at 5px 5px, #263238 100%, transparent 0)
    `,
    backgroundRepeat: "no-repeat",
    boxSizing: "border-box",
    animation: "rotationBack 3s linear infinite",
  };

  const dotStyle = {
    position: "absolute",
    left: "35px",
    top: "15px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#FFF",
    background: `
      radial-gradient(circle 5px at 12px 12px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 12px 0px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 0px 12px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 24px 12px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 12px 24px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 20px 3px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 20px 3px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 20px 20px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 3px 20px, #263238 100%, transparent 0),
      radial-gradient(circle 2.5px at 3px 3px, #263238 100%, transparent 0)
    `,
    backgroundRepeat: "no-repeat",
    boxSizing: "border-box",
    animation: "rotationBack 4s linear infinite reverse",
  };

  const keyframes = `
    @keyframes rotationBack {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(-360deg);
      }
    }
  `;

  return (
    <div style={loaderStyle}>
      <div style={{ ...circleStyle, animationName: "rotationBack" }}></div>
      <div style={{ ...dotStyle, animationName: "rotationBack" }}></div>
      <style>{keyframes}</style>
    </div>
  );
};

export default Loader;
