let ontoElement = getOntotextYasgui('yasr-custom-element');

ontoElement.config = {
  ...ontoElement.config,
  yasrToolbarPlugins: [
    {
      createElement: (yasr) => {
        const exploreVisualButtonWrapperElement = document.createElement('div');
        exploreVisualButtonWrapperElement.classList.add('custom-button-wrapper');
        const customButton = document.createElement('button');
        customButton.innerText = 'Custom button';
        customButton.classList.add("yasr-custom-button");
        exploreVisualButtonWrapperElement.onclick = function () {
          const elementCreatedAfterButtonClicked = document.createElement('span');
          elementCreatedAfterButtonClicked.innerText = 'This element is created after custom button is clicked.';
          elementCreatedAfterButtonClicked.classList.add('element-created-after-button-clicked')
          document.querySelector('#result-area').appendChild(elementCreatedAfterButtonClicked);

        };
        exploreVisualButtonWrapperElement.appendChild(customButton);
        return exploreVisualButtonWrapperElement;
      },
      updateElement: (element, yasr) => {
        const elementCreatedOnUpdate = document.createElement('span');
        elementCreatedOnUpdate.classList.add('element-created-on-update');
        elementCreatedOnUpdate.innerText = 'This element is created on update function called.';
        document.querySelector('#result-area').appendChild(elementCreatedOnUpdate);
      },
      getOrder: () => {
        return 2;
      }
    },
    {
      createElement: (yasr) => {
        const secondElement = document.createElement('div');
        secondElement.classList.add('custom-button-wrapper-two');
        secondElement.innerText = 'Second described Element that have to be first';
        return secondElement;
      },
      updateElement: (element, yasr) => {
      },
      getOrder: () => {
        return 1;
      }
    }
  ]
}
