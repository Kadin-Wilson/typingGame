export class Menu {
    /**
     * Creates a menu object coresponding to an html element
     * Menu is added to the document but not displayed
     *
     * call show on the object to display the menu
     * call hide on the object to hide the menu
     *
     * clicking a menu button hides the menu
     *
     * x - x position of the menu
     * y - y position of the menu
     * width - width of the menu
     * height - height of the menu
     * label - text of the menu
     * ...buttons - menu button in the form of {label, callback}
     */
    constructor(x, y, width, height, label, ...buttons) {
        // create menu element
        this.menu = document.createElement("div");
        this.menu.className = "menu";
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;
        this.menu.style.width = `${width}px`;
        this.menu.style.height = `${height}px`;
        this.menu.style.display = 'none';

        // add label
        let labelElm = document.createElement("div");
        labelElm.className = "label";
        let labelText = document.createElement("p");
        labelText.innerHTML = label;
        labelElm.appendChild(labelText);
        this.menu.appendChild(labelElm);

        // add buttons
        let buttonContainer = document.createElement("div");
        buttonContainer.className = "buttonContainer";
        for (let button of buttons) {
            let buttonElm = document.createElement("button");
            buttonElm.innerHTML = button.label;
            buttonElm.addEventListener('click', e => {
                this.hide();
                button.callback(e);
            });
            buttonContainer.appendChild(buttonElm);
        }
        this.menu.appendChild(buttonContainer);

        document.body.appendChild(this.menu);
    }

    show() {
        this.menu.style.display = 'flex';
    }

    hide() {
        this.menu.style.display = 'none';
    }

    updateLabel(label) {
        this.menu.querySelector(".label p").innerHTML = label;
    }
}
