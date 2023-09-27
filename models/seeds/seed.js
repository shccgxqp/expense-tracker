const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const User = require('../user');
const Category = require('../category');
const Record = require('../record');

//連建資料庫字串
let connectString = process.env.MONGODB_URI
  ? process.env.MONGODB_URI + "/expense-tracker"
  : "mongodb://127.0.0.1:27017/expense-tracker";


mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    // 創建用戶
    const hash = await bcrypt.hash('12345678', 10) //加密密碼
    const users = [
      { name: '廣志', email: 'user1@example.com', password: hash },
      { name: '小新', email: 'user2@example.com', password: hash },
    ];

    const createdUsers = await User.insertMany(users);

    // 創建分類
    const categories = [
      { name: '家居物業' },
      { name: '交通出行' },
      { name: '休閒娛樂' },
      { name: '餐飲食品' },
      { name: '其他' }
    ];

    const createdCategories = await Category.insertMany(categories);

    // 創建紀錄
    const records = [
      {
        name: '午餐',
        date: new Date('2019-04-23'),
        amount: 60,
        userId: createdUsers[0]._id,
        categoryId: createdCategories[3]._id,
      },
      {
        name: '晚餐',
        date: new Date('2019-04-23'),
        amount: 60,
        userId: createdUsers[0]._id,
        categoryId: createdCategories[3]._id,
      },
      {
        name: '捷運餐',
        date: new Date('2019-04-23'),
        amount: 120,
        userId: createdUsers[0]._id,
        categoryId: createdCategories[1]._id,
      },
      {
        name: '電影:驚奇隊長',
        date: new Date('2019-04-23'),
        amount: 220,
        userId: createdUsers[1]._id,
        categoryId: createdCategories[2]._id,
      },
      {
        name: '租金',
        date: new Date('2015-04-01'),
        amount: 25000,
        userId: createdUsers[0]._id,
        categoryId: createdCategories[0]._id,
      },
    ];

    await Record.insertMany(records);

    console.log('Initial data imported');
    mongoose.connection.close(); // 关闭数据库连接
  })
  .catch(err => console.error(err));