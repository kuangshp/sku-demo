// 目前有的sku
const attrListMockData = [
  {
    attrLabel: '颜色',
    id: 1,
    options: [
      { id: 1, value: '红色', attrId: 1 },
      { id: 2, value: '绿色', attrId: 1 },
      { id: 3, value: '蓝色', attrId: 1 },
    ],
  },
  {
    attrLabel: '尺寸',
    id: 2,
    options: [
      { id: 4, value: 'M', attrId: 2 },
      { id: 5, value: 'L', attrId: 2 },
      { id: 6, value: 'XL', attrId: 2 },
    ],
  },
  {
    attrLabel: '款式',
    id: 3,
    options: [
      { id: 7, value: '男款', attrId: 3 },
      { id: 8, value: '女款', attrId: 3 },
    ],
  },
];

/**
 * attr spec表
 * @description sku列表数据转map,方便映射查找，判断sku数据对比复用
 * @param skuList  sku列表
 * @returns skuKey做键,sku数据做值的sku查找映射
 */
function skuList2Map(skuList) {
  return skuList.reduce((map, sku) => {
    map[sku.key] = sku;
    return map;
  }, {});
}
/**
 * @description 循环版本的SKU全排列组合
 * @param attrs 属性列表
 * @param prevSkuList 上一次的sku列表数据
 * @returns 新的sku列表数据
 */
function createSkuList1(attrList) {
  let skuList = [];

  // 定义一个对象
  const prevSkuMap = {};
  for (const row of attrList) {
    if (row.options.length === 0) {
      return;
    }
    if (skuList.length === 0) {
      // 如果里面是没有内容的时候
      skuList = row.options.map((option) => {
        const attrSet = [
          {
            attr: row.attrLabel,
            spec: option.value,
            attrId: row.id,
            specId: option.id,
          },
        ];
        return {
          ids: attrSet.map(({ specId }) => specId).join('_'),
          key: attrSet.map(({ spec }) => spec).join('_'),
          attrSet,
          stock: 0,
        };
      });
    } else {
      // 如果里面有数据的时候就要判断下是否新加还是往之前的追加
      const tempList = [];
      for (const skuItem of skuList) {
        console.log(skuItem);
        //2. 遍历当前已累积的规格组合
        for (const option of row.options) {
          //3. 遍历当前规格值，并将值与所有已累积的规格进行拼接
          // 现在的sku拼接新的
          const attrSet = skuItem.attrSet.concat({
            attr: row.attrLabel,
            spec: option.value,
            attrId: row.ids,
            specId: option.id,
          });
          const key = attrSet.map(({ spec }) => spec).join('_');
          const ids = attrSet.map(({ specId }) => specId).join('_');
          if (prevSkuMap[key]) {
            // 如果改变前后的sku key相同，复用sku数据,避免覆盖
            tempList.push({
              ...prevSkuMap[key],
              ids,
            });
          } else {
            tempList.push({
              ids,
              key,
              attrSet,
              stock: 0,
            });
          }
        }
      }
      if (row.options.length > 0) {
        skuList = tempList;
      }
    }
  }
  return skuList;
}
const result = createSkuList1(attrListMockData);
console.log(JSON.stringify(result));
