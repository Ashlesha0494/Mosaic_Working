import * as vg from "@uwdata/vgplot";

await vg.coordinator().exec([
  vg.loadParquet("country_data", "data/Countries.parquet")
]);

const $bandwidth = vg.Param.value(40);
const $thresholds = vg.Param.value(10);

export default vg.vconcat(
  vg.hconcat(
    vg.slider({label: "Bandwidth (σ)", as: $bandwidth, min: 1, max: 100}),
    vg.slider({label: "Thresholds", as: $thresholds, min: 2, max: 20})
  ),
  vg.plot(
    vg.rectY(
      vg.from("country_data"),
      { x: vg.bin("GDP"), y: vg.count(), fill: "steelblue", inset: 0.5 }
    ),
    vg.intervalX({ as: $bandwidth }),
    vg.xDomain(vg.Fixed),
    vg.yTickFormat("s"),
    vg.width(700),
    vg.height(480),
    vg.margins({ top: 5, bottom: 30, left: 5, right: 50 })
  )
);
