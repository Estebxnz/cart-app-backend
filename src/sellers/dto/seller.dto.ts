export class SellerDto {
  token!: string;
  seller?: { storeName?: string };

  static create(token: string, seller?: { storeName?: string }) {
    const sellerDto = new SellerDto();
    sellerDto.token = token;
    sellerDto.seller = seller;
    return sellerDto;
  }
}
