const express = require("express");
const router = express.Router();

// 게시글 작성 API - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
const Posts = require("../schemas/post")
router.post('/posts/', async (req, res) => {
    const {title, userName, password, content, createdAt} = req.body;
    const createdPosts = await Posts.create({title, userName, password, content, createdAt});

    res.json({post: createdPosts})
})

// 전체 게시글 목록 조회 API - 제목, 작성자명, 작성 날짜 조회하기 / 작성 날짜 기준으로 내림차순 정렬 (최신순)
router.get('/posts/', async (req, res) => {
    const posts = await Posts
                    .find({},{_id: 0, title: 1, userName: 1, createdAt: 1})
                    .sort({createdAt: -1});
    res.json({posts: posts})
})

// 게시글 조회 API - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기
router.get('/posts/:_id', async (req, res) => {
    const {_id} = req.params;
    const posts = await Posts.findById(_id)

    res.json({posts: posts})
})

// 게시글 수정 API - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
router.put('/posts/:_id', async (req, res) => {
    const {_id} = req.params;
    const {password, content} = req.body;

    const existsPassword = await Posts.findOne({_id: _id})
    const savedPassword = existsPassword.password

    if (savedPassword !== password) {
        return res.status(400).json({messgae: '비밀번호가 틀렸습니다.'}) 
    } else {
        await Posts.updateOne(
        {_id: _id},
        {$set: {content: content}}
        )
    }
    res.status(200).json({message: '게시글 수정 완료'})
})

// 게시글 삭제 API - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
router.delete('/posts/:_id', async (req, res) => {
    const {_id} = req.params;
    const {password} = req.body;

    const existsPassword = await Posts.findOne({_id: _id})
    const savedPassword = existsPassword.password

    if (savedPassword !== password) {
        return res.status(400).json({messgae: '비밀번호가 틀렸습니다.'}) 
    } else {
        await Posts.deleteOne({_id: _id})
    }
    res.status(200).json({message: '게시글 삭제 완료'})
})


module.exports = router;