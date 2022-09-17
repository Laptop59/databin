const TypeIcon = props => (
   <svg version="1.1" width="35" height="35" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <g>
         <rect x=".30877" y="10.309" width="39.382" height="39.382" fill={props.secondary} />
         <rect x="5" y="5" width="39.382" height="39.382" fill={props.primary} />
         <text textAnchor="middle"x="23.526048" y="34.561096" fill={props.color || "white"} fontFamily="sans-serif" fontSize="34.351px" strokeWidth=".85878"><tspan x="23.526048" y="34.561096" fill={props.color || "white"} fontFamily="Consolas" strokeWidth=".85878">{props.char}</tspan></text>
      </g>
   </svg>
);

export default TypeIcon;