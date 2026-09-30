export class ProductDto {
  id!: number;
  name!: string;
  description!: string;
  price!: number;
  stock!: number;
  image_url!: string;
  seller!: {
    name: string;
    lastname: string;
    storeName?: string;
  };

  static selectIncludeData() {
    return {
      sellers: {
        include: {
          user: {
            select: {
              name: true,
              lastname: true,
              city: true,
              email: true,
            },
          },
        },
      },
    };
  }

  static createList(products) {
    return products.map((product) => {
      const seller = product.sellers.user;

      const productDto = new ProductDto();

      productDto.id = product.id;
      productDto.name = product.name;
      productDto.description = product.description;
      productDto.price = product.price;
      productDto.stock = product.stock;
      productDto.image_url = product.image_url;

      productDto.seller = {
        name: seller.name,
        lastname: seller.lastname,
        storeName: product.sellers.storeName,
      };

      return productDto;
    });
  }

  static create(product) {
    const seller = product.sellers.user;

    const productDto = new ProductDto();

    productDto.id = product.id;
    productDto.name = product.name;
    productDto.description = product.description;
    productDto.price = product.price;
    productDto.stock = product.stock;
    productDto.image_url = product.image_url;

    productDto.seller = {
      name: seller.name,
      lastname: seller.lastname,
      storeName: product.sellers.storeName,
    };

    return productDto;
  }
}
