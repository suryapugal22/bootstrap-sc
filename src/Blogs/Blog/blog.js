const params = new URLSearchParams(location.href);
const i = params.get("i")
const url = location.href

const blogsContainer = document.getElementById("blogsContainer")
const blogsTemplate = Handlebars.compile(document.getElementById("blogsTemplate").innerHTML)


Handlebars.registerHelper('dt', (time) => {
    return moment(time).format("MMM Do YY");
})



function copyUrl() {
    // url.select()
    // url.setSelectionRange(0, 99999);
    // document.execCommand("copy");
    // alert("Copied URL");
}


getSingleBlog(i)
    .then(res => {
        let result = res.data;
        result.link = url;
        blogsContainer.innerHTML = blogsTemplate(result)
    })

