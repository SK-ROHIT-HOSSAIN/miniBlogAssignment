const blogModel = require("../model/blogModel")
const moment = require("moment")
let dateAndTime = moment().format('LLLL');

//----------------------------------creating blog---------------------------------------------------------//
const createBlog = async function(req, res) {
    try {
        let data = req.body
        data.publishedAt = dateAndTime
        
        if (data.isDeleted == true) {
            return res.status(400).send({ status: false, message: "cannot delete before creation" });
        }
        let blog = await blogModel.create(data)
        return res.status(201).send({ "status": true, "data": blog });
    } catch (error) {
        return res.status(500).send({status: false, msg : error.message});
    }
}


const getBlogs = async (req,res) => {
    try{
        const userId = req.params.userId;
        const data = await blogModel.find({userId : userId, isDeleted: false});
        if(!data){
            return res.status(400).send({ status: false, message: "No blogs found" });
        }
        return res.status(400).send({status: true, blogs: data});

    }
    catch(error){
        return res.status(500).send({status: false, msg : error.message});
    }
}

const updateBlogs = async(req, res) => {
   try{
    const {title, body} = req.body;
    const blogId = req.query.blogId;

    const updatedata = await blogModel.findOneAndUpdate({_id : blogId, isDeleted: false}, {$set:{title:title, body: body, publishedAt: dateAndTime}}, {new : true});
    return res.status(200).send({status: true, msg: "blog updated successfully", data: updatedata});
   }
   catch(error){
    return res.status(500).send({status: false, msg : error.message});
}
   
}

const deleteBlog = async function(req, res) {
    try {

        let blogId = req.query.blogId;
        let blog = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: dateAndTime } }, { new: true })
        if (blog == null) {
            return res.status(404).send({ status: false, message: "blog not found" })
        } else {
            return res.status(200).send({status: true, msg: "blog deleted successfully"})
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deleteBlog = deleteBlog;