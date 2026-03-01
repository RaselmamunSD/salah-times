"use client";
import React from "react";
import { GoStar, GoStarFill } from "react-icons/go";

const EmptyStar = ({ filled = false }) => {
  if (filled) {
    return <GoStarFill size={20} color="#C9A24D" className="cursor-pointer" />;
  }

  return <GoStar size={20} color="#C9A24D" className="cursor-pointer" />;
};

export default EmptyStar;
