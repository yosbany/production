import ReactDOMServer from 'react-dom/server';
import { ThermalPrintLayout } from '../components/ThermalPrintLayout';

interface PrintData {
  producerName: string;
  date: string;
  products: Array<{
    name: string;
    quantity: number;
  }>;
}

export function handlePrintProduction(printData: PrintData) {
  // Verificar que haya productos para imprimir
  const productsWithQuantity = printData.products.filter(p => p.quantity > 0);
  
  if (productsWithQuantity.length === 0) {
    alert('No hay productos con cantidades especificadas para imprimir');
    return;
  }

  // Crear una nueva ventana para la impresión
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permita las ventanas emergentes para imprimir');
    return;
  }

  // Generar el contenido del layout primero
  const printContent = ReactDOMServer.renderToString(
    ThermalPrintLayout({ ...printData })
  );

  // Escribir el contenido HTML en la nueva ventana
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Producción - ${printData.producerName}</title>
        <meta charset="UTF-8">
      </head>
      <body>
        <div id="print-root">${printContent}</div>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          }
        </script>
      </body>
    </html>
  `);

  // Cerrar el documento
  printWindow.document.close();
}