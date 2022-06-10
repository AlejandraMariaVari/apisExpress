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

      for (const item of resp.data.results) {
        if (categories.indexOf(item.category_id) < 0) {
          categories.push(item.category_id);
        }

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

      item.push({
        id: product.id,
        title: product.title,
        price: product.price,
        picture: product.thumbnail,
        condition: product.condition,
        free_shipping: product.shipping.free_shipping,
        sold_quantity: product.sold_quantity,
      });

      const descriptionRes = await findDescription(params.id);

      const data = {
        author: {
          name,
          lastname,
        },
        item,
        description: descriptionRes.description,
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
      const msg = "Error obteniendo la descripción";
      console.log(msg, err);
      return "";
    });

  return {
    description: mlDescription,
  };
};
