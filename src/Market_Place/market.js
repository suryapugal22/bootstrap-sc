//  HANDLEBARS CONTAINERS ========================
const organizationContainer = document.querySelector("#organizationContainer");


// HANDLEBARS TEMPLATES ==========================
const organizationTemplate = Handlebars.compile(document.querySelector("#organizationsTemplate").innerHTML);



// HANDLEBARS CUSTOM HELPERS =====================
Handlebars.registerHelper('trim', (string) => {
    return string.replace(/\s+/g, "");
})

//  VARIABLES DECLARATION ========================

let stateList = {
    "state": [
        "Tamil Nadu",
        "Delhi",
        "Rajasthan",
        "option 3",
        "option 4",
        "option 5",
        "option 6",
        "option 7",
        "option 8"
    ]
}
let serviceList = {
    "services": [
        "Phase I",
        "Phase II",
        "Phase III",
        "Phase IV",
        "Phase I-A",
        "option 6",
        "option 7",
        "option 8",
        "option 9",
        "option 10"
    ],
}
let cityList = {
    "city": [
        "Phase I",
        "Phase II",
        "Phase III",
        "Phase IV",
        "Phase I-A",
        "option 6",
        "option 7",
        "option 8",
        "option 9",
        "option 10"
    ],
}
let therapeuticList = {
    "therapeutic": [
        "Phase I",
        "Phase II",
        "Phase III",
        "Phase IV",
        "Phase I-A",
        "option 6",
        "option 7",
        "option 8",
        "option 9",
        "option 10"
    ],
}

const filter_modal = document.querySelector('.filter-content');

let service_input,
    state_input,
    city_input,
    therapeutic_input;


const service_container = filter_modal.querySelector('#filter-services-options'),
    state_container = filter_modal.querySelector('#filter-state-options'),
    city_container = filter_modal.querySelector('#filter-city-options'),
    therapeutic_container = filter_modal.querySelector('#filter-therapeutic-options'),

    service_template = Handlebars.compile(filter_modal.querySelector('#filter-services-options-template').innerHTML),
    state_template = Handlebars.compile(filter_modal.querySelector('#filter-state-options-template').innerHTML),
    city_template = Handlebars.compile(filter_modal.querySelector('#filter-city-options-template').innerHTML),
    therapeutic_template = Handlebars.compile(filter_modal.querySelector('#filter-therapeutic-options-template').innerHTML);


let selected = {
    type: [],
    service: [],
    location: {},
    therapeutic: []
}

let params = new URLSearchParams(location.search),
    pageNo = params.get("page") ? params.get("page") : 1;


//  FUNCTIONS ====================================

async function getData(limit = 15) {
    const type = selected.type
    const services = selected.service
    const therapeutic = selected.therapeutic
    const state = Object.keys(selected.location)
    const city = state.map(sId => { return selected.location[sId] })

    const arg = {
        limit,
        pageNo,
        'search': search.value,
        'type': type.toString(),
        'state': state.toString(),
        'city': city.toString(),
        'service': services.toString(),
        'therapeutic': therapeutic.toString(),
    };

    await organizationLimitedList(arg)
        .then(raw => raw.data)
        .then(data => {
            organizationContainer.innerHTML = organizationTemplate(data);
            clampDesc();
        });
}


getData();
groupType();


function clampDesc() {
    let group_desc = document.querySelectorAll('.about_us')
    group_desc.forEach((b) => {
        $clamp(b, { clamp: 3 });
    })
}



function serviceInputFn(event) {
    let _serviceList = {
        "services": []
    }
    const target = event.target;
    const value = target.value
    console.log(value);
    _serviceList['services'] = serviceList['services'].filter(s => {
        if (s.name.toLowerCase().trim().includes(value.toLowerCase().trim()))
            return s
    })
    service_container.innerHTML = service_template(_serviceList);
}


function stateInputFn(event) {
    const _stateList = filter_modal.querySelectorAll('input[name=state]')

    const { value } = event.target;

    _stateList.forEach(c => {
        const contains = c.dataset.name.toLowerCase().replace(/\s+/g, "").includes(value.toLowerCase().replace(/\s+/g, ""))
        if (contains) {
            // console.log("false");
            c.parentElement.style.position = "relative";
            c.parentElement.style.zIndex = '1';
            c.parentElement.style.opacity = '1';
        } else {
            c.parentElement.style.position = "absolute";
            c.parentElement.style.zIndex = '-1';
            c.parentElement.style.opacity = '0';
        }
    })
    groupState();
}


function cityInputFn(event) {
    const _cityList = filter_modal.querySelectorAll('input[name=city]')

    const { value } = event.target;

    _cityList.forEach(c => {
        if (c.dataset.name.toLowerCase().replace(/\s+/g, "").includes(value.toLowerCase().replace(/\s+/g, ""))) {
            c.parentElement.style.position = "relative";
            c.parentElement.style.zIndex = '1';
            c.parentElement.style.opacity = '1';
        } else {
            c.parentElement.style.position = "absolute";
            c.parentElement.style.zIndex = '-1';
            c.parentElement.style.opacity = '0';
        }
    })
    groupCity();
}


