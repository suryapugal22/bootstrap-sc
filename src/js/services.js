const API_URL = "https://nodeapi.stem-council.com:3000/api/"


function getAllOrganizations() {
    const _url = `${API_URL}organizations/list/1/15`;
    return axios.get(_url);
}


// let serverUrl = "https://nodeapi.stem-council.com:3000/api";
let serverUrl = "https://frozen-inlet-42025.herokuapp.com/api";
// let serverUrl = "http://localhost:3000/api";


function signUp(details) {
    let url = serverUrl + `/users/signUp`;
    return axios.post(url, details);
}

function getBlogs() {
    let url = serverUrl + `/blogs`
    return axios.get(url)
}

function singleBlog(id) {
    let url = serverUrl + `/blogs/${id}`
    return axios.get(url)
}

function getNews() {
    let url = serverUrl + `/news`
    return axios.get(url)
}

function singleNews(id) {
    let url = serverUrl + `/news/${id}`
    return axios.get(url)
}

function cities() {
    let url = serverUrl + `/constants/city`;
    return axios.get(url);
}

function states() {
    let url = serverUrl + `/constants/states`;
    return axios.get(url);
}

function countries() {
    let url = serverUrl + `/constants/countries`;
    return axios.get(url);
}

function emailList() {
    let url = serverUrl + `/users/mails`;
    return axios.get(url)
}

function organizationList() {
    let url = serverUrl + `/organizations`
    return axios.get(url)
}

function organizationLimitedList(arg) {

    const { limit, pageNo, type, search, state, city, service, therapeutic, id } = arg

    let url = serverUrl + `/organizations/list/${pageNo}/${limit}`;
    let params = false

    if (type) {
        if (params)
            url += `&type=${type}`
        else {
            url += `?type=${type}`
            params = true
        }
    }

    if (state) {
        if (params)
            url += `&state=${state}`
        else {
            url += `?state=${state}`
            params = true
        }


    }

    if (city) {
        if (params)
            url += `&city=${city}`
        else {
            url += `?city=${city}`
            params = true
        }

    }

    if (service)
        if (params)
            url += `&service=${service}`
        else {
            url += `?service=${service}`
            params = true
        }


    if (search)
        if (params)
            url += `&search=${search}`
        else
            url += `?search=${search}`

    if (therapeutic) {
        if (params)
            url += `&therapeutic=${therapeutic}`
        else {
            url += `?therapeutic=${therapeutic}`
            params = true
        }

    }


    if (id)
        if (params)
            url += `&id=${id}`
        else
            url += `?id=${id}`


    return axios.get(url);
}

function singleOrganization(id, type, source = "SAGE") {
    let url = serverUrl + `/organizations/${id}`
    if (type) {
        url = url + `/search?source=${source}&type=${type}`
    }
    return axios.get(url)
}

function organizationType(type) {
    let url = serverUrl + `/organizations?type=${type}`
    return axios.get(url)
}

function uploadFile(data) {
    let url = serverUrl + "/aws/s3/upload";
    return axios.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

function multipleFileUpload(data) {
    let url = serverUrl + '/aws/s3/uploadFiles';
    return axios.post(url, data, {
        header: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

function services() {
    let url = serverUrl + '/common/servicelist';
    return axios.get(url)
}

function getTherapeuticList() {
    const url = serverUrl + '/common/getalltherapeutics';
    return axios.get(url)
}

