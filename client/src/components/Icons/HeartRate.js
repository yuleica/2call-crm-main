function SvgComponent({ color }) {
  return (
    <svg
      height={21}
      viewBox="0 0 21 21"
      width={21}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10.5h2l2.5-6 2 12 3-9 2.095 6 1.405-3h2"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SvgComponent;
