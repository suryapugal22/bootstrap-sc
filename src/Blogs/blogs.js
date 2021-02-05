const blogsContainer = document.getElementById("blogsContainer")
const blogsTemplate = Handlebars.compile(document.getElementById("blogsTemplate").innerHTML)

getAllBlogs()
    .then(res => {
        console.log(res);
        const blogs = res.data;
        blogsContainer.innerHTML = blogsTemplate(blogs)
    })