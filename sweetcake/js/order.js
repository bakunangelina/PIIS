document.addEventListener('DOMContentLoaded', function() {
    // Элементы формы
    const formSteps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const nextStepBtns = document.querySelectorAll('.btn-next-step');
    const prevStepBtns = document.querySelectorAll('.btn-prev-step');
    const orderForm = document.getElementById('custom-order-form');
    const deliveryDateInput = document.getElementById('delivery-date');

    // Устанавливаем минимальную дату доставки (через 3 дня)
    if (deliveryDateInput) {
        const today = new Date();
        const minDate = new Date();
        minDate.setDate(today.getDate() + 3);
        deliveryDateInput.min = minDate.toISOString().split('T')[0];
    }

    // Функция для перехода к шагу
    function goToStep(stepNumber) {
        formSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === stepNumber) {
                step.classList.add('active');
            }
        });

        stepIndicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (parseInt(indicator.dataset.step) <= stepNumber) {
                indicator.classList.add('active');
            }
        });

        // Прокручиваем к верху формы
        window.scrollTo({
            top: orderForm.offsetTop - 100,
            behavior: 'smooth'
        });
    }

    // Обработчики для кнопок "Далее"
    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = btn.closest('.form-step');
            const nextStepNumber = parseInt(currentStep.dataset.step) + 1;

            // Проверяем валидность текущего шага
            if (validateStep(currentStep)) {
                goToStep(nextStepNumber);
            }
        });
    });

    // Обработчики для кнопок "Назад"
    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStep = btn.closest('.form-step');
            const prevStepNumber = parseInt(currentStep.dataset.step) - 1;
            goToStep(prevStepNumber);
        });
    });

    // Функция валидации шага
    function validateStep(step) {
        let isValid = true;
        const requiredInputs = step.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff4d4f';
                isValid = false;

                // Прокручиваем к первому невалидному полю
                if (isValid === false) {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    input.focus();
                }
            } else {
                input.style.borderColor = '';
            }
        });

        return isValid;
    }

    // Форматирование номера телефона
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue = '+375 (';

                if (value.length > 2) {
                    formattedValue += value.substring(0, 2) + ') ' + value.substring(2, 5);
                } else {
                    formattedValue += value.substring(0, 2);
                }

                if (value.length > 5) {
                    formattedValue += '-' + value.substring(5, 7);
                }

                if (value.length > 7) {
                    formattedValue += '-' + value.substring(7, 9);
                }
            }

            this.value = formattedValue;
        });
    }

    // Обработчик отправки формы
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверяем валидность последнего шага
            if (validateStep(formSteps[formSteps.length - 1])) {
                // В реальном проекте здесь будет отправка данных на сервер
                const formData = new FormData(orderForm);
                const data = Object.fromEntries(formData.entries());

                console.log('Данные заказа:', data);

                // Показываем модальное окно успеха
                document.getElementById('order-success-modal').classList.add('active');
                document.body.style.overflow = 'hidden';

                // Очищаем форму
                orderForm.reset();
            }
        });
    }

    // Закрытие модального окна успеха
    const closeSuccessModal = document.getElementById('close-success-modal');
    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', function() {
            document.getElementById('order-success-modal').classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});