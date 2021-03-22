import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import numeral from "numeral";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  console.log(title, active);
  return (
    <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${ isRed && "infoBox--red"}`}>
      <CardContent>
        <Typography color="textSecondary">{title}</Typography>

        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>+{numeral(cases).format("0, 0")}</h2>

        <Typography className="infoBox__total" color="textSecondary">Total: {numeral(total).format("0, 0")}</Typography>

      </CardContent>
    </Card>
  );
}

export default InfoBox;
