/**
 * The class that manages an InfoCard.
 */
class InfoCard {
    card;
    tracking;
    customTask;
    lastTranslation;

    /**
     * Creates a new InfoCard object.
     * @param {String} cardId The element ID anywhere in the DOM (preferrably paired with the info-card class and located in the info-cards section)
     * @param {String} trackingId The section anywhere in the DOM which the InfoCard element will follow
     * @param {Function} customTask A function to run after the default update routines are ran
     */
    constructor(cardId, trackingId, customTask) {
        this.lastTranslation = 0;
        this.card = document.getElementById(cardId);
        this.tracking = document.getElementById(trackingId);
        if (customTask) {
            this.customTask = customTask;
        } else {
            this.customTask = new Function();
        }
    }

    update() {
        if (!this.card || !this.tracking) {
            return;
        }

        const trackingBounds = this.tracking.getBoundingClientRect();
        const cardBounds = this.card.getBoundingClientRect();

        const minY = trackingBounds.y;
        const maxY = minY + trackingBounds.height - cardBounds.height;

        const centeredY = (window.innerHeight/2) - (cardBounds.height/2); // The y position where the card would be perfectly centered on the Y axis of the screen

        const desiredY = Math.min(Math.max(centeredY, minY), maxY); // Desired centered position accounting for the tracking bounds

        const newTranslation = this.lastTranslation + desiredY - cardBounds.y;

        this.card.style.transform = `translateY(${newTranslation}px)`;

        this.lastTranslation = newTranslation;
        
        this.customTask();
    }
}