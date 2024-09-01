const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => {
  const getSub = async function (parentId) {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      deleted: false,
      status: "active"
    })

    let allSub = [...subs];

    for (const sub of subs) {
      const childs = await getSub(sub.id);
      allSub = allSub.concat(childs);
    }

    return allSub;
  }

  const result = await getSub(parentId);
  return result;
}