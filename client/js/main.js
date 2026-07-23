// Sticky Navbar

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("sticky");

    } else {

        header.classList.remove("sticky");

    }

});


// Counter Animation

const counters = document.querySelectorAll(".stats h2");

let started = false;

window.addEventListener("scroll", () => {

    const stats = document.querySelector(".stats");

    if (!stats) return;

    if (window.scrollY > stats.offsetTop - 500 && !started) {

        started = true;

        counters.forEach(counter => {

            const text = counter.innerText;

            const number = parseInt(text.replace(/\D/g, ""));

            const suffix = text.replace(/[0-9]/g, "");

            let current = 0;

            const increment = Math.ceil(number / 100);

            const timer = setInterval(() => {

                current += increment;

                if (current >= number) {

                    counter.innerText = number + suffix;

                    clearInterval(timer);

                } else {

                    counter.innerText = current + suffix;

                }

            }, 20);

        });

    }

});


// Fade In Animation

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: .2

});

document.querySelectorAll("section").forEach(section => {

    section.classList.add("hidden");

    observer.observe(section);

});

const trackingForm = document.getElementById("trackingForm");

if (trackingForm) {

    trackingForm.addEventListener("submit", function(e){

        e.preventDefault();

        const tracking = document.getElementById("trackingNumber").value.trim();

        if(!tracking){

            alert("Please enter a tracking number.");

            return;

        }

        window.location.href =
        `pages/tracking.html?tracking=${tracking}`;

    });

}