# CATTI俄语二级笔译题库系统

这是一个基于纯前端技术开发的俄语选择题练习系统，适用于CATTI俄语二级笔译考试备考。

## 功能特点

- 📚 **多题库支持**：可以创建多个不同的题库
- 🎯 **三种答题模式**：
  - 顺序做题：按照题目顺序依次作答
  - 乱序做题：随机打乱题目顺序
  - 直接看题：直接查看题目和答案解析
- 📊 **进度跟踪**：实时显示答题进度，颜色区分答题状态
  - 白色：未作答
  - 绿色：答对
  - 红色：答错
- 💡 **即时反馈**：答错时立即显示详细解析
- 📱 **响应式设计**：支持手机和电脑访问

## 部署到Cloudflare Pages

1. 将所有文件上传到GitHub私有仓库
2. 登录Cloudflare Dashboard
3. 进入Pages，点击"创建项目"
4. 连接你的GitHub仓库
5. 设置构建配置：
   - 构建命令：留空
   - 构建输出目录：`/`
6. 点击"保存并部署"

## 文件结构

```
├── index.html          # 主页
├── select.html         # 题库选择页
├── quiz.html           # 答题页面
├── styles.css          # 样式文件
├── app.js             # 核心逻辑
├── data/              # 题库数据目录
│   ├── questions-bank1.json
│   ├── questions-bank2.json
│   └── questions-bank3.json
└── README.md          # 说明文档
```

## 添加新题库

1. 在 `data/` 目录下创建新的JSON文件
2. 在 `select.html` 中添加题库信息：

```javascript
const questionBanks = [
    { id: 'bank1', name: '词汇辨析', file: 'data/questions-bank1.json' },
    { id: 'bank2', name: '你的新题库', file: 'data/questions-bank2.json' }
];
```

## 题目格式

```json
{
  "id": 1,
  "question": "题目内容",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "correctAnswer": 1,
  "explanation": "详细解析"
}
```

## 技术栈

- 纯HTML/CSS/JavaScript
- 无需后端服务器
- 无需构建工具
- 适合Cloudflare Pages静态部署

## 许可证

Private - 仅供个人使用