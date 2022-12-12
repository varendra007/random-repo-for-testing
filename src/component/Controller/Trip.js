import * as React from "react";
import "./Trip.css";

const classes = {
  button: {
    border: "none",
    borderRadius: "3px",
    width: "auto",
    height: "auto",
    backgroundColor: "#fa2d64",
    color: "#ffffff",
    fontStyle: "normal",
    fontFamily: "Inter",
    fontWeight: "medium",
    textAlign: "center",
    cursor: "pointer",
    padding: "5px 5px",
    marginRight: "1%",
    marginLeft: "1%",
    marginTop: "1%",
  },
  fontname: {
    fontFamily: "Inter",
  },
};

const Trip = (props) => {
  return (
    <div className="tripx">
      <div className="elementx">Conductor Phone no: {props.ConductorPhone}</div>
      <div className="elementx">Time of Departure: {props.time}</div>
      <div className="elementx">Bus no: {props.busNo}</div>
      <div style={{ display: "flex", width: "auto" }}>
        <button style={classes.button}>Modify Trip</button>
        <button style={classes.button}>Delete Trip</button>
      </div>
    </div>
  );
};

export default Trip;
