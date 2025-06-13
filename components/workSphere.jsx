import React from "react";

function WorkSphereLogo({ fillColor = "#000" }) {
  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Icon Part - Globe with briefcase */}
      <g fill={fillColor}>
        <circle cx="20" cy="20" r="18" stroke={fillColor} strokeWidth="2" fill="none" />
        <rect x="13" y="15" width="14" height="10" rx="2" />
        <rect x="17" y="12" width="6" height="4" rx="1" />
      </g>

      {/* Text Part - Stylized "WorkSphere" */}
      <g fill={fillColor} transform="translate(45, 12)" fontSize="12" fontFamily="Verdana, sans-serif">
        <text x="0" y="10" fontWeight="bold" letterSpacing="1">WORK</text>
        <text x="0" y="25" fontWeight="normal" letterSpacing="1">SPHERE</text>
      </g>
    </svg>
  );
}

export default WorkSphereLogo;
