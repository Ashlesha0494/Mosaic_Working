import * as vg from "@uwdata/vgplot";

await vg.coordinator().exec([
  `CREATE TEMP TABLE IF NOT EXISTS country_data AS
   SELECT * FROM 'https://github.com/Ashlesha0494/Mosaic_Working/blob/7bbe23fcc2c8132083b92a5ef57f86513214879a/data/Countries.parquet'`
]);

const $brush = vg.Selection.crossfilter();
const $bandwidth = vg.Param.value(0);
const $pixelSize = vg.Param.value(2);
const $scaleType = vg.Param.value("sqrt");

export default vg.hconcat(
  vg.vconcat(
    vg.plot(
      vg.raster(
        vg.from("country_data", {filterBy: $brush}),
        {
          x: "GDP",
          y: "Unemployment",
          fill: "Population",
          bandwidth: $bandwidth,
          pixelSize: $pixelSize
        }
      ),
      vg.intervalXY({pixelSize: 2, as: $brush}),
      vg.xyDomain(vg.Fixed),
      vg.colorScale($scaleType),
      vg.colorScheme("viridis"),
      vg.width(440),
      vg.height(250),
      vg.marginLeft(25),
      vg.marginTop(20),
      vg.marginRight(1)
    ),
    vg.hconcat(
      vg.plot(
        vg.rectY(
          vg.from("country_data", {filterBy: $brush}),
          {
            x: vg.bin("Education Expenditure (% GDP)"),
            y: vg.count(),
            fill: "steelblue",
            inset: 0.5
          }
        ),
        vg.intervalX({as: $brush}),
        vg.xDomain(vg.Fixed),
        vg.yScale($scaleType),
        vg.yGrid(true),
        vg.width(220),
        vg.height(120),
        vg.marginLeft(65)
      ),
      vg.plot(
        vg.rectY(
          vg.from("country_data", {filterBy: $brush}),
          {x: vg.bin("Health Expenditure (% GDP)"), y: vg.count(), fill: "steelblue", inset: 0.5}
        ),
        vg.intervalX({as: $brush}),
        vg.xDomain(vg.Fixed),
        vg.yScale($scaleType),
        vg.yGrid(true),
        vg.width(220),
        vg.height(120),
        vg.marginLeft(65)
      )
    )
  ),
  vg.hspace(10),
  vg.plot(
    vg.raster(
      vg.from("country_data", {filterBy: $brush}),
      {
        x: "GDP Per Capita",
        y: "Population Density",
        fill: "Net Trade",
        bandwidth: $bandwidth,
        pixelSize: $pixelSize
      }
    ),
    vg.intervalXY({pixelSize: 2, as: $brush}),
    vg.xyDomain(vg.Fixed),
    vg.colorScale($scaleType),
    vg.colorScheme("viridis"),
    vg.yReverse(true),
    vg.width(230),
    vg.height(370),
    vg.marginLeft(25),
    vg.marginTop(20),
    vg.marginRight(1)
  )
);
