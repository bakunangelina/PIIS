document.addEventListener('DOMContentLoaded', function () {
    const targets = document.querySelectorAll('.target');
    let draggedElement = null; // элемент, который перемещаем
    let offsetX = 0, offsetY = 0;
    let isStuckToMouse = false; // приклеен ли элемент
    let originalPosition = { top: 0, left: 0 };

    targets.forEach(target => {

        target.addEventListener('mousedown', startDragging);
        target.addEventListener('touchstart', startDragging);

        target.addEventListener('dblclick', stickToMouse);
        target.addEventListener('touchstart', stickToMouse);

        target.addEventListener('click', unstickFromMouse);
        target.addEventListener('touchend', unstickFromMouse);
    });


    function startDragging(event) {
        if (!isStuckToMouse) {
            draggedElement = event.target;
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;

            offsetX = clientX - draggedElement.offsetLeft;
            offsetY = clientY - draggedElement.offsetTop;
            originalPosition = {
                top: draggedElement.style.top,
                left: draggedElement.style.left
            };
        }
    }

    function stickToMouse(event) {
        draggedElement = event.target;
        isStuckToMouse = true;
        draggedElement.style.backgroundColor = 'green';
    }

    function unstickFromMouse(event) {
        if (isStuckToMouse) {
            isStuckToMouse = false;
            draggedElement.style.backgroundColor = 'red';
            draggedElement = null;
        }
    }

    // let lastTapTime = 0;
    // function handleDoubleTap(event) {
    //     const currentTime = new Date().getTime();
    //     const tapInterval = currentTime - lastTapTime;
    //
    //     if (tapInterval < 300 && tapInterval > 0) {
    //         stickToMouse(event);
    //     }
    //
    //     lastTapTime = currentTime;
    // }

    document.addEventListener('mousemove', moveElement);
    document.addEventListener('touchmove', moveElement);

    function moveElement(event) {
        if (draggedElement) {
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;

            let newX = clientX - offsetX;
            let newY = clientY - offsetY;

            draggedElement.style.left = newX + 'px';
            draggedElement.style.top = newY + 'px';
        }
    }


    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);

    function stopDragging(event) {
        if (!isStuckToMouse) {
            draggedElement = null;
        }
    }

    // Не робит(((
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length === 2 && draggedElement) {
            draggedElement.style.top = originalPosition.top;
            draggedElement.style.left = originalPosition.left;
            draggedElement.style.backgroundColor = 'red';
            draggedElement = null;
            isStuckToMouse = false;
        }
    });


    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && draggedElement) {
            draggedElement.style.top = originalPosition.top;
            draggedElement.style.left = originalPosition.left;
            draggedElement.style.backgroundColor = 'red';
            draggedElement = null;
            isStuckToMouse = false;
        }
    });
});
