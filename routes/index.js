const express = require('express')
const router = express.Router();

const category = require('../models/category')
const record = require('../models/record')
const user = require('../models/user')

router.get('/', (req, res) => {

  record.find({})
    .populate('userId', 'name') // 填充 userId 字段
    .populate('categoryId', 'name') // 填充 categoryId 字段
    .exec()
    .then((items) => {

      const datas = items.map((item) => ({
        name: item.name,
        amount: item.amount,
        date: item.date.toISOString().slice(0, 10)
      }));
      console.log(datas)
      return res.render('index', { datas })
    })
    .catch((error) => {
      console.error('查询数据时出错：', error);
    });

})

module.exports = router;