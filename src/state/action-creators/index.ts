import { ActionType } from "../action-types";
import {
  Action,
  UpdateCellAction,
  DeleteCellAction,
  MoveCellAction,
  InsertCellBeforeAction,
  Direction
} from "../actions";
import { CellTypes } from "../cell";

// * Before each of these action creators args this is displaying the return type of these funtions. They will follow their corresponding types or should return those types.

export const updtaeCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};
export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};
export const moveCell = (
  id: string,
  direction: Direction
): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};
export const insertCellBefore = (
  id: string,
  cellType: CellTypes
): InsertCellBeforeAction => {
  return {
    type: ActionType.INSERT_CELL_BEFORE,
    payload: {
      id,
      type: cellType,
    },
  };
};
