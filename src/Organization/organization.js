const params = new URLSearchParams(location.search);
const blog = {
    type: params.get("t"),
    id: params.get("i"),
    source: params.get("s"),
};
const headerContainer = document.getElementById("header-container")
const bodyContainer = document.getElementById("body-container")
const bodyContainer2 = document.getElementById("body-container-2")

const headerTemplate = Handlebars.compile(document.getElementById("header-template").innerHTML)
const bodyTemplate = Handlebars.compile(document.getElementById("body-template").innerHTML)
const bodyTemplate2 = Handlebars.compile(document.getElementById("body-template-2").innerHTML)



Handlebars.registerHelper('stat', (val) => {
    if (val !== "Partially Submitted")
        return true
    return false
})



async function getData(id) {
    const pageNo = 1
    const limit = 1
    await organizationLimitedList({ limit, pageNo, id }).then(res => {
        const rawData = res.data
        const info = rawData.results[0]
        console.log(info);
        document.querySelector("title").innerHTML = info.name
        headerContainer.innerHTML = headerTemplate(info)
        bodyContainer.innerHTML = bodyTemplate(info)
        bodyContainer2.innerHTML = bodyTemplate2(info)
    })
}


getData(blog.id);