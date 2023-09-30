const express = require('express')
const router = express.Router()

const Category = require('../models/category')
const Record = require('../models/record')
const User = require('../models/user')

//  查詢
router.get('/', async (req, res, next) => {
  try {
    //  目前總金額是先加總在分類，如果資料太多會影響伺服器，
    //  可改兩次查詢，一次只查金額加總，一次分類+略過page*limit
    //  目前經驗不足，無法判斷哪像查詢結果會影響伺服器
    const selectedCategory = req.query.category === undefined ? 'all' : req.query.category;
    const userId = req.user.id || 0
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 5

    //  查詢所有資料
    const items = await Record.find({ userId: userId })
      .populate('userId', 'name')
      .populate('categoryId', 'name')
      .exec();
    //  分類
    const filteredItems = items
      .filter(item => selectedCategory === 'all' || item.categoryId.name === selectedCategory);

    // 頁面變數
    const totalItems = filteredItems.length;
    const totalPages = Array.from({ length: (Math.ceil(totalItems / limit)) }, (_, index) => index + 1)
    const previous = page > 1 ? page - 1 : 1;
    const next = page < totalPages[totalPages.length - 1] ? page + 1 : totalPages[totalPages.length - 1];

    // 資料整理、加總金額
    let totalAmount = 0;
    const data = filteredItems
      .map((item) => {
        totalAmount += item.amount;
        return {
          id: item._id,
          icon: selectIcon(item.categoryId.name),
          name: item.name,
          amount: item.amount,
          date: item.date.toISOString().slice(0, 10)
        };
      }).slice((page - 1) * limit, page * limit);
    res.render('index', { data, totalAmount, selectedCategory, page, previous, next, totalPages });
  } catch (error) {
    console.error('查詢數據出錯：', error);
    error.errorMessage = '資料取得失敗:(';
    next(error);
  }
});

//  新增帳目
router.get('/new', (req, res) => {
  const currentDate = getCurrentDate()
  return res.render('new', { currentDate })
})

//  編輯帳目
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
    res.status(500).send('服务器出错');
  }
});

//  新增帳目
router.post('/', async (req, res, next) => {
  try {
    const { name, amount, categoryName, date } = req.body;
    const userId = req.user.id
    const user = await User.findOne({ _id: userId }).exec();
    const category = await Category.findOne({ name: categoryName }).exec();

    if (!user || !category) {
      return res.status(400).json({ error: '資料類別有誤' });
    }

    const record = await Record.create({
      name: name,
      amount: amount,
      userId: userId,
      categoryId: category._id,
      date: date
    });

    console.log(`新增成功: 名稱:${record.name} 使用者:${user.name} 金額:${record.amount}`);
    req.flash('success', '新增成功!');
    return res.redirect('/');
  }
  catch (error) {
    error.errorMessage = '新增失敗:(';
    next(error);
  }


})

//  刪除帳目
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

//  更新帳目
router.put('/edit/:id', async (req, res, next) => {
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
    req.flash('success', '更新成功!');
    return res.redirect('/');
  } catch (error) {
    console.log(error);
    error.errorMessage = '更新失敗:(';
    next(error);
  }
});

//  連結類別及icon
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

//  取得當天日期
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

module.exports = router