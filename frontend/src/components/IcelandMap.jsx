import { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function IcelandMap() {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;
    async function init() {
      const svg = await fetch("/Map_of_Iceland.svg").then((r) => r.text());
      echarts.registerMap("iceland_svg", { svg });

      const option = {
        tooltip: {},
        geo: {
          tooltip: { show: true },
          map: "iceland_svg",
          roam: true,
        },
        series: {
          type: "effectScatter",
          coordinateSystem: "geo",
          geoIndex: 0,
          symbolSize: (params) => (params[2] / 100) * 15 + 5,
          itemStyle: { color: "#b02a02" },
          encode: { tooltip: 2 },
          data: [
            [488.2358421078053, 459.70913833075736, 100],
            [770.3415644319939, 757.9672194986475, 30],
            [1180.0329284196291, 743.6141808346214, 80],
            [894.03790632245, 1188.1985153835008, 61],
            [1372.98925630313, 477.3839988649537, 70],
            [1378.62251255796, 935.6708486282843, 81],
          ],
        },
      };

      chart = echarts.init(chartRef.current);
      chart.setOption(option);

      chart.getZr().on("click", (params) => {
        const pixelPoint = [params.offsetX, params.offsetY];
        const dataPoint = chart.convertFromPixel({ geoIndex: 0 }, pixelPoint);
        /* eslint-disable-next-line no-console */
        console.log(dataPoint);
      });
    }

    init();
    return () => {
      chart && chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ height: "250px", width: "35%" }} />;
}