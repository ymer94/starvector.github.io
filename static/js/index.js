// Get all images inside figures
const images = document.querySelectorAll('figure img'), modal = document.getElementById('imageModal'),
    modalImg = document.getElementById('modalImg'), modalCaption = document.getElementById('modalCaption'),
    closeBtn = document.querySelector('.close'),  imageWrapper = document.querySelector('.image-wrapper'),
    zoomControls = document.createElement('div');

// Create zoom controls
zoomControls.className = 'zoom-controls';
zoomControls.innerHTML = `
  <button class="zoom-btn zoom-out">−</button>
  <button class="zoom-btn zoom-reset">⟲</button>
  <button class="zoom-btn zoom-in">+</button>
`;
modal.appendChild(zoomControls);

const zoomInBtn = modal.querySelector('.zoom-in'), zoomOutBtn = modal.querySelector('.zoom-out'), zoomResetBtn = modal.querySelector('.zoom-reset');

let currentZoom = 1, posX = posY = startPosX = startPosY = 0, isPanning = false;

// Update image position
function updateImagePosition() {
  modalImg.style.transform = `translate(${posX}px, ${posY}px) scale(${currentZoom})`;
}

// Reset zoom and position
function resetZoomAndPosition() {
  currentZoom = 1, posX = posY = 0;
  updateImagePosition();
}

// Default zoom action function.
function zoom(direction, step = .25) {
    const MIN = .5, MAX = MIN * 10;

    step = Math.abs(step);

    switch (direction) {
        case 'in':
            currentZoom < MAX ? currentZoom += step : currentZoom = MAX;
            return;
        case 'out':
            currentZoom > MIN ? currentZoom -= step : currentZoom = MIN;
            return;
        default:
            return;
    }
}

// Zoom in function
function zoomIn(step = .25) {
    zoom('in', step);
}

// Zoom out function
function zoomOut(step = .25) {
    zoom('out', step);
  
    // Gradually move toward center when zooming out
    if (currentZoom <= 1.5) {
        const centeringFactor = Math.round(1 - ((1.5 - currentZoom) / 0.5));

        currentZoom <= 1 ? posX = posY = 0 : posX *= centeringFactor, posY *= centeringFactor;
    }
}

// Add click event to all images
images.forEach(img => {
  img.addEventListener('click', function() {
    // Reset zoom level and position
    resetZoomAndPosition();
    
    // Set image source
    modalImg.src = this.src;
    
    // Get the figcaption if it exists
    const figcaption = this.closest('figure').querySelector('figcaption');

    !figcaption ? modalCaption.innerHTML = this.alt : modalCaption.innerHTML = figcaption.innerHTML;
    
    // Show modal with animation
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
  });
});

// Zoom in function
zoomInBtn.addEventListener('click', () => { zoomIn(); updateImagePosition() });

// Zoom out function
zoomOutBtn.addEventListener('click', () => { zoomOut(); updateImagePosition() });

// Reset zoom
zoomResetBtn.addEventListener('click', resetZoomAndPosition);

// Mouse wheel zoom
imageWrapper.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    // Get mouse position relative to the image center
    const rect = modalImg.getBoundingClientRect(), mouseX = e.clientX - (rect.left + rect.width/2), mouseY = e.clientY - (rect.top + rect.height/2),
        oldZoom = currentZoom, factor = 1.1;
    
    if (e.deltaY < 0) {
        // Zoom in
        currentZoom *= factor;
        zoomIn(currentZoom - oldZoom);

        // Adjust position to zoom toward mouse position (only when zooming in)
        if (currentZoom > 1) {
            // Calculate the position adjustment based on mouse position and zoom change
            const posChange = 1 - oldZoom / currentZoom;

            posX += mouseX * posChange;
            posY += mouseY * posChange;
        }
    } else {
        // Zoom out
        currentZoom /= factor;
        zoomOut(oldZoom - currentZoom);
    }

    updateImagePosition();
});

// Pan image with mouse drag
modalImg.addEventListener('mousedown', function(e) {
  if (currentZoom <= 1) return; // Only allow panning when zoomed in
  
  e.preventDefault();
  isPanning = true;
  modalImg.classList.add('panning');
  startPosX = e.clientX - posX;
  startPosY = e.clientY - posY;
});

document.addEventListener('mousemove', function(e) {
  if (!isPanning) return;
  
  posX = e.clientX - startPosX;
  posY = e.clientY - startPosY;
  updateImagePosition();
});

document.addEventListener('mouseup', function() {
  isPanning = false;
  modalImg.classList.remove('panning');
});

// Touch support for mobile devices
modalImg.addEventListener('touchstart', function(e) {
  if (currentZoom <= 1) return;
  
  isPanning = true;
  modalImg.classList.add('panning');
  startPosX = e.touches[0].clientX - posX;
  startPosY = e.touches[0].clientY - posY;
});

document.addEventListener('touchmove', function(e) {
  if (!isPanning) return;
  
  posX = e.touches[0].clientX - startPosX;
  posY = e.touches[0].clientY - startPosY;
  updateImagePosition();
});

document.addEventListener('touchend', function() {
  isPanning = false;
  modalImg.classList.remove('panning');
});

// Close modal when clicking the × button
closeBtn.addEventListener('click', function() {
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
});

// Close modal when clicking outside the image
modal.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
  }
});

// Script to delay video playback 
document.addEventListener('DOMContentLoaded', function() {
  const heroVideo = document.getElementById('hero-video');
  
  // Pause the video initially (even though autoplay is set)
  heroVideo.pause();
  
  // Start playing after 5 seconds
  setTimeout(function() {
    heroVideo.play();
  }, 5000);
  
  // Add hover effect - pause on hover
  heroVideo.addEventListener('mouseenter', function() {
    heroVideo.pause();
  });
  
  // Resume playing when mouse leaves
  heroVideo.addEventListener('mouseleave', function() {
    heroVideo.play();
  });
});