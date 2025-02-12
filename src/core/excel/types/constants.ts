import { Alignment, Borders, FillPattern, Font, Style } from 'exceljs';

export const center: Partial<Alignment> = {
  vertical: 'middle',
  horizontal: 'center',
  wrapText: true,
};

export const left: Partial<Alignment> = {
  vertical: 'middle',
  horizontal: 'left',
  wrapText: true,
};

export const right: Partial<Alignment> = {
  vertical: 'middle',
  horizontal: 'right',
  wrapText: true,
};

export const largeBold: Partial<Font> = {
  name: 'Times New Roman',
  size: 14,
  bold: true,
};

export const mediumBold: Partial<Font> = {
  name: 'Times New Roman',
  size: 13,
  bold: true,
};

export const smallBold: Partial<Font> = {
  name: 'Times New Roman',
  size: 12,
  bold: true,
};

export const smallItalic: Partial<Font> = {
  name: 'Times New Roman',
  size: 12,
  italic: true,
};

export const large: Partial<Font> = {
  name: 'Times New Roman',
  size: 14,
};

export const medium: Partial<Font> = {
  name: 'Times New Roman',
  size: 13,
};

export const small: Partial<Font> = {
  name: 'Times New Roman',
  size: 12,
  bold: false,
};

export const border: Partial<Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export const D6DCE4: FillPattern = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'D6DCE4' },
  bgColor: { argb: 'D6DCE4' },
};

export const fillCell = (color: 'none' | string): FillPattern => {
  if (color === 'none') {
    return { pattern: 'none', type: 'pattern' };
  }
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: color },
    bgColor: { argb: color },
  };
};

export const TITLE_STYLE: Partial<Style> = {
  alignment: center,
  font: largeBold,
};
