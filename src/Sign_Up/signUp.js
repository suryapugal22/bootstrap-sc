const date = new Date();
const params = new URLSearchParams(location.search);
const id = params.get("id") ?? false;
const city = new Array();
const state = new Array();
const country = new Array();
const userEmails = new Array();
const orgNames = new Array();

const form = document.querySelector("form");
const cityInput = document.getElementById("orgCity");
const stateInput = document.getElementById("orgState");

let claim = params.get("claim") ?? false

// SET SIGN DATE ============
document.getElementById("orgDate").valueAsDate = date;


// GET COUNTRY LIST =========
countries()
    .then(res => {
        const raw = res.data[0]
        country.push(raw)
    })


// GET STATE lIST ===========
states()
    .then(res => {
        const raw = res.data;
        state.push(raw);
        return state;
    })
    .then(state => {
        const stateInput = document.getElementById("orgState");
        state[0].forEach((s) => {
            let option = document.createElement("option");
            let textNode = document.createTextNode(s.name)
            option.appendChild(textNode)
            option.setAttribute("value", s.id);
            stateInput.appendChild(option);
        })
    })


// GET CITY LIST ============
cities()
    .then(res => {
        const raw = res.data;
        city.push(raw)
        return city
    })
    .then((city) => {
        const cityInput = document.getElementById("orgCity");
        city[0].forEach((c) => {
            let option = document.createElement("option");
            let textNode = document.createTextNode(c.name);
            option.appendChild(textNode);
            option.setAttribute("value", c.id);
            option.dataset.stateId = c.state_id
            cityInput.appendChild(option);
        })
    })


// GET EMAIL LIST ============
emailList()
    .then(res => {
        const raw = res.data;
        const _raw = raw.map(r => r.email)
        userEmails.push(_raw)
    })


// GET ORGANIZATION LIST ============
organizationList()
    .then(res => {
        const raw = res.data;
        const _raw = raw.map(r => r.name)
        orgNames.push(_raw)
    })


// CHECK USER EMAIL ============
const userEmailInput = document.getElementById("userEmail");
userEmailInput.oninput = ({ target }) => {
    const { value } = target;
    if (value.length > 5) {
        const contains = userEmails[0].find((email) =>
            email.toString().toLowerCase().includes(value.toString().toLowerCase())
        )
        if (contains)
            target.classList.add("is-invalid");
        else
            target.classList.remove("is-invalid");
    }
}


// CHECK ORGANIZATION NAME ==========
const orgNameInput = document.getElementById("orgName");
orgNameInput.oninput = ({ target }) => {
    const { value } = target;
    if (value.length > 5) {
        const contains = orgNames[0].find((name) => {
            name.toString().toLowerCase().replace(/ /g, "").includes(value.toString().toLowerCase().replace(/ /g, ""));
        })
        if (contains)
            target.classList.add("is-invalid")
        else
            target.classList.remove("is-invalid")
    }
}


// UPLOAD FILE NAME ============
const orgIdDoc = document.getElementById("orgIdDoc");
const orgAddressDoc = document.getElementById("orgAddressDoc");

orgIdDoc.onchange = ({ target }) => {
    const { files } = target;
    const label = target.nextElementSibling;
    label.innerHTML = files[0].name;
}

orgAddressDoc.onchange = ({ target }) => {
    const { files } = target;
    const label = target.nextElementSibling;
    label.innerHTML = files[0].name;
}

// function validate() {
//     console.log(form);
//     const fd = new FormData();

//     const formData = new FormData(form);
//     console.log(formData.values());

//     const user = {
//         "firstName": formData.get("firstName"),
//         "lastName": formData.get("lastName"),
//         "email": formData.get("userEmail"),
//         "phone": formData.get("userContact"),
//     }

//     const organization = {
//         "type": formData.get("orgType"),
//         "name": formData.get("orgName"),
//         "email": formData.get("orgEmail"),
//         "telephone": formData.get("orgContact"),
//         "description": "",
//         "address": formData.get("orgAddress"),
//         "city": formData.get("orgCity"),
//         "state": formData.get("orgState"),
//         "country": 1,
//         "zipcode": formData.get("orgZip"),
//         "regNo": formData.get("orgRegNo"),
//         "webLink": formData.get("orgWebsite"),
//         "is_active": true,
//         "status": "Partially Submitted",
//         "created_by": "website",
//         "new_org": false,
//     }

