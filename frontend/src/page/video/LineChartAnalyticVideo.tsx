import { Line, LineChart } from "recharts";

interface LineChartProps {
  isAnimationActive: boolean;
  type: string;
  color: string;
}

const LineChartAnalyticVideo = ({
  isAnimationActive = true,
  type,
  color,
}: LineChartProps) => {
  const data = [
    {
      fr: 2210,
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      fr: 4000,
      uv: 3000,
      pv: 1398,
      amt: 4800,
    },
    {
      fr: 3000,
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      fr: 1890,
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      fr: 2000,
      uv: 1890,
      pv: 4800,
      amt: 3908,
    },
    {
      fr: 4800,
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      fr: 9800,
      uv: 3490,
      pv: 4300,
      amt: 3908,
    },
  ];

  return (
    <LineChart
      style={{
        width: "100%",
        maxHeight: "10vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <Line
        type="monotone"
        dataKey={`${type === "views" ? "fr" : type === "subscriptions" ? "uv" : type === "durations" ? "pv" : "amt"}`}
        stroke={color}
        isAnimationActive={isAnimationActive}
      />
    </LineChart>
  );
};

export default LineChartAnalyticVideo;
