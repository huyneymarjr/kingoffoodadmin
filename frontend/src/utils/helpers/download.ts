import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../../public/Roboto-Regular.js'; // Đảm bảo rằng đường dẫn đúng với vị trí của file

export const printInvoice = async (invoiceData: any) => {
  const doc = new jsPDF();

  // Sử dụng font Roboto đã được nhúng
  doc.setFont('Roboto');

  // Add title
  doc.setFontSize(18);
  doc.text('King Of Food', 10, 10);

  // Add invoice data
  doc.setFontSize(12);
  doc.text(`Số hóa đơn: ${invoiceData.number}`, 10, 20);
  doc.text(`Ngày: ${invoiceData.date}`, 10, 30);
  doc.text(`Khách hàng: ${invoiceData.customer}`, 10, 40);
  doc.text(`Mã giảm giá: ${invoiceData.promotion}`, 10, 50);
  doc.text(`Giảm giá tích điểm: ${invoiceData.point}`, 10, 60);
  doc.text(`Thuế hóa đơn: ${invoiceData.tax}`, 10, 70);

  // Add table using jsPDF-AutoTable
  const tableColumn = ['Sản phẩm', 'Số lượng', 'Giá', 'Tổng'];
  const tableRows: any[] = [];

  invoiceData.items.forEach((item: any) => {
    const itemData = [
      item.name,
      item.quantity.toString(),
      item.price.toString(),
      (item.quantity * item.price).toString(),
    ];
    tableRows.push(itemData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: 'grid',
    styles: { font: 'Roboto', fontSize: 12 },
    didDrawPage: (data) => {
      // Check if the content exceeds the page height
      if (data?.cursor?.y || 0 + 10 > doc.internal.pageSize.height) {
        doc.addPage();
      }
    },
  });

  // Add total amount
  const finalY = (doc as any).lastAutoTable.finalY || 80; // Use the lastAutoTable property to get the final Y position
  doc.text(`Total: ${invoiceData.total}`, 160, finalY + 10);

  // Open the PDF in a new window and print
  const pdfData = doc.output('datauristring');
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`<iframe id='pdfFrame' width='100%' height='100%' src='${pdfData}'></iframe>`);
    printWindow.document.close();

    const pdfFrame = printWindow.document.getElementById('pdfFrame') as HTMLIFrameElement;
    pdfFrame.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
};
export const download = (canvas: any, filename: any) => {
  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/jpeg');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
