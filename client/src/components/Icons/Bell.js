function SvgComponent({ color }) {
  return (
    <svg
      height={21}
      viewBox="0 0 21 21"
      width={21}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15.585 15.5H5.415A1.65 1.65 0 014 13a10.526 10.526 0 001.5-5.415V6.5a4 4 0 014-4h2a4 4 0 014 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 01-1.415 2.5zM17.5 4.5c-.267-.934-.6-1.6-1-2-.4-.4-1.067-.733-2-1M3.588 4.5c.208-.933.512-1.6.912-2 .4-.4 1.095-.732 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17" />
      </g>
    </svg>
  );
}

export default SvgComponent;
