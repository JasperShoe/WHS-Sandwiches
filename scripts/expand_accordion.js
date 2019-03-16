// This javascript function expands/collapses the "accordions".
function expand() {

    // Loop through each of the accordions on the doc
    const acc = document.getElementsByClassName('accordion'); // Get the five accordion elements.
    for (let i = 0; i < acc.length; i++) {

        // Add a click lister that will execute the inside function whenever the accordion is clicked on.
        acc[i].addEventListener("click", function () {

            // Everything in here will execute whenever an accordion is clicked.
            this.classList.toggle("active");
            let panel = this.nextElementSibling;
            while (panel) { // While the next element exists
                if (panel.style.maxHeight) { // If the panel has a maxHeight (meaning it's open), then close it
                    panel.style.maxHeight = null;
                } else { // If the panel doesn't have a maxHeight, it is closed.
                    panel.style.maxHeight = panel.scrollHeight + "px"; // This opens the panel.
                }

                // Keep going to the next element to open it until we hit the next accordion (which will be a button).
                // If we hit a button, terminate the while loop by setting the panel to null.
                if (panel.nextElementSibling === null)
                    panel = null;
                else if (panel.nextElementSibling.nodeName.toLowerCase() === "button")
                    panel = null;
                else
                    panel = panel.nextElementSibling;
            }
        });
    }
}

// Delays the calling of expand() so that it doesn't execute before our html is fully loaded.
setTimeout(expand, 1000);

