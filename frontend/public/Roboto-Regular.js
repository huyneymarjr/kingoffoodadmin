import { jsPDF } from 'jspdf';
var font = 'data:font/truetype;charset=utf-8;base64,<base64-string>';
var callAddFont = function () {
  this.addFileToVFS('TimeNewRoman-normal.ttf', font);
  this.addFont('TimeNewRoman-normal.ttf', 'TimeNewRoman', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont]);
