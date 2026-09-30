import { IInvoiceCustomer } from '../interfaces/invoice-customer.interface';
import { IInvoiceItems } from '../interfaces/invoice-items.interface';

export class InvoiceInfoDto {
  invoiceNumber!: number;
  dateIssued!: Date;
  customer!: IInvoiceCustomer;
  items!: IInvoiceItems[];
  totalAmount!: number;
  noteLine1!: 'Gracias por su compra!';
  noteLine2!: 'Este documento fue generado por CartApp';

  static create(order) {
    const invoiceinfo = new InvoiceInfoDto();

    invoiceinfo.invoiceNumber = order.id;
    invoiceinfo.dateIssued = order.created_at;
    invoiceinfo.customer = {
      name: order.users.name,
      address: order.users.address,
      city: order.users.city,
      phone: order.users.phone,
    };
    invoiceinfo.items = order.order_items.map((item) => {
      return {
        description: item.products.name,
        quantity: item.quantity,
        price: item.unitPrice,
        total: item.subtotal,
      };
    });
    invoiceinfo.totalAmount = order.total;
    return invoiceinfo;
  }
}