//     const documents = {
//         "org_signature": { "signature": formData.get("orgSign"), "signature_date": formData.get("orgDate") },
//         "org_url": formData.get("orgWebsite"),
//     }

//     const attachments = new FormData();
//     attachments.append("files", formData.get("orgIdDoc"))
//     attachments.append("files", formData.get("orgAddressDoc"))

//     fd.append("user", user)
//     fd.append("organization", organization)
//     fd.append("documents", documents)
//     fd.append("attachments", attachments)

//     return fd;
// }


// function submitForm() {
//     event.preventDefault();
//     const fd = validate();
//     signUp(fd)
//         .then(res => console.log(res))
// }



const id_proof = document.querySelector("#id_proof");
const address_proof = document.querySelector("#address_proof");

const _formData = new FormData();


// Build Form Data to Submit
function buildForm() {
    let fd = {
        user: {
            "firstName": formData.get("firstName"),
            "lastName": formData.get("lastName"),
            "email": formData.get("userEmail"),
            "phone": formData.get("userContact"),
            "status": "Created"
        },
        documents: {
            documents: {
                "org_signature": { "signature": formData.get("orgSign"), "signature_date": formData.get("orgDate") },
                "org_url": formData.get("orgWebsite"),
            }
        },
        org_services: {
            services: {},
            is_active: true,
        }
    }

    if (!claim) {
        fd.organization = {
            "type": formData.get("orgType"),
            "name": formData.get("orgName"),
            "email": formData.get("orgEmail"),
            "telephone": formData.get("orgContact"),
            "description": "",
            "address": formData.get("orgAddress"),
            "city": formData.get("orgCity"),
            "state": formData.get("orgState"),
            "country": 1,
            "zipcode": formData.get("orgZip"),
            "regNo": formData.get("orgRegNo"),
            "webLink": formData.get("orgWebsite"),
            "is_active": true,
            "status": "Partially Submitted",
            "created_by": "website",
            "new_org": false,
        }
    } else {
        fd.organization = org;
        fd.organization.new_org = false;
    }
    return fd;
}

// Gather files to be uploaded to S3 Bucket
function gatherFiles(event) {
    const filesDiv = form.querySelectorAll("input[type=file]");
    let attachments = [];
    filesDiv.forEach((input) => {
        attachments.push(input.id);
        console.log(input);
        if (input.files[0])
            _formData.append('files', input.files[0])
        console.log(attachments);
    })
    _formData.append('attachments', JSON.stringify(attachments));
}


// Upload documents to AWS S3 and Get Key
async function uploadDoc(files) {
    const rawData = await multipleFileUpload(files);
    return rawData.data.responseMessage;
}


// Submitting Form Data
async function submitOnlyForm(fd) {
    signUp(fd)
        .then((res) => {
            console.log(fd);
            console.log(res.data);
            submitResponseMessage(res.data)
        })
}


// Form Submit Initiation
async function formSubmit() {
    event.preventDefault();
    const fd = buildForm();
    gatherFiles();
    console.log(fd.user);
    _formData.append('user', JSON.stringify(fd.user))
    _formData.append('organization', JSON.stringify(fd.organization))
    console.log(fd.documents.documents);
    _formData.append('documents', JSON.stringify(fd.documents))

    await signUp(_formData).then(res => {
        console.log(res);
        submitResponseMessage(res);
    })
}

// Response After submitting Form Data
function submitResponseMessage(res) {
    if (res.status === 200) {
        console.log("response" + JSON.stringify(res.data));
    } else
        console.error(res)
}




// SIGN UP WITH GOOGLE ====================================== 


function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();

    const firstName = profile.getGivenName()
    const lastName = profile.getFamilyName()
    const email = profile.getEmail();

    formData.append("firstName", firstName)
    formData.append("lastName", lastName)
    formData.append("email", email)

    console.log(formData.get('email'));
}


function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

// END SIGN UP WITH GOOD ======================================
