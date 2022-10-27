
const body = document.querySelector('body');
const header = document.querySelector('header');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

const form = document.querySelector('form');


const slider_viewer = document.querySelector('.sliderviewer');
const slider_viewer_image = slider_viewer.querySelector('.sliderviewer-image');
const slider_viewer_close = slider_viewer.querySelector('.sliderviewer-close');

const navbar = header.querySelector('nav');
const btn_navigation = document.getElementById('navtoggle');

function handleNavbar(event) {
    const navbar_link_list = navbar.querySelector('ul');
    navbar_link_list.classList.toggle('active');
}

btn_navigation.addEventListener('click', handleNavbar);


function togglePageContent() {
    body.classList.toggle('overlay-open');
}


function toggleSliderViewer(targetImg) {
    slider_viewer.classList.toggle('active');
    if (slider_viewer.classList.contains('active')) {
        slider_viewer_image.src = targetImg.src;
    }
    togglePageContent();
}

function viewImage(event) {
    toggleSliderViewer(event.target);
}

slider_viewer_close.addEventListener('click', toggleSliderViewer);
document.addEventListener('keydown', event => {
    if (event.code === "Escape" && slider_viewer.classList.contains('active')) {
        toggleSliderViewer();
    }
})

const slider_list = document.querySelectorAll('.slider');

slider_list.forEach((slider, sliderIndex) => {
    const item_list = slider.querySelectorAll('ul li');

    item_list.forEach((item, itemIndex) => {
        item.setAttribute('id', `slider${sliderIndex}_${itemIndex + 1}`)
        const img = item.querySelector('img');
        img.addEventListener('click', viewImage);
    });

    // const slider_btn_right = slider.querySelector('.slider-buttons .slider-button--right');
    // if (slider_btn_right) {
    //     slider_btn_right.addEventListener('click', (event) => { console.log(event); });
    // }
});

function handleFormBehavior() {
    console.log('handle');
    const fieldSupportingTexts = document.querySelectorAll('.input-container input~small.feedback');

    fieldSupportingTexts.forEach(feedbackText => {
        feedbackText.classList.remove('is-valid');
        feedbackText.classList.remove('is-invalid');
        feedbackText.innerText = '';
    });
}

async function responseHandle(request) {
    handleFormBehavior();

    const requestJson = await request.json();
    const responses = requestJson.response;

    if (request.status === 200) {
        console.log(responses);
    } else {
        responses.forEach(response => {
            if (response.name === 'data') {
                console.log(response);
            } else {
                if (response.name === 'error') {
                    Object.entries(response.reason).forEach(([key, value]) => {

                        const field = document.querySelector('input[name="name"]');

                        if (field) {
                            const supportingText = document.querySelector(`input[name="${value['field']}"]~small.feedback`);

                            if (supportingText) {
                                supportingText.innerHTML = value['message'];
                                supportingText.classList.toggle('is-invalid');
                            }
                        }
                    });
                }
            }
        });
    }
}

async function submitForm(data) {
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: data,
        });
        const result = response;
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function handleForm(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const response = await submitForm(data);

    responseHandle(response);
}


form.addEventListener('submit', handleForm);