// Nach oben Button
$(document).scroll(function() { 
var y = $(this).scrollTop(); if (y > 600) { 
$('#totop').fadeIn(); 
} else { 
$('#totop').fadeOut(); 
} // End if
});


// Zeugnisse
// Alle benötigten HTML-Elemente abrufen
        const modal = document.getElementById("meinModal");
        const modalImg = document.getElementById("modalBild");
        const captionText = document.getElementById("caption");
        const closeBtn = document.querySelector(".close");
        const zoomInBtn = document.getElementById("zoomIn");
        const zoomOutBtn = document.getElementById("zoomOut");
        const resetZoomBtn = document.getElementById("resetZoom");
        const modalContainer = document.querySelector(".modal-container");
        const prevBtn = document.getElementById("prevImage");
        const nextBtn = document.getElementById("nextImage");
        const imageIndicator = document.getElementById("imageIndicator");
        const thumbnailNav = document.getElementById("thumbnailNav");
        
        let currentZoom = 1;
        let isZoomed = false;
        let currentImages = [];
        let currentTitles = [];
        let currentImageIndex = 0;
        
        // Durch alle Vorschaubilder iterieren und einen Klick-Listener hinzufügen
        document.querySelectorAll('.zertifikat-item').forEach(item => {
            item.addEventListener('click', () => {
                const images = JSON.parse(item.dataset.images);
                const titles = JSON.parse(item.dataset.titles);
                
                openModal(images, titles);
            });
        });
        
        function openModal(images, titles) {
            currentImages = images;
            currentTitles = titles;
            currentImageIndex = 0;
            
            modal.style.display = "block";
            updateImage();
            updateNavigation();
            createThumbnails();
            resetZoom();
        }
        
        function updateImage() {
            modalImg.src = currentImages[currentImageIndex];
            captionText.innerHTML = currentTitles[currentImageIndex];
            imageIndicator.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
            
            // Thumbnails aktualisieren
            document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                thumb.classList.toggle('active', index === currentImageIndex);
            });
        }
        
        function updateNavigation() {
            prevBtn.disabled = currentImageIndex === 0;
            nextBtn.disabled = currentImageIndex === currentImages.length - 1;
            
            // Navigation nur anzeigen wenn mehrere Bilder vorhanden
            if (currentImages.length > 1) {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
                imageIndicator.style.display = 'block';
                thumbnailNav.style.display = 'flex';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                imageIndicator.style.display = 'none';
                thumbnailNav.style.display = 'none';
            }
        }
        
        function createThumbnails() {
            thumbnailNav.innerHTML = '';
            
            if (currentImages.length > 1) {
                currentImages.forEach((imgSrc, index) => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = imgSrc;
                    thumbnail.className = 'thumbnail';
                    thumbnail.addEventListener('click', () => {
                        currentImageIndex = index;
                        updateImage();
                        updateNavigation();
                        resetZoom();
                    });
                    thumbnailNav.appendChild(thumbnail);
                });
            }
        }
        
        function nextImage() {
            if (currentImageIndex < currentImages.length - 1) {
                currentImageIndex++;
                updateImage();
                updateNavigation();
                resetZoom();
            }
        }
        
        function prevImage() {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateImage();
                updateNavigation();
                resetZoom();
            }
        }
        
        // Event Listener für Navigation
        prevBtn.addEventListener('click', prevImage);
        nextBtn.addEventListener('click', nextImage);
        
        // Zoom-Funktionen
        function setZoom(zoom) {
            currentZoom = zoom;
            modalImg.style.transform = `scale(${currentZoom})`;
            
            if (currentZoom > 1) {
                modalImg.classList.add('zoomed');
                isZoomed = true;
            } else {
                modalImg.classList.remove('zoomed');
                isZoomed = false;
            }
        }
        
        function zoomIn() {
            if (currentZoom < 5) {
                setZoom(currentZoom + 0.5);
            }
        }
        
        function zoomOut() {
            if (currentZoom > 0.5) {
                setZoom(currentZoom - 0.5);
            }
        }
        
        function resetZoom() {
            setZoom(1);
            modalContainer.scrollTop = 0;
            modalContainer.scrollLeft = 0;
        }
        
        // Event Listener für Zoom-Buttons
        zoomInBtn.addEventListener('click', zoomIn);
        zoomOutBtn.addEventListener('click', zoomOut);
        resetZoomBtn.addEventListener('click', resetZoom);
        
        // Klick auf das Bild zum Zoomen
        modalImg.addEventListener('click', function(e) {
            if (!isZoomed) {
                const rect = modalImg.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const offsetX = (clickX - centerX) * 0.5;
                const offsetY = (clickY - centerY) * 0.5;
                
                setZoom(2);
                
                setTimeout(() => {
                    modalContainer.scrollLeft += offsetX;
                    modalContainer.scrollTop += offsetY;
                }, 100);
            } else {
                resetZoom();
            }
        });
        
        // Tastatur-Shortcuts
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowLeft':
                        prevImage();
                        break;
                    case 'ArrowRight':
                        nextImage();
                        break;
                    case '+':
                    case '=':
                        zoomIn();
                        break;
                    case '-':
                        zoomOut();
                        break;
                    case '0':
                        resetZoom();
                        break;
                }
            }
        });
        
        // Mausrad-Zoom
        modalContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        });
        
        // Funktion zum Schließen des Modals
        function closeModal() {
            modal.style.display = "none";
            resetZoom();
        }
        
        // Klick auf den Schließen-Button (X) schließt das Modal
        closeBtn.onclick = function() {
            closeModal();
        }
        
        // Klick auf den grauen Hintergrund schließt das Modal ebenfalls
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }