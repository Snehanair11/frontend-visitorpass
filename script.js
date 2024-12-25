async function submitForm(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Collect form data from input fields
    const visitorName = document.getElementById('visitorName').value.trim();
    const noOfPersons = document.getElementById('noOfPersons').value.trim();
    const purpose = document.getElementById('purpose').value.trim();
    const contactNumber = document.getElementById('contactNumber').value.trim();
    const visitDate = document.getElementById('visitDate').value.trim();

    // Display element to show messages
    const formMessageElement = document.getElementById('formMessage');

    // Validate the form inputs
    if (!visitorName || !noOfPersons || !purpose || !contactNumber || !visitDate) {
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>All fields are required. Please fill out the form completely.</p>
            </div>
        `;
        return;
    }

    // Validate contact number (10 digits)
    if (!/^[0-9]{10}$/.test(contactNumber)) {
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>Invalid contact number. Please enter a valid 10-digit number.</p>
            </div>
        `;
        return;
    }

    // Validate number of persons (must be a positive number)
    if (isNaN(noOfPersons) || noOfPersons <= 0) {
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>Invalid number of persons. Please enter a valid number greater than 0.</p>
            </div>
        `;
        return;
    }

    // Prepare the form data
    const formData = {
        visitorName,
        noOfPersons: parseInt(noOfPersons, 10), // Convert 'noOfPersons' to a number
        purpose,
        contactNumber,
        visitDate,
    };

    try {
        // Show a loading message while the server processes the request
        formMessageElement.innerHTML = `
            <div class="loading-message">
                <p>Submitting your information... Please wait.</p>
            </div>
        `;

        // Make a POST request to the Render backend
        const response = await fetch('https://visitor-backend-21.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // Handle the response from the server
        if (response.ok) {
            const result = await response.json(); // Parse JSON response
            console.log('Server Response:', result);

            // Show success message and provide the E-Pass download link
            formMessageElement.innerHTML = `
                <div class="success-message">
                    <p>Thank you, ${visitorName}, for submitting your information!</p>
                    <p>You can download your E-Pass using the link below:</p>
                    <a href="${result.downloadLink}" target="_blank" class="download-link">Download E-Pass</a>
                </div>
            `;
        } else {
            // Handle server errors
            const errorResult = await response.json(); // Parse the error response
            console.error('Server Error:', errorResult);

            formMessageElement.innerHTML = `
                <div class="error-message">
                    <p>Error: ${errorResult.message || 'An unknown error occurred.'}</p>
                </div>
            `;
        }
    } catch (err) {
        // Handle client-side errors (e.g., network issues)
        console.error('Error handling form submission:', err);
        formMessageElement.innerHTML = `
            <div class="error-message">
                <p>Sorry, there was an error submitting your form. Please try again later.</p>
            </div>
        `;
    }
}
