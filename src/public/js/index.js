document.addEventListener('DOMContentLoaded', () => {
    const cartIdInput = document.getElementById('cartIdInput');
    const errorMessage = document.getElementById('errorMessage'); // Get the global error message element

    document.addEventListener('click', async function (e) {
        if (e.target && e.target.className === 'addToCartBtn') {
            const productId = e.target.getAttribute('data-product-id');
            const cartId = cartIdInput.value;

            if (!cartId || cartId == '') {
                // Show the "Please enter a Cart ID" message globally
                errorMessage.innerText = 'Please enter a Cart ID.'; // Update the error message text
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000); // 3000 milliseconds = 3 seconds
                return; // Exit the function early if cartId is empty
            }

            // If Cart ID is provided, hide the global error message
            errorMessage.style.display = 'none';

            // Check if the Cart ID is a valid ObjectId (24 hex characters)
            if (!/^[0-9a-fA-F]{24}$/.test(cartId)) {
                // Show an error message if the Cart ID is not valid
                errorMessage.innerText = 'Invalid Cart ID.';
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000); // 3000 milliseconds = 3 seconds
                return; // Exit the function early if the Cart ID is invalid
            }

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                });

                const data = await response.json();

                if (response.status !== 200) {
                    throw new Error(data.error || 'Error adding product to cart.');
                }

                // Show the success message next to the specific product
                const productIndex = e.target.getAttribute('data-product-index');
                const successMessage = document.querySelector(`.successMessage[data-product-index="${productIndex}"]`);
                successMessage.innerText = 'Product added to the cart successfully!';
                successMessage.style.display = 'block';

                // Hide the success message after a delay (e.g., 3 seconds)
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000); // 3000 milliseconds = 3 seconds
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    });
});
