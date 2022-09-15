const TypeArrayIcon = props => (
   <svg version="1.1" width="35" height="35" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <g>
         <rect x=".30877" y="10.309" width="39.382" height="39.382" fill={props.secondary} />
         <rect x="5" y="5" width="39.382" height="39.382" fill={props.primary} />
         <g stroke={props.secondary} strokeWidth="0">
            <rect x="8.2288" y="8.8174" width="33.121" height="7.0517" fill={props.tertiary} />
            <rect x="8.2288" y="33.504" width="33.121" height="7.0517" fill={props.tertiary} />
            <rect x="8.2288" y="21.044" width="33.121" height="7.0517" fill={props.tertiary} />
         </g>
         <text x="15.026048" y="34.561096" fill={props.color || "white"} fontFamily="sans-serif" fontSize="34.351px" strokeWidth=".85878"><tspan x="15.026048" y="34.561096" fill={props.color || "black"} fontFamily="Consolas" strokeWidth=".85878">{props.char}</tspan></text>
      </g>
   </svg>
);

export default TypeArrayIcon;