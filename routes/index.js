const express = require('express')
const router = express.Router();

const Category = require('../models/category')
const Record = require('../models/record')
const User = require('../models/user')

router.get('/', async (req, res) => {
  try {
    const selectedCategory = req.query.category === undefined ? 'all' : req.query.category;

    const items = await Record.find({})
      .populate('userId', 'name')
      .populate('categoryId', 'name')
      .exec();


    let totalAmount = 0;
    const data = items
      .filter(item => selectedCategory === 'all' || item.categoryId.name === selectedCategory)
      .map((item) => {
        totalAmount += item.amount;

        return {
          id: item._id,
          icon: selectIcon(item.categoryId.name),
          name: item.name,
          amount: item.amount,
          date: item.date.toISOString().slice(0, 10)
        };
      });

    res.render('index', { data, totalAmount, selectedCategory });
  } catch (error) {
    console.error('查詢數據出錯：', error);
    res.redirect('/');
  }
});

router.get('/new', (req, res) => {
  const currentDate = getCurrentDate()
  return res.render('new', { currentDate })
})

router.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Record.findById(id)
      .populate('userId', 'name')
      .populate('categoryId', 'name')
      .exec();

    const { name, amount, userId, categoryId, date } = record;

    return res.render('edit', {
      id,
      name,
      amount,
      user: userId.name,
      category: categoryId.name,
      date: date.toISOString().slice(0, 10)
    });
  } catch (error) {
    console.error(error);
    // 处理错误，例如返回一个错误页面
    res.status(500).send('服务器出错');
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, amount, categoryName, date } = req.body;

    const user = await User.findOne({ name: '小新' }).exec();
    const category = await Category.findOne({ name: categoryName }).exec();

    if (!user || !category) {
      return res.status(400).json({ error: '資料類別有誤' });
    }

    const record = await Record.create({
      name: name,
      amount: amount,
      userId: user._id,
      categoryId: category._id,
      date: date
    });

    console.log(`新增成功: 名稱:${record.name} 使用者:${user.name} 金額:${record.amount}`);
    return res.redirect('/');
  }
  catch (error) {
    console.log(error)
    return res.redirect('/')
  }


})

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Record.deleteOne({ _id: id });
    console.log(`刪除成功:${id}`);
  } catch (error) {
    console.error(error);
  }

  return res.redirect('/');
});

router.put('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, date, categoryName, amount } = req.body;

    // 尋找類別
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(400).json({ error: '類別不存在' });
    }

    // 更新紀錄
    await Record.updateOne(
      { _id: id },
      {
        name: name,
        amount: amount,
        categoryId: category.id,
        date: date,
      }
    );

    return res.redirect('/');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: '修改錯誤' });
  }
});

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

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

module.exports = router;