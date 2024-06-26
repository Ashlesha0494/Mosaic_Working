import { Spec } from '@uwdata/mosaic-spec';

export const spec : Spec = {
  "meta": {
    "title": "Olympic Athletes",
    "description": "An interactive dashboard of athlete statistics. The input menus and searchbox filter the display and are automatically populated by backing data columns.\n"
  },
  "data": {
    "athletes": {
      "file": "data/athletes.parquet"
    }
  },
  "hconcat": [
    {
      "vconcat": [
        {
          "hconcat": [
            {
              "input": "menu",
              "label": "Sport",
              "as": "$query",
              "from": "athletes",
              "column": "sport"
            },
            {
              "input": "menu",
              "label": "Sex",
              "as": "$query",
              "from": "athletes",
              "column": "sex"
            },
            {
              "input": "search",
              "label": "Name",
              "as": "$query",
              "from": "athletes",
              "column": "name",
              "type": "contains"
            }
          ]
        },
        {
          "vspace": 10
        },
        {
          "plot": [
            {
              "mark": "dot",
              "data": {
                "from": "athletes",
                "filterBy": "$query"
              },
              "x": "weight",
              "y": "height",
              "fill": "sex",
              "r": 2,
              "opacity": 0.1
            },
            {
              "mark": "regressionY",
              "data": {
                "from": "athletes",
                "filterBy": "$query"
              },
              "x": "weight",
              "y": "height",
              "stroke": "sex"
            },
            {
              "select": "intervalXY",
              "as": "$query",
              "brush": {
                "fillOpacity": 0,
                "stroke": "black"
              }
            }
          ],
          "xyDomain": "Fixed",
          "colorDomain": "Fixed",
          "margins": {
            "left": 35,
            "top": 20,
            "right": 1
          },
          "width": 570,
          "height": 350
        },
        {
          "vspace": 5
        },
        {
          "input": "table",
          "from": "athletes",
          "maxWidth": 570,
          "height": 250,
          "filterBy": "$query",
          "columns": [
            "name",
            "nationality",
            "sex",
            "height",
            "weight",
            "sport"
          ],
          "width": {
            "name": 180,
            "nationality": 100,
            "sex": 50,
            "height": 50,
            "weight": 50,
            "sport": 100
          }
        }
      ]
    }
  ]
};
