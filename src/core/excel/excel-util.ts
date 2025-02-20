import { Style, Workbook, CellRichTextValue, Worksheet, Row } from 'exceljs';
import {
  CellPosition,
  FillConfig,
  SheetConfig,
  SheetTemplateConfig,
} from './types';
import {
  border,
  center,
  mediumBold,
  small,
  smallBold,
} from './types/constants';
import { calcMaxHeight } from './exceljs.extension';
import { get, merge } from 'lodash';
import { InternalServerErrorException } from '@nestjs/common';

export class ExcelUtil {
  static header(fileName: string) {
    fileName = encodeURIComponent(fileName);
    return {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${fileName}`,
    };
  }
  private _workbook: Workbook;
  constructor() {
    this._workbook = new Workbook();
  }
  async writeFile() {
    const buffer = await this._workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private setMaxHeight(
    ws: Worksheet,
    row: Row,
    listText: string[],
    colCode: string,
  ) {
    const rMaxHeight = calcMaxHeight(
      listText,
      ws.getColumn(colCode).width || 1,
    );
    if (rMaxHeight > row.height) {
      row.height = rMaxHeight;
    }
  }
  async fillToBlank(config: FillConfig<SheetConfig>) {
    for (const sheet of config.sheets) {
      const mergeInCols: number[] = [];
      const ws = this._workbook.addWorksheet(sheet.name);
      const rowTitle = ws.getRow(sheet.rowStart - 1);
      sheet.columns.forEach((column) => {
        const columnConfig = ws.getColumn(column.col);
        columnConfig.key = column.code;
        const titleCell = rowTitle.getCell(column.col);
        titleCell.value = column.header ?? column.code;
        titleCell.style = { font: smallBold, border, alignment: center };
        if (column.width) {
          columnConfig.width = column.width;
        }
        if (column.hasMerged) {
          mergeInCols.push(column.col);
        }
      });

      if (sheet.fillSpecCell) {
        sheet.fillSpecCell.forEach((config) => {
          const cellO = ws.getCell(config.cell[0], config.cell[1]);
          cellO.value = config.value;
          cellO.style = config.style;
        });
      }
      // Cấu hình các cột mở rộng
      if (sheet.expandColumns) {
        this.expandColumn(ws, sheet);
      }
      if (sheet.replace) {
        this.replaceCell(ws, sheet);
      }
      const rowStart = sheet.rowStart;
      if (sheet.groupBy) {
        this.groupCell(ws, sheet);
      } else {
        // Fill dữ liệu
        sheet.data.forEach((e, i) => {
          const row = ws.getRow(sheet.rowStart + i);
          sheet.columns.concat(sheet.expandColumns ?? []).forEach((col) => {
            const currentCell = row.getCell(col.code);
            currentCell.style = merge(
              {},
              { font: small, border, alignment: center },
              sheet.commonCellDataStyle,
              col.cellDataStyle ?? {},
            );
            if (col.code === 'stt') {
              currentCell.value = i + 1;
            } else if (col.transform && typeof col.transform === 'function') {
              currentCell.value = col.transform(get(e, col.code ?? ''), e);
            } else {
              currentCell.value = get(e, col.code ?? '');
            }
            this.setMaxHeight(
              ws,
              row,
              [currentCell.value?.toString() ?? ''],
              col.code,
            );
          });
          if (sheet.simpleMergeRowBy) {
            row.key = get(e, sheet.simpleMergeRowBy);
          }
        });
      }
      if (sheet.expandColumns) {
        this.expandColumnStyle(ws, sheet);
      }
      if (sheet.views) {
        ws.views = sheet.views;
      }
      // merge cells
      if (sheet.mergeAndCenterCells) {
        sheet.mergeAndCenterCells.forEach((mc: CellPosition) => {
          ws.mergeCells(mc);
          ws.getCell(mc[0], mc[1]).alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true,
          };
        });
      }
      if (sheet.mergeCells) {
        sheet.mergeCells.forEach((mc) => {
          ws.mergeCells(...mc.position);
          const cell = ws.getCell(mc.position[0], mc.position[1]);
          cell.style = merge({}, cell.style, mc.style);
        });
      }
      if (mergeInCols.length) {
        mergeInCols.forEach((columnNumber) => {
          const mergeCells: (
            | { value: any; master: number; last: number }
            | undefined
          )[] = [];
          ws.getColumn(columnNumber).eachCell((cell, rowNumber) => {
            if (rowNumber <= rowStart) {
              return;
            }
            const lastMerged = mergeCells?.at(-1);
            if (sheet.simpleMergeRowBy) {
              const cRow = ws.getRow(rowNumber);
              if (!cRow?.key) {
                return;
              }
              if (lastMerged && cRow && cRow.key === lastMerged.value) {
                lastMerged.last = rowNumber;
              } else {
                mergeCells.push({
                  value: cRow.key,
                  master: rowNumber,
                  last: rowNumber,
                });
              }
            } else if (lastMerged && cell.value === lastMerged.value) {
              lastMerged.last = rowNumber;
            } else {
              mergeCells.push({
                value: cell.value,
                master: rowNumber,
                last: rowNumber,
              });
            }
          });
          mergeCells.forEach((range) => {
            if (range && range.last !== range.master) {
              ws.mergeCells(
                range.master,
                columnNumber,
                range.last,
                columnNumber,
              );
            }
          });
        });
      }
    }
  }

  private expandColumn(ws: Worksheet, sheet: SheetTemplateConfig) {
    let firstColWidth = ws.properties.defaultColWidth;
    sheet.expandColumns?.forEach((ec, i) => {
      const column = ws.getColumn(ec.col);
      column.key = ec.code;
      if (i === 0) {
        firstColWidth = column.width;
      } else {
        column.width = firstColWidth;
      }
      if (typeof ec.title === 'string') {
        ws.getCell(sheet.rowStart - 1, ec.col).value = ec.title;
      } else {
        ws.getCell(ec.title?.row ?? 1, ec.col).value = ec.title?.text ?? '';
      }
    });
  }

  private expandColumnStyle(ws: Worksheet, sheet: SheetTemplateConfig) {
    const cellMap: Map<number, Partial<Style>> = new Map();

    sheet.expandColumns?.forEach((ec, i) => {
      // style dòng title
      ws.getCell(sheet.rowStart - 1, ec.col).style = {
        border,
        font: mediumBold,
        alignment: center,
      };
      const column = ws.getColumn(ec.col);
      if (i === 0) {
        column.eachCell((colCell, row) => {
          if (row < sheet.rowStart) {
            return;
          }
          const cellStyle = Object.assign(
            {},
            colCell.style,
            { alignment: center },
            sheet.commonCellDataStyle,
            ec.cellDataStyle,
          );
          cellMap.set(row, cellStyle);
          ws.getCell(row, ec.col).style = cellStyle;
        });
      } else {
        cellMap.forEach((style, row) => {
          ws.getCell(row, ec.col).style = { ...style };
        });
      }
    });
  }

  private replaceCell(ws: Worksheet, sheet: SheetTemplateConfig) {
    sheet.replace.forEach((conf) => {
      const cell = ws.getRow(conf.cell[0]).getCell(conf.cell[1]);
      if (
        cell?.value &&
        typeof cell.value === 'object' &&
        'richText' in cell.value
      ) {
        (cell.value as CellRichTextValue).richText.forEach((rt) => {
          rt.text = rt.text.replaceAll(conf.replace, conf.value);
        });
      } else {
        cell.value = cell.value
          ?.toString()
          ?.replaceAll(conf.replace, conf.value);
      }
    });
  }

  private groupCell(ws: Worksheet, sheet: SheetTemplateConfig) {
    const groupBy = sheet.groupBy;
    if (!groupBy.list?.length) {
      throw new InternalServerErrorException({
        message: 'Must have at least one group',
      });
    }
    const groupData = groupBy.list.map((e) => {
      return {
        name: e,
        data: sheet.data.filter((item) => get(item, groupBy.field ?? '') === e),
      };
    });
    groupData?.forEach((group, iKey) => {
      const titleRow = ws.getRow(++sheet.rowStart);
      if (titleRow) {
        const values = groupBy?.values(group.name, iKey, group.data) ?? {};
        Object.keys(values).forEach((cellKey) => {
          const cell = titleRow.getCell(cellKey);
          cell.value = values[cellKey];
          if (cellKey === 'stt') {
            cell.style = { font: smallBold, border, alignment: center };
          } else {
            cell.style = {
              font: smallBold,
              border,
              alignment: { wrapText: true },
            };
          }
        });
        if (groupBy?.defaultWidth) {
          titleRow.height = calcMaxHeight(
            Object.values(values),
            groupBy?.defaultWidth,
          );
        }
      }
      if (groupBy?.merge) {
        ws.mergeCells(groupBy?.merge([sheet.rowStart, 2, sheet.rowStart, 2]));
      }
      group.data?.forEach((e, i) => {
        const row = ws.getRow(sheet.rowStart + 1);
        sheet.columns.concat(sheet.expandColumns ?? []).forEach((col) => {
          const currentCell = row.getCell(col.code);
          currentCell.style = merge(
            {},
            { font: small, border, alignment: center },
            sheet.commonCellDataStyle,
            col.cellDataStyle ?? {},
          );
          if (col.code === 'stt') {
            currentCell.value = i + 1;
          } else if (col.transform && typeof col.transform === 'function') {
            currentCell.value = col.transform(get(e, col.code ?? ''), e);
          } else {
            currentCell.value = get(e, col.code ?? '');
          }
          this.setMaxHeight(
            ws,
            row,
            [currentCell.value?.toString() ?? ''],
            col.code,
          );
        });
        if (sheet.simpleMergeRowBy) {
          row.key = get(e, sheet.simpleMergeRowBy);
        }
        sheet.rowStart++;
      });
    });
  }
}
