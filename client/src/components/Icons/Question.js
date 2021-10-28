function SvgComponent({ color }) {
  return (
    <svg
      height={21}
      viewBox="0 0 21 21"
      width={21}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fillRule="evenodd" transform="translate(2 2)">
        <circle
          cx={8.5}
          cy={8.5}
          r={8}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 9.5v-1l1.414-1.414a2 2 0 00.586-1.414V5.5c0-.613-.346-1.173-.894-1.447l-.212-.106a2 2 0 00-1.788 0L7.5 4c-.613.306-1 .933-1 1.618V6.5"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={8.5} cy={12.5} fill={color} r={1} />
      </g>
    </svg>
  );
}

export default SvgComponent;
