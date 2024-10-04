document.addEventListener('DOMContentLoaded', () => {
    const weekCards = document.querySelectorAll('.week-card');
    
    weekCards.forEach(card => {
        const uploadBtn = card.querySelector('.upload');
        const downloadBtn = card.querySelector('.download');
        
        uploadBtn.addEventListener('click', () => handleUpload(card));
        downloadBtn.addEventListener('click', () => handleDownload(card));
    });
});

function handleUpload(card) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.click();

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const uploadedImage = document.createElement('img');
                uploadedImage.src = e.target.result;
                uploadedImage.alt = `Uploaded ${card.querySelector('h3').textContent}`;
                uploadedImage.classList.add('uploaded-image');
                
                const imageContainer = card.querySelector('.image-container');
                imageContainer.appendChild(uploadedImage);
                
                card.classList.add('uploaded');
                card.querySelector('.status').textContent = 'UPLOADED';
                card.querySelector('.status').classList.remove('not-uploaded');
                card.querySelector('.status').classList.add('uploaded');
                card.querySelector('.download').disabled = false;
                
                calculateHeight(card);
            }
            reader.readAsDataURL(file);
        }
    });
}

function handleDownload(card) {
    const img = card.querySelector('.uploaded-image');
    if (img) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = `week_${card.id.slice(-1)}_image.jpg`;
        link.click();
    }
}

function calculateHeight(card) {
    // Simulate height calculation (replace with actual image processing logic)
    const simulatedHeight = Math.random() * 10 + 10;
    card.querySelector('.height').textContent = simulatedHeight.toFixed(1);
    calculatePoints(card, simulatedHeight);
}

function calculatePoints(card, height) {
    const weekNumber = parseInt(card.id.slice(-1));
    const expectedHeight = 10 + (weekNumber * 5); // Simple expected growth model
    const difference = Math.abs(height - expectedHeight);

    let points = 0;
    if (difference <= 1) {
        points = 10;
    } else if (difference <= 2) {
        points = 5;
    }

    card.querySelector('.points').textContent = points;
}