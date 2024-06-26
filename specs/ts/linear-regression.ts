import { Spec } from '@uwdata/mosaic-spec';

export const spec : Spec = {
  "meta": {
    "title": "Linear Regression",
    "description": "A linear regression plot predicting athletes' heights based on their weights. Regression computation is performed in the database. The area around a regression line shows a 95% confidence interval. Select a region to view regression results for a data subset.\n"
  },
  "data": {
    "athletes": {
      "file": "data/athletes.parquet"
    }
  },
  "plot": [
    {
      "mark": "dot",
      "data": {
        "from": "athletes"
      },
      "x": "weight",
      "y": "height",
      "fill": "sex",
      "r": 2,
      "opacity": 0.05
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
        "stroke": "currentColor"
      }
    }
  ],
  "xyDomain": "Fixed",
  "colorDomain": "Fixed"
};
