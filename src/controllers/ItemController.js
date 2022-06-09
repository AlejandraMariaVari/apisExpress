const axios = require("axios");
const package = require("../../package.json");
const { mlUrls } = require("../config/config.json");

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
          name: package.author.split(" ")[0],
          lastname: package.author.split(" ")[1],
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
  return {
    data: {
      find: "Encontrado",
      params,
    },
    code: 200,
  };
};
