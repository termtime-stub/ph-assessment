import {SerializedError} from "@reduxjs/toolkit";
export const thunkErrorHandler = (
  e: Error | SerializedError,
  returnFunction: any
) => {
  console.log(e);

  return returnFunction(e.toString());
};
