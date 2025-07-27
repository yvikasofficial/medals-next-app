import { getFlagByCode } from "@/lib/get-flag-by-code";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div style={getFlagByCode("AUT")} />
      <div style={getFlagByCode("BLR")} />
      <div style={getFlagByCode("CAN")} />
      <div style={getFlagByCode("CHN")} />
      <div style={getFlagByCode("FRA")} />
      <div style={getFlagByCode("GER")} />
      <div style={getFlagByCode("ITA")} />
      <div style={getFlagByCode("NED")} />
      <div style={getFlagByCode("NOR")} />
      <div style={getFlagByCode("RUS")} />
      <div style={getFlagByCode("SUI")} />
      <div style={getFlagByCode("SWE")} />
      <div style={getFlagByCode("USA")} />
    </div>
  );
}
