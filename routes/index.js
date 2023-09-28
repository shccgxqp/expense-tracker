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
      let totalAmount = 0
      const data = items.map((item) => {
        totalAmount += item.amount;
        console.log(item)
        return {
          id: item._id,
          icon: selectIcon(item.categoryId.name),
          name: item.name,
          amount: item.amount,
          date: item.date.toISOString().slice(0, 10)
        }
      });

      return res.render('index', { data, totalAmount })
    })
    .catch((error) => {
      console.error('查詢數據出錯：', error);
      return res.redirect('/')
    });

})
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  record.deleteOne({ _id: id })
    .then(() => {
      console.log(`刪除成功:${id}`)
      return res.redirect('/')
    })
    .catch((error) => {
      console.log(error)
      return res.redirect('/')
    })
})


function selectIcon(categoryId) {
  if (categoryId === '家居物業') {
    return "fa-solid fa-house"
  } else if (categoryId === '交通出行') {
    return "fa-solid fa-van-shuttle"
  } else if (categoryId === '休閒娛樂') {
    return "fa-solid fa-face-grin-beam"
  } else if (categoryId === '餐飲食品') {
    return "fa-solid fa-utensils"
  } else {
    return "fa-solid fa-pen"
  }
}
module.exports = router;