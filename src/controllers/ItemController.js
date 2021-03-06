const axios = require("axios");
const package = require("../../package.json");
const { mlUrls } = require("../config/config.json");

// Author
const name = package.author.split(" ")[0];
const lastname = package.author.split(" ")[1];

exports.find = async (query) => {
  const mlResp = await axios
    .get(`${mlUrls.search}?q=${query.search}`)
    .then((resp) => {
      let categories = [];
      let items = [];
      let filterCategories = resp.data?.filters ?? [];

      if (filterCategories.length > 0) {
        filterCategories.map((obj) => {
          if (obj.id == "category" && obj?.values) {
            obj.values.map((value) => {
              value.path_from_root.map((pathName) =>
                categories.push(pathName.name)
              );
            });
          }
        });
      }

      for (const item of resp.data.results) {
        items.push({
          id: item.id,
          title: item.title,
          category_id: item.category_id,
          price: {
            currency: item.currency_id,
            amount: item.price,
            decimals: 0,
          },
          picture: item.thumbnail,
          condition: item.condition,
          free_shipping: item.shipping.free_shipping,
          city: item.address.city_name,
        });
      }

      const data = {
        author: {
          name,
          lastname,
        },
        categories,
        items,
      };

      console.log(data);
      return { data };
    })
    .catch((err) => {
      const msg = "Error obteniendo Items";
      console.log(msg, err);

      return { msg };
    });

  return {
    data: {
      data: mlResp.data,
    },
    code: mlResp.data ? 200 : 400,
  };
};

exports.findOne = async (params) => {
  const getItemDetail = await axios
    .get(`${mlUrls.find}${params.id}`)
    .then(async (resp) => {
      let item = [];
      const product = resp.data;

      const descriptionRes = await findDescription(params.id);

      item.push({
        id: product.id,
        title: product.title,
        price: product.price,
        picture: product.thumbnail,
        condition: product.condition,
        free_shipping: product.shipping.free_shipping,
        sold_quantity: product.sold_quantity,
        description: descriptionRes.description,
      });

      const data = {
        author: {
          name,
          lastname,
        },
        item,
      };

      return { data };
    })
    .catch((err) => {
      const msg = "Error obteniendo Items";
      console.log(msg, err);

      return { msg };
    });

  return {
    data: {
      data: getItemDetail.data,
    },
    code: getItemDetail ? 200 : 400,
  };
};

const findDescription = async (itemId) => {
  const mlDescription = await axios
    .get(`${mlUrls.find}${itemId}/description`)
    .then((resp) => {
      const description = resp.data.plain_text;
      return description || "";
    })
    .catch((err) => {
      const msg = "Error obteniendo la descripci??n";
      console.log(msg, err);
      return "";
    });

  return {
    description: mlDescription,
  };
};
