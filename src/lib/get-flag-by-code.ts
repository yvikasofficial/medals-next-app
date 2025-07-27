const FLAG_HEIGHT = 17;
const FLAG_WIDTH = 28;

const flagOrder = [
  "AUT",
  "BLR",
  "CAN",
  "CHN",
  "FRA",
  "GER",
  "ITA",
  "NED",
  "NOR",
  "RUS",
  "SUI",
  "SWE",
  "USA",
];

export function getFlagByCode(code: string): React.CSSProperties {
  const index = flagOrder.indexOf(code.toUpperCase());
  if (index === -1) return {};

  return {
    width: `${FLAG_WIDTH}px`,
    height: `${FLAG_HEIGHT}px`,
    backgroundImage: "url('/assets/flags.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `0 -${index * FLAG_HEIGHT}px`,
  };
}
