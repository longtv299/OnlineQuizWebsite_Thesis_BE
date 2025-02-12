import ExcelJS from 'exceljs';
interface CellReplace {
  /**
   * ô replace dữ liệu
   * [row, col]
   */
  cell: number[];
  value: any;
  replace: any;
  style?: Partial<ExcelJS.Style>;
  height?: number;
}

interface FillSpecCell {
  cell: number[];
  value: any;
  style?: Partial<ExcelJS.Style>;
  height?: number;
}

export interface CustomColumn extends ExcelJS.Column {
  title: string;
}
export interface ColumnBase {
  code: string;
  /**
   * Vị trí của cột
   */
  col: number;
  transform?: (...args: any) => any;
  /**
   * Merge các dòng.
   * Nếu sheet.simpleMergeRowBy thì merge các dòng theo row key ngược lại merge theo giá trị
   */
  hasMerged?: boolean;
  width?: number;
  cellDataStyle?: Partial<ExcelJS.Style>;
}
export interface ExpandColumn extends ColumnBase {
  col: number;
  title?: string | { row: number; text: string };
}
// Partial<ExcelJS.Column>
export interface ColumnConfig extends Partial<ExcelJS.Column> {
  code?: string;
  title: string;
  width?: number;
  rowConfig?: Partial<ExcelJS.Style>;
  isNested?: boolean;
  transform?: (...args: any) => any;
}

export interface ConfigExcel {
  replace?: WritableCell[];
  columnConfig: ColumnConfig[];
  rowStart: number;
  /**
   * dạng nested object ví dụ: {diemDungs: true}
   * khi đến mỗi cấp, writer sẽ insert các dòng tương ứng với cấp con
   */
  layoutLevel?: string[];
  isSynthesisReport?: boolean;
}

export interface WritableCell {
  c?: string | number;
  r?: string | number;
  cell?: [number, number, number?, number?];
  value: ExcelJS.CellValue;
  height?: number;
  style?: Partial<ExcelJS.Style>;
  rangeCol?: number;
  rangeRow?: number;
  isInsert?: boolean;
}
export type CellPosition = [number, number, number, number];

export interface SheetConfig {
  commonCellDataStyle?: Partial<ExcelJS.Style>;
  name: string;
  data: any[];
  replace?: CellReplace[];
  fillSpecCell?: FillSpecCell[];
  columns: (ColumnBase & { header?: string })[];
  expandColumns?: ExpandColumn[];
  rowStart: number;
  mergeAndCenterCells?: CellPosition[] | number[][];
  mergeCells?: { position: CellPosition; style: Partial<ExcelJS.Style> }[];
  views?: Partial<ExcelJS.WorksheetView>[];
  /**
   * Chỉ sử dụng khi merge các dòng 1 cấp
   * ví dụ các biển báo thuộc cùng điểm dừng thì merge theo điểm dừng
   */
  simpleMergeRowBy?: string;
  groupBy?: {
    field: string;
    list: any[];
    values: (...args) => { [k: string]: any };
    merge?: (cell: CellPosition) => CellPosition;
    defaultWidth?: number;
  };
}
export interface SheetTemplateConfig extends SheetConfig {
  templateSheet?: string;
  columns: ColumnBase[];
}
export interface FillConfig<T = SheetTemplateConfig> {
  sheets: T[];
}
