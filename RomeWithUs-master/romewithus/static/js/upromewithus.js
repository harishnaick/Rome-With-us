function populateForm(no) {

    const carModel = document.getElementById(`carModel${no}`).textContent.trim();
    const carCost = document.getElementById(`carCost${no}`).textContent.split('$')[1].split(' ')[0].trim();

    // Set the values in the form
    document.getElementById('car_model').value = carModel;
    document.getElementById('car_cost').value = carCost;
}

function toggleDriverSelection() {
    const driverNeeded = document.querySelector('input[name="driver_required"]:checked').value;
    const driverSelection = document.getElementById('driver_selection');

    if (driverNeeded === 'yes') {
        driverSelection.disabled = false;
    } else {
        driverSelection.disabled = true;
        driverSelection.selectedIndex = 0; // Reset selection
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Show modal after 2 seconds

    const signInFormWrapper = document.getElementById('signInFormWrapper');
    const createAccountFormWrapper = document.getElementById('createAccountFormWrapper');
    const showCreateAccountForm = document.getElementById('showCreateAccountForm');
    const showSignInForm = document.getElementById('showSignInForm');
    const signinloadE1 = document.getElementById("signinload");
    // Show Create Account Form
    signinloadE1.addEventListener("click", function() {
        createAccountFormWrapper.classList.add('hidden');
        signInFormWrapper.classList.remove('hidden');
    })
    showCreateAccountForm.addEventListener('click', function(event) {
        event.preventDefault();
        signInFormWrapper.classList.add('hidden');
        createAccountFormWrapper.classList.remove('hidden');
    });

    // Show Sign In Form
    showSignInForm.addEventListener('click', function(event) {
        event.preventDefault();
        createAccountFormWrapper.classList.add('hidden');
        signInFormWrapper.classList.remove('hidden');
    });

    toggleDriverSelection(); // Set initial state

    // Add event listener for radio button change
    const driverRadios = document.querySelectorAll('input[name="driver_required"]');
    driverRadios.forEach(radio => {
        radio.addEventListener('change', toggleDriverSelection);
    });

    // Set min date for rental dates
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var minDate = year + '-' + month + '-' + day;
    document.getElementById('rental_start_date').setAttribute('min', minDate);
    document.getElementById('rental_end_date').setAttribute('min', minDate);

    document.getElementById('rental_start_date').addEventListener('change', function() {
        var startDate = new Date(this.value);
        var nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);
        var returnMinDate = nextDay.toISOString().split('T')[0];
        document.getElementById('rental_end_date').setAttribute('min', returnMinDate);
    });

    document.getElementById('rental_end_date').addEventListener('change', function() {
        var startDate = new Date(document.getElementById('rental_start_date').value);
        var endDate = new Date(this.value);
        if (startDate > endDate) {
            this.value = ""; // Clear the selected end date
        }
    });

});