function therapeuticInputFn(event) {
    const _therapeuticList = filter_modal.querySelectorAll('input[name=therapeutic]')
    const { value } = event.target

    _therapeuticList.forEach(c => {
        if (c.dataset.name.toLowerCase().replace(/\s+/g, "").includes(value.toLowerCase().replace(/\s+/g, ""))) {
            // console.log("false");
            c.parentElement.style.position = "relative";
            c.parentElement.style.zIndex = '1';
            c.parentElement.style.opacity = '1';
        } else {
            c.parentElement.style.position = "absolute";
            c.parentElement.style.zIndex = '-1';
            c.parentElement.style.opacity = '0';
        }
    })
    groupTherapeutic();
}



cities()
    .then(async res => {
        cityList.city = await res.data
        city_container.innerHTML = city_template(cityList)
        groupCity();
        city_input = filter_modal.querySelector('#filter-city')
        city_input.oninput = cityInputFn
    })


states()
    .then(async res => {
        stateList.state = await res.data
        state_container.innerHTML = state_template(stateList)
        groupState();
        state_input = filter_modal.querySelector('#filter-state')
        state_input.oninput = stateInputFn
    })


services()
    .then(async res => {
        serviceList.services = await res.data
        service_container.innerHTML = await service_template(serviceList)
        groupServices();
        service_input = await filter_modal.querySelector('#filter-services')
        console.log(" got input");
        console.log(service_input);
        service_input.oninput = serviceInputFn;
    })
// .then(() => {
//     service_input.onchange = serviceInputFn;
// })

getTherapeuticList()
    .then(async res => {
        therapeuticList.therapeutic = await res.data;
        therapeutic_container.innerHTML = await therapeutic_template(therapeuticList)
        groupTherapeutic();
        therapeutic_input = await filter_modal.querySelector('#filter-therapeutic')
        therapeutic_input.oninput = therapeuticInputFn;
    })




window.onloadstart = () => {
    console.log(service_input);
}



function groupType() {
    console.log("groupType");
    const _groupTypes = document.getElementsByName("type")
    _groupTypes.forEach(g => {
        g.onclick = () => {
            if (g.checked)
                selected.type.push(g.value)
            else {
                let index = selected.type.indexOf(g.value);
                selected.type.splice(index, 1)
            }
            console.log(selected.type)
            getData();
        }
    })
}



function groupTherapeutic() {
    event.stopPropagation()
    const _therapeutic = document.getElementsByName("therapeutic");
    console.log(_therapeutic.length);
    _therapeutic.forEach(s => {
        s.onclick = () => {
            if (s.checked)
                selected.therapeutic.push(s.value)
            else {
                let index = selected.therapeutic.indexOf(s.value);
                selected.therapeutic.splice(index, 1)
            }
            getData()
        }
    })
}

function groupServices() {
    event.stopPropagation()
    const _services = document.getElementsByName("service");
    console.log(_services.length);
    _services.forEach(s => {
        s.onclick = () => {
            if (s.checked)
                selected.service.push(s.value)
            else {
                let index = selected.service.indexOf(s.value);
                selected.service.splice(index, 1)
            }
            getData()
        }
    })
}

function groupState() {
    event.stopPropagation()
    const _state = document.getElementsByName('state')
    console.log(_state.length);
    _state.forEach(s => {
        s.onclick = () => {
            const value = s.value
            if (s.checked) {
                selected.location[value] = []
            } else {
                delete selected.location[value]
            }
            getData()
        }
    })
}

async function groupCity() {
    event.stopPropagation()
    let _city = filter_modal.querySelectorAll('input[name=city]');
    console.log(_city.length);
    await _city.forEach(s => {

        const StateId = s.dataset.state
        const value = s.value

        s.onclick = () => {
            console.log(s);
            if (s.checked) {

                if (selected.location[StateId])
                    selected.location[StateId].push(value)
                else
                    selected.location[StateId] = [value]

            } else {

                let selectedIndex = selected.location[StateId].indexOf(value)
                console.log(selectedIndex);

                if (selectedIndex >= 0)
                    selected.location[StateId].splice(selectedIndex, 1)

                if (selected.location[StateId].length === 0) {
                    delete selected.location[StateId]
                }

            }
            // markChecked();
            getData()
        }
    })
    console.log('groupCity-END');
}


// STICKY SIDEBAR ============================
// let sidebar = new StickySidebar('#sidebar', {
//     containerSelector: '#main-content',
//     innerWrapperSelector: '.sidebar__inner',
//     topSpacing: 20,
//     bottomSpacing: 20
// });

