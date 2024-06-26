import { Spec } from '@uwdata/mosaic-spec';

export const spec : Spec = {
  "meta": {
    "title": "Earthquakes Globe",
    "description": "A rotatable globe of earthquake activity. To show land masses, this example loads and parses TopoJSON data in the database. Requires the DuckDB `spatial` extension.\n",
    "credit": "Adapted from an [Observable Plot example](https://observablehq.com/@observablehq/plot-earthquake-globe)."
  },
  "data": {
    "earthquakes": {
      "file": "data/earthquakes.parquet"
    },
    "land": {
      "type": "spatial",
      "file": "data/countries-110m.json",
      "layer": "land"
    }
  },
  "params": {
    "longitude": -180,
    "latitude": -30,
    "rotate": [
      "$longitude",
      "$latitude"
    ]
  },
  "vconcat": [
    {
      "hconcat": [
        {
          "input": "slider",
          "label": "Longitude",
          "as": "$longitude",
          "min": -180,
          "max": 180,
          "step": 1
        },
        {
          "input": "slider",
          "label": "Latitude",
          "as": "$latitude",
          "min": -90,
          "max": 90,
          "step": 1
        }
      ]
    },
    {
      "plot": [
        {
          "mark": "geo",
          "data": {
            "from": "land"
          },
          "geometry": {
            "geojson": "geom"
          },
          "fill": "currentColor",
          "fillOpacity": 0.2
        },
        {
          "mark": "sphere"
        },
        {
          "mark": "dot",
          "data": {
            "from": "earthquakes"
          },
          "x": "longitude",
          "y": "latitude",
          "r": {
            "sql": "POW(10, magnitude)"
          },
          "stroke": "red",
          "fill": "red",
          "fillOpacity": 0.2
        }
      ],
      "margin": 10,
      "style": "overflow: visible;",
      "projectionType": "orthographic",
      "projectionRotate": "$rotate"
    }
  ]
};
