setTimeout(() => {
        // Get the controls div and the horizontal-bar div
    const controlsDiv = document.querySelector('.controls');
    const horizontalBarDiv = document.querySelector('.horizontal-bar');

    // Append the controls div inside the horizontal-bar div
    horizontalBarDiv.appendChild(controlsDiv);

}, 700);