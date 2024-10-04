function getUserData() {
    return JSON.parse(localStorage.getItem('userData'));
}

// Function to update profile information
function updateProfileInfo() {
    const userData = getUserData();
    if (userData) {
        document.querySelector('.profile-name').textContent = userData.name;
        document.querySelector('.profile-id').textContent = `@${userData.username}`;
        // Update profile picture if available
        if (userData.profilePicture) {
            document.querySelector('.profile-info img').src = userData.profilePicture;
        }
    }
}

// Function to fetch crop data from the server
async function fetchCropData() {
    const userData = getUserData();
    if (!userData) return null;

    try {
        const response = await fetch(`/api/crops/${userData.id}`);
        if (!response.ok) throw new Error('Failed to fetch crop data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching crop data:', error);
        return null;
    }
}

// Function to update crop statistics
async function updateCropStats() {
    const cropData = await fetchCropData();
    if (!cropData) return;

    // Update Crop History
    const latestCrop = cropData.crops[0]; // Assume crops are sorted by date
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = latestCrop.name;
    document.querySelector('.stat-card:nth-child(1) .stat-subtitle').textContent = `Last updated: ${latestCrop.lastUpdated}`;

    // Update Crops Recorded
    const cropCount = cropData.crops.length;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = cropCount;
    document.querySelector('.stat-card:nth-child(2) .stat-subtitle').textContent = 'Total crops recorded';

    // Update Active Crops
    const activeCrop = cropData.crops.find(crop => crop.status === 'active');
    if (activeCrop) {
        const weeksSinceStart = Math.floor((Date.now() - new Date(activeCrop.startDate)) / (7 * 24 * 60 * 60 * 1000));
        document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = `${activeCrop.name}: ${weeksSinceStart} weeks`;
        document.querySelector('.stat-card:nth-child(3) .stat-subtitle').textContent = `${activeCrop.photoCount} photos uploaded`;
    } else {
        document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = 'No active crops';
        document.querySelector('.stat-card:nth-child(3) .stat-subtitle').textContent = '';
    }
}

// Function to calculate credits based on estimated crop growth
async function calculateCredits() {
    const cropData = await fetchCropData();
    if (!cropData) return;

    let totalCredits = 0;
    cropData.crops.forEach(crop => {
        // This is a simplified calculation. You would need a more complex algorithm
        // based on the type of crop, growth stage, and quality of photos.
        const baseCredits = 10; // Base credits per crop
        const growthMultiplier = crop.estimatedGrowth / 100; // Assuming estimatedGrowth is a percentage
        const cropCredits = baseCredits * growthMultiplier * crop.photoCount;
        totalCredits += cropCredits;
    });

    // Update credits display (assuming you have an element to show this)
    document.querySelector('.credits-value').textContent = Math.round(totalCredits);
}

// Function to initialize the profile page
async function initProfilePage() {
    updateProfileInfo();
    await updateCropStats();
    await calculateCredits();
}

// Event listener for page load
document.addEventListener('DOMContentLoaded', initProfilePage);

// Add event listener for the "Add" button
document.querySelector('.add-button').addEventListener('click', () => {
    // Implement the functionality for adding a new crop or photo
    console.log('Add button clicked');
});