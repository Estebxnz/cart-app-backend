import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import puppeteer from 'puppeteer';

import { InvoiceInfoDto } from './dto/invoice-info.dto';

@Injectable()
export class InvoicesService {
  async generateInvoice(invoiceData: InvoiceInfoDto) {
    const templatePath = path.join(
      process.cwd(),
      'src/invoices/template/invoice-template.html',
    );

    const templateHtml = fs.readFileSync(templatePath, 'utf-8');

    const template = Handlebars.compile(templateHtml);

    const html = template(invoiceData);

    return await this.generatePdf(html);
  }

  private async generatePdf(html: string) {
    const browser = await puppeteer.launch();

    try {
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
