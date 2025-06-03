// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
          window.scrollTo({
              top: targetElement.offsetTop - 60, // Adjust for fixed header height
              behavior: 'smooth'
          });
      }
  });
});

// Contact Form Submission (Example Handler)
const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Simple validation
  if (name && email && message) {
      alert(`Thank you, ${name}! Your message has been sent.`);
      form.reset();
  } else {
      alert('Please fill out all fields.');
  }
});

// Dynamic Year in Footer
const yearSpan = document.createElement('span');
yearSpan.textContent = new Date().getFullYear();
document.querySelector('footer p').append(` ${yearSpan.textContent}`);

// Read More Functionality
document.querySelectorAll('.read-more-btn').forEach(button => {
  button.addEventListener('click', function () {
      const content = this.previousElementSibling; // Target the content before the button

      if (content.classList.contains('expanded')) {
          content.classList.remove('expanded'); // Hide the content
          this.textContent = 'Read More'; // Update button text
      } else {
          content.classList.add('expanded'); // Show the content
          this.textContent = 'Read Less'; // Update button text
      }
  });
});