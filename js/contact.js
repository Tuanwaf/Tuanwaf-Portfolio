document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contactForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        let formData = new FormData(this);

        fetch("http://tuanwafportfolio.nichesite.org/?i=1/send_email.php", { // Use full domain
            method: "POST",
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                console.log("Response from server:", data); // Debugging line

                if (data.trim() === "success") {
                    alert("✅ Your message has been sent successfully!");
                    document.getElementById("contactForm").reset();
                } else {
                    alert("❌ Failed to send message: " + data);
                }
            })
            .catch(error => console.error("Error:", error));
    });
});
