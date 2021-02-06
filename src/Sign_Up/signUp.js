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
const countryInput = document.getElementById("orgCountry");

let claim = params.get("claim") ?? false

// SET SIGN DATE ============
document.getElementById("orgDate").valueAsDate = date;


// GET COUNTRY LIST =========
countries()
    .then(res => {
        const raw = res.data[0]
        country.push(raw)
        return res.data
    })
    .then((country) => {
        country.forEach((s) => {
            const countryInput = document.getElementById("orgCountry");
            let option = document.createElement("option");
            let textNode = document.createTextNode(s.name)
            option.appendChild(textNode)
            option.setAttribute("value", s.id);
            countryInput.appendChild(option);
        })
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





function buildUser() {
    let user = {
        firstName: form.querySelector("#firstName").value,
        lastName: form.querySelector("#lastName").value,
        email: form.querySelector("#userEmail").value,
        phone: form.querySelector("#userContact").value,
        status: "created",
    }
    return user
}


function buildOrg() {
    let organization = {
        type: form.querySelector("#orgType").value,
        name: form.querySelector("#orgName").value,
        email: form.querySelector("#orgEmail").value,
        telephone: form.querySelector("#orgContact").value,
        regNo: form.querySelector("#orgRegNo").value,
        weblink: form.querySelector("#orgWebsite").value,
        address1: form.querySelector("#orgAddress").value,
        city: form.querySelector("#orgCity").value,
        state: form.querySelector("#orgState").value,
        country: form.querySelector("#orgCountry").value,
        zipCode: form.querySelector("#orgZip").value,

        description: null,
        is_active: true,
        status: "Partially Submitted",
        createBy: "website",
        new_org: true,
    }
    return organization;
}


function buildSign() {
    let documents = {
        documents: {
            org_url: form.querySelector("#orgWebsite").value,
            org_signature: {
                signature: form.querySelector("#orgSign").value,
                signature_date: form.querySelector("#orgDate").value,
            }
        }
    }

    return documents;
}



function submitForm() {
    event.preventDefault();


    const fd = new FormData();
    const user = buildUser();
    const organization = buildOrg();
    const documents = buildSign();
    let attachments = [];



    fd.append("user", JSON.stringify(user));
    fd.append("organization", JSON.stringify(organization));
    fd.append("documents", JSON.stringify(documents));


    if (orgIdDoc.files[0]) {
        let file = orgIdDoc.files[0]
        fd.append("files", file)
        attachments.push('id_proof')
    }


    if (orgAddressDoc.files[0]) {
        let file = orgAddressDoc.files[0]
        fd.append("files", file)
        attachments.push('address_proof')
    }


    fd.append("attachments", JSON.stringify(attachments));

    signUp(fd)
        .then(res => {
            console.log(res);
        })

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
