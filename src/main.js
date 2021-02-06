const blogsContainer = document.getElementById("blogsContainer")
const blogsTemplate = Handlebars.compile(document.getElementById("blogsTemplate").innerHTML)

getAllBlogs()
    .then(res => {
        console.log(res);
        const blogs = res.data;
        blogs.length = 3
        blogsContainer.innerHTML = blogsTemplate(blogs)
        clampDesc()
    })

function clampDesc() {
    let group_desc = document.querySelectorAll('.clamp')
    group_desc.forEach((b) => {
        $clamp(b, { clamp: 3 });
    })
}