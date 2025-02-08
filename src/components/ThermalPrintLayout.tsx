import React from 'react';

interface ThermalPrintLayoutProps {
  producerName: string;
  date: string;
  products: Array<{
    name: string;
    quantity: number;
  }>;
}

export function ThermalPrintLayout({ producerName, date, products }: ThermalPrintLayoutProps) {
  const totalItems = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="thermal-print">
      <style>
        {`
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }

            body {
              margin: 0;
              padding: 0;
              width: 80mm;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.5;
            }

            .thermal-print {
              width: 72mm;
              margin: 4mm;
              padding: 0;
            }

            /* Header */
            .thermal-print__header {
              text-align: left;
              margin-bottom: 4mm;
            }

            .thermal-print__company {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 1mm;
            }

            .thermal-print__producer {
              font-size: 14px;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 1mm;
            }

            .thermal-print__date {
              font-size: 12px;
              margin-bottom: 2mm;
            }

            /* Separator Line */
            .thermal-print__separator {
              border-top: 1px dashed #000;
              margin: 2mm 0;
            }

            /* Products List */
            .thermal-print__products {
              margin: 4mm 0;
            }

            .thermal-print__product {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1mm;
            }

            .thermal-print__product-quantity {
              width: 15mm;
              text-align: left;
              padding-right: 2mm;
            }

            .thermal-print__product-name {
              flex: 1;
              text-align: right;
            }

            /* Totals */
            .thermal-print__totals {
              margin-top: 4mm;
            }

            .thermal-print__total-line {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1mm;
            }

            .thermal-print__total-line span:last-child {
              font-weight: bold;
            }
          }
        `}
      </style>

      {/* Header */}
      <div className="thermal-print__header">
        <div className="thermal-print__company">
          Panadería Nueva Río D'or
        </div>
        <div className="thermal-print__producer">
          {producerName}
        </div>
        <div className="thermal-print__date">
          Producción Fecha: {new Date(date).toLocaleDateString('es-UY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}
        </div>
      </div>

      <div className="thermal-print__separator" />

      {/* Products */}
      <div className="thermal-print__products">
        {products.map((product, index) => (
          <div key={index} className="thermal-print__product">
            <div className="thermal-print__product-quantity">
              {product.quantity}
            </div>
            <div className="thermal-print__product-name">
              {product.name}
            </div>
          </div>
        ))}
      </div>

      <div className="thermal-print__separator" />

      {/* Totals */}
      <div className="thermal-print__totals">
        <div className="thermal-print__total-line">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
        <div className="thermal-print__total-line">
          <span>Total Unidades:</span>
          <span>{totalQuantity}</span>
        </div>
      </div>
    </div>
  );
}