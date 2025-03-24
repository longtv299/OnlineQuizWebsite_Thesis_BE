/* eslint-disable @typescript-eslint/no-require-imports */
import { Cell, Workbook, Worksheet } from 'exceljs';
import ExcelJS from 'exceljs';
import { border } from './types/constants';
class CustomCell extends require('exceljs/dist/es5/doc/cell') {
  draw = function (this: Cell) {
    this.border = border;
  };
}
class CustomWorksheet extends require('exceljs/dist/es5/doc/worksheet') {
  getCellAt = function (
    this: Worksheet,
    r: number | string,
    c: number | string,
  ) {
    return Object.setPrototypeOf(
      Object.assign({}, this.getCell(r, c)),
      CustomCell.prototype,
    );
  };
}
Object.assign(ExcelJS, {
  Cell: CustomCell,
  Worksheet: CustomWorksheet,
});

declare module 'exceljs' {
  interface Workbook {
    getWs(indexOrName?: number | string): Worksheet | undefined;
    pushWorksheet(
      name: string,
      worksheet: Worksheet,
      config?: { merges?: string[] },
    ): Worksheet;
  }
  class Cell {
    draw();
  }
  class Worksheet {
    getCellAt(r: number | string, c?: number | string): Cell;
  }
  interface Row {
    key?: string;
  }
}

Workbook.prototype.pushWorksheet = function (
  name: string,
  worksheet: Worksheet,
  config?: { merges?: string[] },
) {
  const copyWs: Worksheet = this.addWorksheet(name);
  copyWs.model = structuredClone(worksheet.model);
  const mergeCellsFromTemplate = [
    ...worksheet.model.merges,
    ...(config?.merges ?? []),
  ];
  mergeCellsFromTemplate.forEach((merge) => copyWs.mergeCells(merge));

  copyWs.name = name;
  return copyWs;
};
Workbook.prototype.getWs = function (
  this: Workbook,
  indexOrName?: number | string,
) {
  return Object.setPrototypeOf(
    Object.assign({}, this.getWorksheet(indexOrName)),
    CustomWorksheet.prototype,
  );
};

// Worksheet.prototype.getCellAt = function (this: Worksheet, r: number | string, c: number | string) {
//   return Object.setPrototypeOf(Object.assign({}, this.getCell(r, c)), CustomCell.prototype);
// };

// Cell.prototype.draw = function (this: Cell) {
//   this.border = border;
// };

export const calcMaxHeight = (listText: string[], defaultWidth: number = 1) => {
  return (
    Math.max(
      ...listText?.map((text) => {
        const lines = text?.toString().split('\n').length ?? 0;
        const approxHeight = Math.ceil(
          (text?.toString()?.length ?? 0) / defaultWidth,
        ); // Adjust the divisor to fit your column width
        return Math.max(lines, approxHeight);
      }),
    ) *
      15 +
    3 //padding
  );
};
